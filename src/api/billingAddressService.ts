import axiosInstance from "./axiosInstance";

/* ---------- Address Interface ---------- */
export interface Address {
  _id?: string | undefined;
  label?: string;
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string[];
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  isDefault?: boolean;
  status?: string;
}

/* ---------- Billing Address Interface ---------- */
export interface BillingAddress {
  _id: string;
  customerId: string;
  addresses: Address[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ---------- Billing Address Service ---------- */
export const billingAddressService = {
  /* ---------- CREATE BILLING ADDRESS ---------- */
  createBillingAddress: async (
    payload: { customerId: string; addresses: any[] }
  ): Promise<BillingAddress> => {
    const response = await axiosInstance.post(
      "/site/billingaddress",
      {
        customersId: payload.customerId,
        addresses: payload.addresses
      }
    );
    return response.data.data || response.data;
  },

  /* ---------- GET ALL BILLING ADDRESSES ---------- */
  getAllBillingAddresses: async (): Promise<BillingAddress[]> => {
    const response = await axiosInstance.get("/site/billingaddress");
    return response.data.data?.data || [];
  },

  /* ---------- GET BILLING ADDRESS BY CUSTOMER ---------- */
  getBillingAddressByCustomerId: async (
    customerId: string
  ): Promise<BillingAddress> => {
    const response = await axiosInstance.get(
      `/site/billingaddress/getByCustomer/${customerId}`
    );
    return response.data.data || response.data;
  },

  /* ---------- UPDATE BILLING / ADDRESS ---------- */
  updateBillingAddress: async (
    billingId: string,
    addressId: string | undefined,
    payload: Partial<Address>
  ): Promise<BillingAddress> => {

    const url = addressId
      ? `/site/billingaddress/update/${billingId}/address/${addressId}`
      : `/site/billingaddress/update/${billingId}/address/`;

    const response = await axiosInstance.put(url, payload);
    return response.data.data || response.data;
  },



  /* ---------- GET ALL TRASH BILLING ADDRESSES ---------- */
  getAllTrashBillingAddresses: async (): Promise<BillingAddress[]> => {
    const response = await axiosInstance.get(
      "/site/billingaddress/trash"
    );
    return response.data.data?.data || [];
  },

  /* ---------- RESTORE BILLING ADDRESS ---------- */
  restoreBillingAddress: async (
    billingId: string,
    addressId: string
  ): Promise<BillingAddress> => {
    const response = await axiosInstance.patch(
      `/site/billingaddress/restore/${billingId}/address/${addressId}`
    );
    return response.data.data || response.data;
  },

  /* ---------- SOFT DELETE ADDRESS ---------- */
  softDeleteBillingAddress: async (
    billingId: string,
    addressId: string
  ): Promise<void> => {
    await axiosInstance.delete(
      `/site/billingaddress/softDelete/${billingId}/address/${addressId}`
    );
  },

  /* ---------- PERMANENT DELETE ADDRESS ---------- */
  deleteBillingAddressPermanently: async (
    billingId: string,
    addressId: string
  ): Promise<void> => {
    await axiosInstance.delete(
      `/site/billingaddress/permanentDelete/${billingId}/address/${addressId}`
    );
  },

  /* ---------- SET DEFAULT ADDRESS ---------- */
  setDefaultBillingAddress: async (
    customerId: string,
    addressId: string
  ): Promise<BillingAddress> => {
    const response = await axiosInstance.patch(
      `/site/billingaddress/setDefault/${customerId}/${addressId}`
    );
    return response.data.data || response.data;
  },
};
