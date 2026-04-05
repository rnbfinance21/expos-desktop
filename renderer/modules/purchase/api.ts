import axios from "@/utils/axios";
import {
  GetPurchaseParams,
  GetPurchaseResponse,
  GetDetailPurchaseResponse,
  CreatePurchaseParams,
} from "@/modules/purchase/type";

export const getPurchase = async (
  token: string,
  params: GetPurchaseParams
): Promise<GetPurchaseResponse> => {
  try {
    const response = await axios.get("/api/purchase", {
      params,
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("getPurchase", error);
    throw error;
  }
};

export const getPurchaseDetail = async (
  token: string,
  id: number
): Promise<GetDetailPurchaseResponse> => {
  try {
    const response = await axios.get(`/api/purchase/${id}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("getPurchaseDetail", error);
    throw error;
  }
};

export const createPurchase = async (
  token: string,
  params: CreatePurchaseParams
) => {
  try {
    const response = await axios.post("/api/purchase", params, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("createPurchase", error);
    throw error;
  }
};

export const removePurchase = async (token: string, id: number) => {
  try {
    const response = await axios.delete(`/api/purchase/${id}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("removePurchase", error);
    throw error;
  }
};

export const cancelPurchase = async (token: string, id: number) => {
  try {
    const response = await axios.delete(`/api/purchase/cancel/${id}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("cancelPurchase", error);
    throw error;
  }
};
