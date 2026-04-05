import axios from "@/utils/axios";
import {
  GetSupplierParams,
  GetSupplierResponse,
  GetSupplierNameResponse,
  SaveSupplierParams,
} from "@/modules/supplier/type";

enum SupplierUrl {
  GET_SUPPLIER = "/api/supplier",
  GET_SUPPLIER_NAME = "/api/supplier/list",
  SAVE_SUPPLIER = "/api/supplier/create",
  DELETE_SUPPLIER = "/api/supplier/delete",
}

export const getSupplierList = async (
  token: string,
  params: GetSupplierParams
): Promise<GetSupplierResponse> => {
  try {
    const response = await axios.get(SupplierUrl.GET_SUPPLIER, {
      params,
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("getSupplierList", error);
    throw error;
  }
};

export const getSupplierNames = async (
  token: string
): Promise<GetSupplierNameResponse> => {
  try {
    const response = await axios.get(SupplierUrl.GET_SUPPLIER_NAME, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("getSupplierNames", error);
    throw error;
  }
};

export const saveSupplier = async (
  token: string,
  params: SaveSupplierParams
) => {
  try {
    const response = await axios.post(SupplierUrl.SAVE_SUPPLIER, params, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("saveSupplier", error);
    throw error;
  }
};

export const deleteSupplier = async (token: string, id: number) => {
  try {
    const response = await axios.post(
      SupplierUrl.DELETE_SUPPLIER,
      { id },
      { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.log("deleteSupplier", error);
    throw error;
  }
};
