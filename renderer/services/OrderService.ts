import axios from "../utils/axios";

enum OrderUrl {
  ORDER_OUTLET = "/api/transaksi/all",
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
};

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

const OrderService = {
  getOrderOutlet,
};

export default OrderService;
