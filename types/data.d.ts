import { int } from "zod";

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

export interface StaticBenefit {
  label: string;
  amount: number;
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
    period: any;
    underwriter_id: string;
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
  make: string;
  engine_capacity: number | null;
  body_type: string;
  seating_capacity: number | null;
  vehicle_type: string;
  year_of_manufacture: number;
  tonnage?: number;
}

export interface FinalVehiclePayload {
  source: string;
  vehicle: vehiclePayload;
}

export interface UserPayload {
  msisdn: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  id_number: string;
  email: string;
  kra_pin: string;
  user_type: string;
}

export interface FinalUserPayload {
  source: string;
  source_vehicle_reg_number: string;
  user: UserPayload;
}

export interface PaymentMethods {
  id: string;
  name: string;
  description: string;
  underwriter_id: string;
  duration: number;
}

export interface ProductPremiumAmount {
  one_time_payment: number;
}

export interface UnderwriterProduct {
  id: string;
  type: string;
  underwriter_name: string;
  name: string;
  description: string;
  period: number;
  has_tonnage: boolean;
  has_seats: boolean;
  underwriter_id: string;
  created_by: string;
  is_active: boolean;
  date_created: string; // or Date if you parse it
  updated_at: string;
  subtype: string;
  fixed_policy_number: string;
  product_type: string;
  premium_amount: ProductPremiumAmount;
  yom_range: number;
  product_class: string;
  image_url: string;
}

export interface InsuranceCover {
  id: string;
  covertype_id: string;
  rate: number;
  min_sum_insured: number;
  max_sum_insured: number;
  least_premium_amount: number;
  product: UnderwriterProduct;
}