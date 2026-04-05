export type OrderType = {
  id: number;
  name: string;
  margin: number;
  box: number;
  box_new: number;
  change_state: number;
  state: number;
};

export type PaymentType = {
  id: number;
  kategori_order_id: number | null;
  name: string;
  laporan_pajak: number;
  laporan_state: number;
  state: number;
};

export type GetAttributePaymentResponse = {
  code: number;
  message: string;
  data: {
    order: OrderType[];
    payment: PaymentType[];
    tax: number[];
    cash: number[];
  };
};
