export interface LoginPayload {
  national_identifier: string;
  password: string;
  user_type: string;
}

export type PayloadT = {
  [key: string]: any;
};

export interface ApiResponse {
  total_count: number;
}

export interface MotorType {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export interface CoverType {
  id: string;
  name: string;
  code: string;
  type: string;
}

export interface MotorTypesResponse extends ApiResponse {
  motor_types: MotorType[];
}

export interface CoverTypesResponse extends ApiResponse {
  coverTypes: CoverType[];
}
