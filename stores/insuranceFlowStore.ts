import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MotorSubTypeItem, MotorType, TpoOption, PersonalDetails } from "@/types/data";

/**
 * Consolidated Insurance Flow Store
 *
 * Merges the previous insuranceStore, vehicleStore, and personalDetailsStore
 * into a single store for better state management and easier reset.
 *
 * This store manages the entire insurance purchase flow from cover selection
 * to personal details entry.
 */

// ============================================================================
// Types
// ============================================================================

type SelectedMotorType = {
  id: string;
  name: string;
  description: string;
  image_url: string;
};

type VehicleDetails = {
  vehicleValue: number;
  engineCapacity: string;
  engineNumber: string;
  vehicleNumber: string;
  chassisNumber: string;
  make: string;
  model: string;
  year: string;
  bodyType: string;
  vehiclePurpose: string;
  vehiclePurposeCategory: string;
  ntsaRegistered: boolean;
};

type FlowMetadata = {
  lastUpdated: number;
  flowId: string;
  currentStep: number;
};

// ============================================================================
// State Interface
// ============================================================================

interface InsuranceFlowState {
  // Insurance selection state
  insurance: {
    cover: string | null;
    motorType: MotorType | null;
    vehicleValue: number;
    motorSubtype: MotorSubTypeItem | null;
    selectedAdditionalBenefitIds: string[];
    coverStep: number;
    tpoOption: string;
    isCoOwned: boolean | null;
  };

  // Vehicle information state
  vehicle: {
    selectedMotorType: SelectedMotorType | null;
    vehicleValue: string;
    seating_capacity: string;
    tonnage: number;
    tpo_category: string;
    vehicleDetails: VehicleDetails;
  };

  // Personal details state
  personal: {
    user: PersonalDetails;
    secondary_user?: PersonalDetails;
  };

  // Flow metadata
  _metadata: FlowMetadata;

  // ========================================================================
  // Insurance Actions
  // ========================================================================

  selectCover: (coverType: string) => void;
  setMotorType: (type: MotorType) => void;
  setVehicleValue: (value: number) => void;
  setVehicleSubType: (subtype: MotorSubTypeItem) => void;
  setSelectedAdditionalBenefitIds: (ids: string[]) => void;
  nextCoverStep: () => void;
  previousCoverStep: () => void;
  setCoverStep: (step: number) => void;
  setTpoOption: (option: TpoOption) => void;
  setIsCoOwned: (isCoOwned: boolean) => void;

  // ========================================================================
  // Vehicle Actions
  // ========================================================================

  setSelectedMotorType: (motorType: SelectedMotorType | null) => void;
  setVehicleValueString: (value: string) => void;
  setSeatingCapacity: (value: string) => void;
  setTonnage: (value: number) => void;
  setTpoCategory: (value: string) => void;
  setVehicleDetails: (payload: Partial<VehicleDetails>) => void;
  updateVehicleField: (
    field: keyof VehicleDetails,
    value: string | number | boolean,
  ) => void;
  resetVehicleDetails: () => void;

  // ========================================================================
  // Personal Details Actions
  // ========================================================================

  setPersonalDetails: (
    payload: Partial<PersonalDetails>,
    userType?: "user" | "secondary_user",
  ) => void;
  updatePersonalField: (
    field: keyof PersonalDetails,
    value: string | boolean,
    userType?: "user" | "secondary_user",
  ) => void;

  // ========================================================================
  // Flow Control Actions
  // ========================================================================

  validateStep: (step: number) => boolean;
  getFlowProgress: () => number;
  resetFlow: () => void;
  resetAll: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialVehicleDetails: VehicleDetails = {
  vehicleValue: 0,
  engineCapacity: "",
  engineNumber: "",
  vehicleNumber: "",
  chassisNumber: "",
  make: "",
  model: "",
  year: "",
  bodyType: "",
  vehiclePurpose: "",
  vehiclePurposeCategory: "",
  ntsaRegistered: false,
};

const initialPersonalDetails: PersonalDetails = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  idNumber: "",
  kraPin: "",
  ntsaRegistered: false,
};

