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

export interface MotorSubTypeResponse extends ApiResponse {
  underwriter_products: MotorSubTypeItem[];
}

export interface MotorSubTypeItem {
  product_rate: {
    id: string;
    covertype_id: string;
    rate: number;
    min_sum_insured: number;
    max_sum_insured: number;
    least_premium_amount: number;
  };
  underwriter_product: {
    id: string;
    type: string;
    underwriter_name: string;
    name: string;
    description: string;
    periods: any;
    has_tonnage: boolean;
    has_seats: boolean;
    subtype: string;
    product_type: string;
    yom_range: number;
    premium_amount: {
      one_time_payment: number;
    };
    image_url: string;
    additional_benefits: {
      id: string;
      name: string;
      duration_days: number;
      base_amount: number;
      currency: string;
      percentage: number;
    }[];
    applicable_excesses: {
      id: string;
      name: string;
      percentage: number;
      minimum_amount: number;
      currency: string;
      additional_amount: number;
      conditions: string;
    }[];
    product_benefits: {
      name: string;
      limits: { label?: string; amount: number; currency: string }[];
    }[];
  };
}

export type OtpPayload = { msisdn: string; user_type: string; otp: string };

export interface vehiclePayload {
  vehicle_value: number | null;
  registration_number: string;
  model: string;
  chassis_number: string;
  date: string;
  make: string;
  engine_capacity: number | null;
  body_type: string;
  seating_capacity: number | null;
  vehicle_type: string;
  year_of_manufacture: number;
  tonnage?: string;
}

export interface UserPayload {
  msisdn: string;
  password: string;
  confirm_password: string;
  name: string;
  id_number: string;
  email: string;
  kra_pin: string;
  user_type: string;
}
