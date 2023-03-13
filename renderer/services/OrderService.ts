import axios from "../utils/axios";
import { Menu } from "./MenuService";
import { BaseResponse } from "./types";

enum OrderUrl {
  ORDER_OUTLET = "/api/transaksi/all",
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

export type Order = {
  id: number;
  outlet_id: number;
  kasir_id: number | null;
  kategori_order_id: number | null;
  kategori_payment_id: number | null;
  kode_transaksi: string;
  no_bill: string | null;
  table: string;
  date: string;
  pajak: number;
  diskon: number;
  potongan: number;
  total: number;
  bayar: number;
  kembalian: number;
  status: number;
  type: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  kategori_order_name: string | null;
  kategori_payment_name: string | null;
  name: string;
  subtotal_pajak: number;
  subtotal_box: number;
  pajak_value: number;
  subtotal: number;
  diskon_value: number;
  status_text: string;
  type_text: string;
  items_count: number;
};

export type DetailMenu = {
  id: number;
  name: string;
  photo: string;
};

export type DetailVariant = {
  id: number;
  transaksi_detail_id: number;
  variant_option_id: number;
  price: number;
  state: number;
  deleted_at: null | string;
  created_at: string;
  updated_at: string;
  option_name: string;
  variant_name: string;
  variant_id: number;
};

export type Detail = {
  id: number;
  transaksi_id: number;
  menu_id: number;
  qty: number;
  description: null | string;
  price: number;
  margin: number | null;
  box: number;
  diskon: number;
  pajak_state: number;
  status: number;
  type: number;
  type_order: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  total: number;
  menu: Menu;
  variants: DetailVariant[];
};

export interface OrderDetail extends Order {
  details: Detail[];
  reason: string | null;
}

export type GetOrderOutletParams = {
  search?: string;
  status: number | null;
  date: string;
};

export type GetOrderOutletResponse = {
  code: number;
  message: string;
  data: Order[];
};

export type GetOrderDetailResponse = {
  code: number;
  message: string;
  data: OrderDetail;
};

export type UpdateStateParams = {
  id: number;
  status: number;
  description?: string;
};

export type CheckKasResponse = {
  code: number;
  state: boolean;
};

type VariantParams = {
  option_id: number;
  price: number;
};

export type SaveDraftParams = {
  outlet_id: number;
  name: string;
  table: string;
  no_bill: string | null;
  details: {
    menu_id: number;
    qty: number;
    description: string | null;
    price: number;
    margin: number;
    box: number;
    diskon: number;
    pajak_state: number;
    variants: VariantParams[];
  }[];
};

export type UpdateDraftParams = {
  id: number;
  name: string;
  table: string;
  no_bill: string | null;
  updateLogs?: number[];
  deleteLogs?: number[];
  details: {
    id_detail?: number;
    menu_id: number;
    qty: number;
    description: string | null;
    price: number;
    margin: number;
    box: number;
    diskon: number;
    pajak_state: number;
    variants: VariantParams[];
  }[];
};

type PaymentParams = {
  kategori_order_id: number;
  kategori_payment_id: number;
  diskon: number;
  pajak: number;
  potongan: number;
  total: number;
  bayar: number;
  kembalian: number;
};

export interface SavePaymentParams extends SaveDraftParams, PaymentParams {}

export interface UpdatePaymentParams extends UpdateDraftParams, PaymentParams {}

export type PaymentResponse = {
  code: number;
  message: string;
  data: OrderDetail;
};

export type GabungParams = {
  from: number;
  to: number;
};

const getOrderOutlet = async (
  token: string,
  params: GetOrderOutletParams
): Promise<GetOrderOutletResponse> => {
  try {
    const resp = await axios.get(OrderUrl.ORDER_OUTLET, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: params,
    });

    return resp.data;
  } catch (error) {
    throw error;
  }
};

const getOrderMerge = async (
  token: string,
  id: number
): Promise<GetOrderOutletResponse> => {
  try {
    const resp = await axios.get(OrderUrl.ORDER_MERGE, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        id,
      },
    });

    return resp.data;
  } catch (error) {
    throw error;
  }
};

const getOrderDetail = async (
  token: string,
  transaksiId: number
): Promise<GetOrderDetailResponse> => {
  try {
    const resp = await axios.get(`${OrderUrl.ORDER_DETAIL}/${transaksiId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return resp.data;
  } catch (error) {
    throw error;
  }
};

const updateState = async (
  token: string,
  params: UpdateStateParams
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(`${OrderUrl.ORDER_STATE}`, params, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const checkKas = async (
  token: string,
  outletId: number
): Promise<CheckKasResponse> => {
  try {
    const response = await axios.post(
      `${OrderUrl.ORDER_CHECK_KAS}`,
      {
        outlet_id: outletId,
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
    throw error;
  }
};

const saveDraft = async (
  token: string,
  params: SaveDraftParams
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(`${OrderUrl.SAVE_DRAFT}`, params, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("saveDraft", error);
    throw error;
  }
};

const updateDraft = async (
  token: string,
  params: UpdateDraftParams
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(`${OrderUrl.UPDATE_DRAFT}`, params, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("saveDraft", error);
    throw error;
  }
};

const savePayment = async (
  token: string,
  params: SavePaymentParams
): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(`${OrderUrl.SAVE_PAYMENT}`, params, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("savePayment", error);
    throw error;
  }
};

const updatePayment = async (
  token: string,
  params: UpdatePaymentParams
): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(`${OrderUrl.UPDATE_PAYMENT}`, params, {
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

const voidPayment = async (
  token: string,
  params: UpdatePaymentParams
): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(`${OrderUrl.VOID}`, params, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("voidPayment", error);
    throw error;
  }
};

const gabungOrder = async (
  token: string,
  params: GabungParams
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(`${OrderUrl.GABUNG}`, params, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("voidPayment", error);
    throw error;
  }
};

const OrderService = {
  getOrderOutlet,
  getOrderDetail,
  updateState,
  checkKas,
  saveDraft,
  updateDraft,
  savePayment,
  updatePayment,
  voidPayment,
  getOrderMerge,
  gabungOrder,
};

export default OrderService;