const initialState = {
  insurance: {
    cover: null,
    motorType: null,
    vehicleValue: 0,
    motorSubtype: null,
    selectedAdditionalBenefitIds: [],
    coverStep: 0,
    tpoOption: "",
    isCoOwned: null,
  },
  vehicle: {
    selectedMotorType: null,
    vehicleValue: "",
    seating_capacity: "",
    tonnage: 0,
    tpo_category: "",
    vehicleDetails: initialVehicleDetails,
  },
  personal: {
    user: initialPersonalDetails,
  },
  _metadata: {
    lastUpdated: Date.now(),
    flowId: `flow_${Date.now()}`,
    currentStep: 0,
  },
};

// ============================================================================
// Store Implementation
// ============================================================================

export const useInsuranceFlowStore = create<InsuranceFlowState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ======================================================================
      // Insurance Actions
      // ======================================================================

      selectCover: (coverType) =>
        set((state) => ({
          insurance: { ...state.insurance, cover: coverType },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      setMotorType: (type) =>
        set((state) => ({
          insurance: { ...state.insurance, motorType: type },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      setVehicleValue: (value) =>
        set((state) => ({
          insurance: { ...state.insurance, vehicleValue: value },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      setVehicleSubType: (subtype) =>
        set((state) => ({
          insurance: { ...state.insurance, motorSubtype: subtype },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      setSelectedAdditionalBenefitIds: (ids) =>
        set((state) => ({
          insurance: { ...state.insurance, selectedAdditionalBenefitIds: ids },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      nextCoverStep: () =>
        set((state) => ({
          insurance: {
            ...state.insurance,
            coverStep: state.insurance.coverStep + 1,
          },
          _metadata: {
            ...state._metadata,
            currentStep: state.insurance.coverStep + 1,
            lastUpdated: Date.now(),
          },
        })),

      previousCoverStep: () =>
        set((state) => ({
          insurance: {
            ...state.insurance,
            coverStep: Math.max(0, state.insurance.coverStep - 1),
          },
          _metadata: {
            ...state._metadata,
            currentStep: Math.max(0, state.insurance.coverStep - 1),
            lastUpdated: Date.now(),
          },
        })),

      setCoverStep: (step) =>
        set((state) => ({
          insurance: { ...state.insurance, coverStep: step },
          _metadata: {
            ...state._metadata,
            currentStep: step,
            lastUpdated: Date.now(),
          },
        })),

      setTpoOption: (option) =>
        set((state) => ({
          insurance: { ...state.insurance, tpoOption: option },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      setIsCoOwned: (isCoOwned) =>
        set((state) => ({
          insurance: { ...state.insurance, isCoOwned },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      // ======================================================================
      // Vehicle Actions
      // ======================================================================

      setSelectedMotorType: (motorType) =>
        set((state) => ({
          vehicle: { ...state.vehicle, selectedMotorType: motorType },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      setVehicleValueString: (value) =>
        set((state) => ({
          vehicle: { ...state.vehicle, vehicleValue: value },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      setSeatingCapacity: (value) =>
        set((state) => ({
          vehicle: { ...state.vehicle, seating_capacity: value },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      setTonnage: (value) =>
        set((state) => ({
          vehicle: { ...state.vehicle, tonnage: value },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      setTpoCategory: (value) =>
        set((state) => ({
          vehicle: { ...state.vehicle, tpo_category: value },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      setVehicleDetails: (payload) =>
        set((state) => ({
          vehicle: {
            ...state.vehicle,
            vehicleDetails: { ...state.vehicle.vehicleDetails, ...payload },
          },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      updateVehicleField: (field, value) =>
        set((state) => ({
          vehicle: {
            ...state.vehicle,
            vehicleDetails: {
              ...state.vehicle.vehicleDetails,
              [field]: value,
            },
          },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      resetVehicleDetails: () =>
        set((state) => ({
          vehicle: { ...state.vehicle, vehicleDetails: initialVehicleDetails },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      // ======================================================================
      // Personal Details Actions
      // ======================================================================

      setPersonalDetails: (payload, userType = "user") =>
        set((state) => ({
          personal: {
            ...state.personal,
            [userType]: { ...state.personal[userType], ...payload },
          },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      updatePersonalField: (field, value, userType = "user") =>
        set((state) => ({
          personal: {
            ...state.personal,
            [userType]: {
              ...state.personal[userType],
              [field]: value,
            },
          },
          _metadata: { ...state._metadata, lastUpdated: Date.now() },
        })),

      // ======================================================================
      // Flow Control Actions
      // ======================================================================

      /**
       * Validates if user can access a given step
       * Returns true if all previous steps are completed
       */
      validateStep: (step: number) => {
        const state = get();
        const { insurance, vehicle, personal } = state;

        // Step 0: Cover type selection
        if (step === 0) return true;

        // Step 1: Motor type selection (requires cover)
        if (step === 1) return Boolean(insurance.cover);

        // Step 2: Vehicle value (requires cover + motor type)
        if (step === 2)
          return Boolean(insurance.cover && insurance.motorType);

        // Step 3: Motor subtype (requires value entered)
        if (step === 3)
          return Boolean(
            insurance.cover &&
              insurance.motorType &&
              (insurance.vehicleValue > 0 || vehicle.vehicleValue),
          );

        // Step 4: Vehicle details (requires subtype selected)
        if (step === 4)
          return Boolean(
            insurance.cover &&
              insurance.motorType &&
              insurance.motorSubtype,
          );

        // Step 5: Personal details (requires vehicle details)
        if (step === 5)
          return Boolean(
            insurance.cover &&
              insurance.motorType &&
              insurance.motorSubtype &&
              vehicle.vehicleDetails.make &&
              vehicle.vehicleDetails.model,
          );

        return false;
      },

      /**
       * Calculates flow completion percentage
       * Returns 0-100
       */
      getFlowProgress: () => {
        const state = get();
        const { insurance, vehicle, personal } = state;
        let completed = 0;
        const totalSteps = 6;

        if (insurance.cover) completed++;
        if (insurance.motorType) completed++;
        if (insurance.vehicleValue > 0 || vehicle.vehicleValue) completed++;
        if (insurance.motorSubtype) completed++;
        if (vehicle.vehicleDetails.make && vehicle.vehicleDetails.model)
          completed++;
        if (personal.user.email && personal.user.phoneNumber) completed++;

        return Math.round((completed / totalSteps) * 100);
      },

      /**
       * Resets the entire flow state
       * Use this after successful purchase or on logout
       */
      resetFlow: () =>
        set({
          ...initialState,
          _metadata: {
            lastUpdated: Date.now(),
            flowId: `flow_${Date.now()}`,
            currentStep: 0,
          },
        }),

      /**
       * Alias for resetFlow
       */
      resetAll: () => get().resetFlow(),
    }),
    {
      name: "insurance-flow-store",
      // Persist everything except metadata
      partialize: (state) => ({
        insurance: state.insurance,
        vehicle: state.vehicle,
        personal: state.personal,
      }),
    },
  ),
);

// ============================================================================
// Backwards Compatibility Exports
// ============================================================================

/**
 * @deprecated Use useInsuranceFlowStore instead
 * Kept for backwards compatibility during migration
 */
export const useInsuranceStore = useInsuranceFlowStore;

/**
 * @deprecated Use useInsuranceFlowStore instead
 * Kept for backwards compatibility during migration
 */
export const useVehicleStore = () => {
  const store = useInsuranceFlowStore();
  return {
    ...store.vehicle,
    selectedMotorType: store.vehicle.selectedMotorType,
    vehicleValue: store.vehicle.vehicleValue,
    seating_capacity: store.vehicle.seating_capacity,
    tonnage: store.vehicle.tonnage,
    tpo_category: store.vehicle.tpo_category,
    vehicleDetails: store.vehicle.vehicleDetails,
    setMotorType: store.setSelectedMotorType,
    setVehicleValue: store.setVehicleValueString,
    setSeatingCapacity: store.setSeatingCapacity,
    setTonnage: store.setTonnage,
    setTpoCategory: store.setTpoCategory,
    setVehicleDetails: store.setVehicleDetails,
    updateVehicleField: store.updateVehicleField,
    resetVehicleDetails: store.resetVehicleDetails,
    reset: store.resetFlow,
  };
};

/**
 * @deprecated Use useInsuranceFlowStore instead
 * Kept for backwards compatibility during migration
 */
export const usePersonalDetailsStore = () => {
  const store = useInsuranceFlowStore();
  return {
    personalDetails: store.personal,
    setPersonalDetails: store.setPersonalDetails,
    updateField: store.updatePersonalField,
    resetPersonalDetails: () => {
      store.setPersonalDetails(initialPersonalDetails, "user");
      if (store.personal.secondary_user) {
        store.setPersonalDetails(initialPersonalDetails, "secondary_user");
      }
    },
  };
};
