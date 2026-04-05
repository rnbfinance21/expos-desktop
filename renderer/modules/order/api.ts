import axios from "@/utils/axios";
import { BaseResponse } from "@/utils/types";
import {
  GetOrderOutletParams,
  GetOrderOutletResponse,
  GetOrderOutletNewResponse,
  GetOrderOutletPaginateResponse,
  GetOrderDetailResponse,
  UpdateStateParams,
  CheckKasResponse,
  SaveDraftParams,
  UpdateDraftParams,
  SavePaymentParams,
  UpdatePaymentParams,
  VoidPaymentParams,
  PaymentResponse,
  GabungParams,
} from "@/modules/order/type";

enum OrderUrl {
  ORDER_OUTLET = "/api/transaksi/all",
  ORDER_OUTLET_NEW = "/api/transaksi/all-new",
  ORDER_OUTLET_PAGINATE = "/api/transaksi/all-paginate",
  ORDER_MERGE = "/api/transaksi/gabung/transaksi",
  ORDER_DETAIL = "/api/transaksi/detail",
  ORDER_STATE = "/api/transaksi/state",
  ORDER_CHECK_KAS = "/api/transaksi/check-kas",
  SAVE_DRAFT = "/api/transaksi/save-draft",
  UPDATE_DRAFT = "/api/transaksi/update-draft",
  SAVE_PAYMENT = "/api/transaksi/save-payment",
  UPDATE_PAYMENT = "/api/transaksi/update-payment",
  VOID = "/api/transaksi/void",
  GABUNG = "/api/transaksi/gabung",
}

export const getOrderOutlet = async (
  token: string,
  params: GetOrderOutletParams
): Promise<GetOrderOutletResponse> => {
  try {
    const resp = await axios.get(OrderUrl.ORDER_OUTLET, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      params,
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderOutletNew = async (
  token: string,
  params: GetOrderOutletParams
): Promise<GetOrderOutletNewResponse> => {
  try {
    const resp = await axios.get(OrderUrl.ORDER_OUTLET_NEW, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      params,
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderOutletNew2 = async (
  token: string,
  params: GetOrderOutletParams
): Promise<GetOrderOutletPaginateResponse> => {
  try {
    const resp = await axios.get(OrderUrl.ORDER_OUTLET_PAGINATE, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      params,
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderMerge = async (
  token: string,
  id: number
): Promise<GetOrderOutletResponse> => {
  try {
    const resp = await axios.get(OrderUrl.ORDER_MERGE, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      params: { id },
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderDetail = async (
  token: string,
  transaksiId: number
): Promise<GetOrderDetailResponse> => {
  try {
    const resp = await axios.get(`${OrderUrl.ORDER_DETAIL}/${transaksiId}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const updateState = async (
  token: string,
  params: UpdateStateParams
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(OrderUrl.ORDER_STATE, params, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkKas = async (
  token: string,
  outletId: number
): Promise<CheckKasResponse> => {
  try {
    const response = await axios.post(
      OrderUrl.ORDER_CHECK_KAS,
      { outlet_id: outletId },
      { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveDraft = async (
  token: string,
  params: SaveDraftParams
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(OrderUrl.SAVE_DRAFT, params, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("saveDraft", error);
    throw error;
  }
};

export const updateDraft = async (
  token: string,
  params: UpdateDraftParams
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(OrderUrl.UPDATE_DRAFT, params, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("updateDraft", error);
    throw error;
  }
};

export const savePayment = async (
  token: string,
  params: SavePaymentParams
): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(OrderUrl.SAVE_PAYMENT, params, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("savePayment", error);
    throw error;
  }
};

export const updatePayment = async (
  token: string,
  params: UpdatePaymentParams
): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(OrderUrl.UPDATE_PAYMENT, params, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("updatePayment", error);
    throw error;
  }
};

export const voidPayment = async (
  token: string,
  params: VoidPaymentParams
): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(OrderUrl.VOID, params, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("voidPayment", error);
    throw error;
  }
};

export const gabungOrder = async (
  token: string,
  params: GabungParams
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(OrderUrl.GABUNG, params, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("gabungOrder", error);
    throw error;
  }
};
