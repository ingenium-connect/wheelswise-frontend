import { int, string } from "zod";

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

export type AdditionalBenefit = {
  id: string;
  name: string;
  included: boolean;
  duration_days: number;
  base_amount: number;
  currency: string;
  underwriter_product_id: string;
  percentage: number;
};

export type ProductBenefits = {
  underwriter_product_id: string;
  product_benefits: {
    id: string;
    name: string;
    limits?: { amount: string; currency: string; label?: string }[];
    description?: string;
  }[];
  applicable_excesses: {
    name: string;
    id: string;
    percentage: number;
    percentage_of: string;
    minimum_amount: number;
    currency: string;
    additional_amount: number;
    conditions: string;
  }[];
  additional_benefits: AdditionalBenefit[];
};

export type MotorSubTypeItem = {
  // Present for COMPREHENSIVE plans
  product_rate?: {
    id: string;
    covertype_id: string;
    rate: number;
    min_sum_insured: number;
    max_sum_insured: number;
    least_premium_amount: number;
  };
  // Present for THIRD_PARTY plans
  tpo_price_list?: {
    id: string;
    category: {
      name: string;
      options: { description: string; base_price: number }[];
    };
    product_id: string;
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
    additional_benefits: AdditionalBenefit[];
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
};

export type OtpPayload = { msisdn: string; user_type: string; otp: string };

export interface vehiclePayload {
  vehicle_value: number | null;
  registration_number: string;
  model: string;
  chassis_number: string;
  make: string;
  engine_capacity: number | null;
  engine_number?: string;
  body_type: string;
  seating_capacity: number | null;
  purpose?: string;
  purpose_type?: number | null;
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

// types/vehicle.ts
export type Vehicle = {
  id: string;
  chassis_number: string;
  registration_number: string;
  make: string;
  model: string;
  owner: string;
  vehicle_value: number;
  seating_capacity: number;
  tonnage?: number;
  body_type: string;
  purpose?: string;
  purpose_type?: number;
  year_of_manufacture: number;
  active_policy?: InsurancePolicy | null;
};

// types/policy.ts
export type InsurancePolicy = {
  id: string;
  vehicleName: string;
  registration: string;
  days: number;
  policyNumber: string;
  policy_type: "COMPREHENSIVE" | "THIRD PARTY";
  premium: number;
  end_date: string;
  start_date: string;
  vehicle_details: {
    make: string;
    model: string;
    registration_number: string;
  };
};

export type policyResponse = {
  policies: InsurancePolicy[];
  total_count: number;
};

export type UserProfile = {
  id: string;
  name: string;
  msisdn: string;
  id_number: string;
  email: string;
  kra_pin: string;
  is_active: boolean;
  user_type: string;
};

export type UIMappedPaymentMethod = PaymentMethod & {
  uiKey: string;
};

export type TpoOption = "PRIVATE" | "COMMERCIAL";
