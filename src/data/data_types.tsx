// * types and interfaces defining our data models in UI_data.tsx

type img_url = string;
type statusType = "pending" | "success" | "failed";

export type $Admin = {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  password: string;
  active: boolean;
};
