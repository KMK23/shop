import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addCart,
  createOrder,
  deleteDatas,
  syncCart,
  updateTotalAndQuantity,
} from "../../firebase";
import { addDatasRest, deleteDatasRest, deleteDatasRestBatch } from "../../API";

const initialState = {
  products: localStorage.getItem("cartProducts")
    ? JSON.parse(localStorage.getItem("cartProducts"))
    : [],
  totalPrice: 0,
  userId: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.products.push({
        ...action.payload,
        quantity: 1,
        total: action.payload.price,
      });
      localStorage.setItem("cartProducts", JSON.stringify(state.products));
    },
    deleteFromCart: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
      localStorage.setItem("cartProducts", JSON.stringify(state.products));
    },

    syncCartAndSlice: (state, action) => {
      state.products = action.payload;
      localStorage.setItem("cartProducts", JSON.stringify(state.products));
    },

    getTotalPrice: (state) => {
      state.totalPrice = state.products.reduce(
        (acc, product) => (acc += product.total),
        0
      );
    },
    incrementProduct: (state, action) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload
      );
      state.products[index].quantity += 1;
      state.products[index].total += state.products[index].price;

      localStorage.setItem("cartProducts", JSON.stringify(state.products));
    },
    decrementProduct: (state, action) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload
      );
      state.products[index].quantity = state.products[index].quantity - 1;
      state.products[index].total =
        state.products[index].total - state.products[index].price;

      localStorage.setItem("cartProducts", JSON.stringify(state.products));
    },
    sendOrder: (state) => {
      // 카트에있는걸 주문했다고 치면 비워져아함
      state.products = [];
      localStorage.setItem("cartProducts", JSON.stringify(state.products));
    },
  },
});

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ collectionName, productId }, thunkAPI) => {
    try {
      const resultData = await deleteDatas(collectionName, productId);
      if (resultData) {
        thunkAPI.dispatch(deleteFromCart(productId));
        //순서 1번 이게 끝나면 나머지 위에 deleteCartItem 이 실행되는것
      }
    } catch (error) {
      return thunkAPI.rejectWithValue("Error Delete CartItem");
      // rejected 일때 원래 위에 쓰는것들이 여기서 써버리면 위에다가 builder를 써서 위에 써버려야해.
    }
  }
);

export const syncCartAndStorage = createAsyncThunk(
  // 이건 왜 하냐면 firebase와 씽크를 맞추기 위해
  "cart/syncCartItem",
  async ({ uid, cartItems }, thunkAPI) => {
    // 여기있는 cartItems는 localStorage 에서 가져온것
    try {
      const result = await syncCart(uid, cartItems);
      thunkAPI.dispatch(syncCartAndSlice(result));
    } catch (error) {
      console.log(error);
    }
  }
);

export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async ({ collectionName, product }, thunkAPI) => {
    // const resultData = await addDatas();
    try {
      await thunkAPI.dispatch(addToCart(product));
      const {
        cartSlice: { products },
      } = thunkAPI.getState();
      // const products = thunkAPI.getState().cartSlice
      const addItem = products.find(
        (sliceProduct) => sliceProduct.id === product.id
      );
      console.log(addItem);
      await addDatasRest(collectionName, addItem);
    } catch (error) {}
  }
);

export const calculateTotalAndQuantity = createAsyncThunk(
  "cart/cartItemCalCulate",
  async ({ uid, productId, operator }, thunkAPI) => {
    try {
      await updateTotalAndQuantity(uid, productId, operator);
      if (operator === "increment") {
        thunkAPI.dispatch(incrementProduct(productId));
      } else {
        thunkAPI.dispatch(decrementProduct(productId));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const postOrder = createAsyncThunk(
  "cart/createOrder",
  async ({ uid, cart }, thunkAPI) => {
    try {
      //createOrder 함수 호출 (firebase에서) 파라미터는 uid, orderObj였음
      console.log(cart);
      console.log(uid);
      // const result = await createOrder(uid, cart);
      const orderObj = {
        cancelYn: "N",
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        ...cart,
      };

      const result = await addDatasRest(
        `/users/${uid}/orders/${crypto.randomUUID().slice(0, 20)}`,
        orderObj
      );

      const deleteResult = await deleteDatasRestBatch(
        `/users/${uid}/cart/`,
        cart.products
      );

      if (!result) return;
      //cartSlice.products 초기화 및 로컬스토리지 초기화(sendOrder 만들었음)
      thunkAPI.dispatch(sendOrder());
      //==> thunkAPI.dispatch
    } catch (error) {
      console.log(error);
    }
  }
);
//파이어베이스에 카트 지워야ㅑ하고 오더 추가해야하고 그러면
export default cartSlice.reducer;
export const {
  addToCart,
  getTotalPrice,
  incrementProduct,
  decrementProduct,
  deleteFromCart,
  syncCartAndSlice,
  sendOrder,
} = cartSlice.actions;
