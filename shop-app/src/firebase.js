import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  limit,
  where,
  getDoc,
  runTransaction,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
  writeBatch,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClqX67PbnRlhmZJ1hGG6rqCktjmqH2XEA",
  authDomain: "shop-app-3ea82.firebaseapp.com",
  projectId: "shop-app-3ea82",
  storageBucket: "shop-app-3ea82.appspot.com",
  messagingSenderId: "83453630759",
  appId: "1:83453630759:web:d2cf9a6528b49c0fdc3102",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function getCollection(...path) {
  // 이건 스프레드 문법이 아니고 ... 해서 파라미터들을 배열로 받겠다
  let newPath = path;
  // console.log(path);
  if (typeof path[0] !== "string") {
    newPath = path.flat();
    // 까대기 쳐주는 함수 ==> 평탄화 ex) flat(1)쓰면 ==> [1,[2,[3,4]],5] => flat() [1,2,[3,4],5]
    // flat(Infinity) ==> 모두다 펼칠수 있다.. ==> [1,2,3,4,5]
  }
  return collection(db, ...newPath);
}

function getUserAuth() {
  return auth;
}

async function getLastNum(collectionName, field) {
  const q = query(
    collection(db, collectionName),
    orderBy(field, "desc"),
    limit(1)
  );
  const lastDoc = await getDocs(q);
  if (lastDoc.docs.length === 0) return 0;
  const lastNum = lastDoc.docs[0].data()[field];
  return lastNum;
}

function getQuery(collectionName, queryOption) {
  const { conditions = [], orderBys = [], limits } = queryOption;
  const collect = getCollection(collectionName);
  let q = query(collect);

  //where 조건
  conditions.forEach((condition) => {
    q = query(q, where(condition.field, condition.operator, condition.value));
  });

  //orderBy 조건
  orderBys.forEach((order) => {
    q = query(q, orderBy(order.field, order.direction || "asc"));
  });

  //limit 조건
  q = query(q, limit(limits));

  return q;
}
async function getDatas(collectionName, queryOptions) {
  const q = getQuery(collectionName, queryOptions);
  const snapshot = await getDocs(q);
  const docs = snapshot.docs;
  const resultData = docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }));
  return resultData;
}

async function getData(collectionName, queryOptions) {
  const q = getQuery(collectionName, queryOptions);
  const snapshot = await getDocs(q);
  const doc = snapshot.docs[0];
  const resultData = {
    ...doc.data(),
    docId: doc.id,
  };
  return resultData;
}

async function joinUser(uid, email) {
  await setDoc(doc(db, "users", uid), { email: email });
}

async function syncCart(uid, cartArr) {
  // 하위컬렉션에 접근하는방법
  const cartRef = getCollection("users", uid, "cart");
  // collection(db,"users") 까지만 해서 접근했었음
  // doc(db,"users",userDocId) 라고 한개의 문서로 접근했었음
  // ==> 근데 한개씩 늘어난거는 users라는 컬렉션의 uid로 문서이름 찾고, cart라는 하위 컬렉션에서의 여러 아이템중 cartDocId 라는 한개의 아이템만 접근한다.
  const batch = writeBatch(db);
  // batch란 반복문처럼 한개의 아이템씩 문서를 생성하고 또 파이어베이스 접근해서 또 한개 생성하고 또 ... 이렇게 여러번을 반복할때 한번에 파이어베이스에 접근하라고 알려주는 함수(여러개의 작업을 몰아서 한꺼번에 한다)

  // (db,문서명,문서id) 이렇게 만드는데 위에 cartRef 에서 db,문서명 까지는 만들었어 그래서 뒤에 new Date써서 그걸 문서 id로 쓴거야

  for (const item of cartArr) {
    const result = await updateQuantity(uid, item);
    if (!result) {
      const itemRef = doc(cartRef, item.id.toString());
      batch.set(itemRef, item);
    }
  }

  await batch.commit();
  const resultData = await getDatas(["users", uid, "cart"], {});
  return resultData;
}

async function updateQuantity(uid, cartItem) {
  const cartRef = getCollection("users", uid, "cart");
  const itemRef = doc(cartRef, cartItem.id.toString());

  //문서가 존재하는지 확인

  const itemDoc = await getDoc(itemRef);
  if (itemDoc.exists()) {
    // const currentData = itemDoc.data();
    // const updatedQuantity = (currentData.quantity || 0) + 1;
    // await updateDoc(itemRef, { quantity: updatedQuantity });
    return true;
  } else {
    return false;
  }
}

async function createOrder(uid, orderObj) {
  try {
    //1. orders 컬렉션에 데이터 추가
    //1.1 orderRef 객체 생성 ("users",uid,"orders")
    const orderRef = getCollection("users", uid, "orders");

    //==> orders 까지 접근후 문서 생성까지 해야하니까

    //1.2 생성할 객체를 만들어 준다. createObj ={} ==> createdAt, cancelYn, updatedAt, 기존 orderObj 프로퍼티들
    console.log(orderRef);
    const time = new Date().getTime();

    const createObj = {
      createdAt: time,
      updatedAt: time,
      cancelYn: "N",
      ...orderObj,
    };
    //1.3 await addDoc
    const docRef = await addDoc(orderRef, createObj);
    //2. cart 문서 삭제
    //2.1 batch 객체를 생성. writeBatch(db)
    const batch = writeBatch(db);

    const cartRef = getCollection("users", uid, "cart");
    //2.2 orderObj.products.forEach()를 사용하여 삭제 할 docRef를 생성한다
    orderObj.products.forEach((item) => {
      //2.3 batch.delete(docRef)
      const docRef = doc(cartRef, item.id.toString());
      console.log(docRef);
      batch.delete(docRef);
    });
    //forEach 가 끝나면 await batch.commit
    await batch.commit();
    return docRef.id;
  } catch (error) {
    console.error(error);
  }
}

async function deleteDatas(collectionName, docId) {
  try {
    const cartRef = getCollection(collectionName);
    const docRef = doc(cartRef, docId.toString());
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.log("Error Delete", error);
  }
}

async function addCart(collectionName, cartObj) {
  const collectionRef = getCollection(collectionName);
  const cartRef = doc(collectionRef, cartObj.id.toString());
  await setDoc(cartRef, cartObj);
}

async function updateTotalAndQuantity(uid, docId, operator) {
  const cartRef = getCollection("users", uid, "cart");
  const itemRef = doc(cartRef, docId.toString());

  const itemDoc = await getDoc(itemRef);
  const itemData = itemDoc.data();

  let updatedQuantity;

  if (operator == "increment") {
    updatedQuantity = itemData.quantity + 1;
  } else {
    updatedQuantity = itemData.quantity - 1;
  }
  const updatedTotal = itemData.price * updatedQuantity;
  const updateObj = {
    quantity: updatedQuantity,
    total: updatedTotal,
  };
  await updateDoc(itemRef, updateObj);
}

export {
  getDatas,
  getData,
  getUserAuth,
  joinUser,
  syncCart,
  updateQuantity,
  deleteDatas,
  addCart,
  updateTotalAndQuantity,
  createOrder,
};
