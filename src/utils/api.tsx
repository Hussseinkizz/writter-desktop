import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function API(api_route: string, payload: any, userToken = '') {
  const baseUrl = 'https://kyc.kisa-developers.com/api/v1.0.0';

  const basePayload = {
    auth: {
      token: userToken,
    },
    data: payload,
  };

  basePayload.data = payload;
  basePayload.auth.token = userToken;

  // let response = useQuery(['ekyc_api', api_route], async () => {
  //   const response = await axios.post(
  //     `${baseUrl}${api_route}`,
  //     JSON.stringify(basePayload)
  //   );
  //   return response.data;
  // });

  return async () => {
    const response = await axios.post(
      `${baseUrl}${api_route}`,
      JSON.stringify(basePayload)
    );
    return response.data;
  };
}
