import axios from "axios";
import {
  parseFirestoreFields,
  toFirestoreFields,
} from "./utils/firebaseTranslate";

const API_KEY = "AIzaSyClqX67PbnRlhmZJ1hGG6rqCktjmqH2XEA";
const AUTH_TOKEN =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ0MjY5YTE3MzBlNTA3MTllNmIxNjA2ZTQyYzNhYjMyYjEyODA0NDkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc2hvcC1hcHAtM2VhODIiLCJhdWQiOiJzaG9wLWFwcC0zZWE4MiIsImF1dGhfdGltZSI6MTcyMzc5NjYzMSwidXNlcl9pZCI6ImdqSmR1UDlRSThOVk9EZFlsd2FkbXVhdTlvRDIiLCJzdWIiOiJnakpkdVA5UUk4TlZPRGRZbHdhZG11YXU5b0QyIiwiaWF0IjoxNzIzNzk2NjMxLCJleHAiOjE3MjM4MDAyMzEsImVtYWlsIjoia21qbmgxMkBuYXZlci5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsia21qbmgxMkBuYXZlci5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.cpjxbYu4m0JoAWZeI_yR2d-zzYUvPHWfesc0Vhi_XZc0jnSwybFJBp8Pe3LthsP5A4KT9k0jONNEVmpSBp_fU3X8MDjIeJaZLJM9RgxQXcYPEi0vxuixUI7a3JyYq9UdlrhOQZTWsdrYXeenFWFaZcPTQLnZ2ajyXQgRLJydXKVOuDOH6SSh5v7X_WI3HgL2qdZWHSkSc6-OGh33DkCUeieExJ9kB9qPgBkpkz0JNtL3Bt6FzkyckOwF8euzZvRXDsILZqPiajVNpknW3Lafqw4wHLzd3fQmpYnq4dlEQf86_76Y9UrvmhX5dSuZNlqM6V9CNmixaYLxWkfiHRUkZA";
const BASE_URL =
  "https://firestore.googleapis.com/v1/projects/shop-app-3ea82/databases/(default)/documents";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: { "Content-Type": "aplication/json" }, // 기본값임

  //   이것들이 axios 의 options 객체임
});
// axios.get("URL", requestBody: {

// })
// options:{

// })
// options를 위에 미리 만들어 놓은것

function getResultData(response) {
  if (response.data.length > 0) {
    const result = response.data.map((data) => {
      return {
        ...parseFirestoreFields(data.document.fields),
        docId: data.document.name.split("/").pop(),
      };
    });
    return result;
  } else {
    return {
      ...parseFirestoreFields(response.data.fields),
      docId: response.data.name.split("/").pop(),
    };
  }
}

export async function getDatasRest(collectionName, queryOptions) {
  const { conditions } = queryOptions;
  const [condition] = conditions;
  const { field, operator, value } = condition;
  try {
    const response = await api.post(":runQuery", {
      structuredQuery: {
        // 필요한것만 쓰면 된다.
        from: [{ collectionId: collectionName }],
        where: {
          fieldFilter: {
            field: { fieldPath: field },
            op: operator,
            value: { stringValue: value },
          },
        },
      },
    });
    return getResultData(response);
    // console.log(response.data);
    // console.log(getResultData(response.data))
  } catch (error) {
    console.error("데이터 가져오기 오류 : ", error);
  }
}

export async function getDataRest(url) {
  // /products/productDocId
  const response = await api.get(url);
  return getResultData(response);
}

export async function addDatasRest(url, addObj) {
  try {
    await api.patch(url, { fields: toFirestoreFields(addObj) });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteDatasRest(url) {
  try {
    await api.delete(url);
    return true;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function deleteDatasRestBatch(url, dataArr) {
  try {
    for (const item of dataArr) {
      const response = await api.delete(`${url}${item.id}`);
    }
    // const requests = dataArr.map((item) => {
    //   return {
    //     delete: `projects/shop-app-3ea82/databases/(default)/documents/${url}/${item.id}`,
    //   };
    // });

    // const response = await api.post(
    //   ":batchWrite", //==> URL 이되는거고
    //   { writes: requests }, //==> requests body
    //   {
    //     headers: {
    //       Authorization: `Bearer ${AUTH_TOKEN}`,
    //     },
    //   } //==> queryParameter
    // );
    return true;
  } catch (error) {
    console.error(
      "Batch delete error :",
      error.response ? error.response.data : error.message
    );
    return false;
  }
}
