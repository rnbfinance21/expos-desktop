/* eslint-disable no-console */

import axios from "../utils/axios";

enum SupplierUrl {
  GET_SUPPLIER = "/api/supplier",
  GET_SUPPLIER_NAME = "/api/supplier/list",
  SAVE_SUPPLIER = "/api/supplier/create",
  DELETE_SUPPLIER = "/api/supplier/delete",
}

export type SupplierData = {
  id: number;
  outlet_id: number;
  supplier_id: number;
  tanggal: string;
  jumlah: number;
  state: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  outlet_name: string;
  supplier_name: string;
};

export type SupplierName = {
  id: number;
  name: string;
  address: string;
  order_number: number;
  state: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GetSupplierParams = {
  date: string;
  search: string;
};

export type SaveSupplierParams = {
  supplier_id: number;
  jumlah: string;
};

export type GetSupplierResponse = {
  code: number;
  message: string;
  data: SupplierData[];
};

export type GetSupplierNameResponse = {
  code: number;
  message: string;
  data: SupplierName[];
};

const get = async (
  token: string,
  params: GetSupplierParams
): Promise<GetSupplierResponse> => {
  try {
    const response = await axios.get(`${SupplierUrl.GET_SUPPLIER}`, {
      params,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("getSupplier", error);
    throw error;
  }
};

const getSupplier = async (token: string): Promise<GetSupplierNameResponse> => {
  try {
    const response = await axios.get(`${SupplierUrl.GET_SUPPLIER_NAME}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("getSupplier", error);
    throw error;
  }
};

const save = async (token: string, params: SaveSupplierParams) => {
  try {
    const response = await axios.post(`${SupplierUrl.SAVE_SUPPLIER}`, params, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("updatePayment", error);
    throw error;
  }
};

const deleteSupplier = async (token: string, id: number) => {
  try {
    const response = await axios.post(
      `${SupplierUrl.DELETE_SUPPLIER}`,
      {
        id,
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("deletePayment", error);
    throw error;
  }
};

const SupplierService = {
  get,
  getSupplier,
  save,
  deleteSupplier,
};

export default SupplierService;
