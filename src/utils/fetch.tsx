import { POST } from "./z-fetch.js";

interface FetchProps {
  api_route: string;
  payload: any;
}

const baseUrl = "https://kyc.kisa-developers.com/api/v1.0.0";
// let userToken = ''; // can be from local storage or state

const basePayload = {
  auth: {
    token: "",
  },
  data: {},
};

export async function _useFetch(
  api_route: string,
  payload: any,
  userToken = "",
  noBaseUrl = false,
  noBasePayload = false,
) {
  basePayload.data = payload;
  basePayload.auth.token = userToken;

  const response = await POST(
    noBaseUrl ? api_route : `${baseUrl}${api_route}`,
    {
      body: JSON.stringify(noBasePayload ? payload : basePayload),
    },
  );

  return response;
}

const sampleBaseUrl = "https://jsonplaceholder.typicode.com";
const sampleBaseUrl2 = "https://fakestoreapi.com";
// export async function useFetch(api_route: string, payload = {}) {
//   const response = await get(`${sampleBaseUrl2}${api_route}`, {});

//   return response;
// }
// let sampleBaseUrl = 'https://jsonplaceholder.typicode.com';
// export async function useFetch(api_route: string, payload = {}) {
//   const response = await post(`${sampleBaseUrl}${api_route}`, {
//     body: JSON.stringify(payload),
//   });

//   return response;
// }
