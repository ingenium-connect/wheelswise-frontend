export interface LoginPayload {
  national_identifier: string;
  password: string;
  user_type: string;
}

export type PayloadT = {
  [key: string]: any;
};
