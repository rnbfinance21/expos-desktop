import { Menu } from "@/modules/menu/type";

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
  member: null | {
    id: number;
    name: string;
    username: string;
    password_show: string | null;
    type: number;
  };
}

export type GetOrderOutletParams = {
  search?: string;
  status: number | null;
  date: string;
};

export interface GetOrderOutletPaginateParams extends GetOrderOutletParams {
  page: number;
}

export type GetOrderOutletResponse = {
  code: number;
  message: string;
  data: Order[];
};

export type GetOrderOutletNewResponse = {
  code: number;
  message: string;
  data: OrderDetail[];
};

export type OrderPaginate = {
  id: number;
  kode_transaksi: string;
  no_bill: string | null;
  table: string;
  date: string;
  pajak: number;
  diskon: number;
  potongan: number;
  status: number;
  status_text: string;
  status_additional: number;
  type: number;
  type_text: string;
  deleted_at: string | null;
  kategori_order_name: string | null;
  kategori_payment_name: string | null;
  name: string;
  member_id: number | null;
  reason: string | null;
  items_count: number;
};

export type GetOrderOutletPaginateResponse = {
  code: number;
  message: string;
  pagination: {
    perPage: number;
    page: number;
    pageTotal: number;
    totalData: number;
  };
  data: OrderPaginate[];
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
  key: string;
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
    type_order: number;
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
    type_order: number;
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

export interface UpdatePaymentParams extends UpdateDraftParams, PaymentParams {
  updateLogs?: number[];
  deleteLogs?: number[];
}

export interface VoidPaymentParams extends UpdateDraftParams, PaymentParams {
  keterangan: string;
}

export type PaymentResponse = {
  code: number;
  message: string;
  data: OrderDetail;
};

export type GabungParams = {
  from: number;
  to: number;
};
