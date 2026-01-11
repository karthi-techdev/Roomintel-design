import { create } from "zustand";
import {
  billingAddressService,
  BillingAddress,
  Address,
} from "@/api/billingAddressService";

interface BillingAddressState {
  billingAddresses: BillingAddress[];
  billingAddress: BillingAddress | null;

  isLoading: boolean;
  error: string | null;

  /* ---------- Actions ---------- */
  fetchAllBillingAddresses: () => Promise<void>;
  fetchBillingAddressByCustomerId: (customerId: string) => Promise<void>;
  createBillingAddress: (payload: any) => Promise<void>;
  updateBillingAddress: (
    billingId: string,
    addressId: string | undefined,
    payload: Partial<Address>
  ) => Promise<void>;
  softDeleteBillingAddress: (
    billingId: string,
    addressId: string
  ) => Promise<void>;
  deleteBillingAddressPermanently: (
    billingId: string,
    addressId: string
  ) => Promise<void>;
  setDefaultBillingAddress: (
    customerId: string,
    addressId: string
  ) => Promise<void>;
}

export const useBillingAddressStore = create<BillingAddressState>((set) => ({
  billingAddresses: [],
  billingAddress: null,

  isLoading: false,
  error: null,

  /* ---------- GET ALL ---------- */
  fetchAllBillingAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await billingAddressService.getAllBillingAddresses();
      set({ billingAddresses: data, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to load billing addresses",
      });
      console.error("Fetch billing addresses failed:", err);
    }
  },

  /* ---------- GET BY CUSTOMER ---------- */
  fetchBillingAddressByCustomerId: async (customerId) => {
    set({ isLoading: true, error: null });
    try {
      const data =
        await billingAddressService.getBillingAddressByCustomerId(customerId);
      set({ billingAddress: data, isLoading: false });
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        set({ billingAddress: null, isLoading: false });
        return;
      }

      set({
        isLoading: false,
        error: err.message || "Failed to load billing address",
      });
      console.error("Fetch billing address failed:", err);
    }
  },

  /* ---------- CREATE ---------- */
  createBillingAddress: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await billingAddressService.createBillingAddress(payload);
      set({ billingAddress: data, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to create billing address",
      });
      console.error("Create billing address failed:", err);
    }
  },

  /* ---------- UPDATE ---------- */
  updateBillingAddress: async (
    billingId: string,
    addressId: string | undefined,
    payload: Partial<Address>
  ) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Updating billing address:", billingId, addressId, payload);
      const updatedData = await billingAddressService.updateBillingAddress(billingId, addressId, payload);
      set({ billingAddress: updatedData, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to update billing address",
      });
      console.error("Update billing address failed:", err);
    }
  },



  /* ---------- SOFT DELETE ---------- */
  softDeleteBillingAddress: async (billingId, addressId) => {
    set({ isLoading: true, error: null });
    try {
      await billingAddressService.softDeleteBillingAddress(
        billingId,
        addressId
      );
      set({ isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to delete billing address",
      });
      console.error("Soft delete failed:", err);
    }
  },

  /* ---------- PERMANENT DELETE ---------- */
  deleteBillingAddressPermanently: async (billingId, addressId) => {
    set({ isLoading: true, error: null });
    try {
      await billingAddressService.deleteBillingAddressPermanently(
        billingId,
        addressId
      );
      set({ isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to permanently delete billing address",
      });
      console.error("Permanent delete failed:", err);
    }
  },

  /* ---------- SET DEFAULT ---------- */
  setDefaultBillingAddress: async (customerId, addressId) => {
    set({ isLoading: true, error: null });
    try {
      const data =
        await billingAddressService.setDefaultBillingAddress(
          customerId,
          addressId
        );
      set({ billingAddress: data, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to set default address",
      });
      console.error("Set default address failed:", err);
    }
  },
}));
