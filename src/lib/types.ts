export {};

export interface $ResponseData {
  auth: {
    token: string;
  },
  data: {
    code: number;
    message: string;
    data: any
  }
}