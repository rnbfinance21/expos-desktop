/* eslint-disable no-console */

import axios from "../utils/axios";

enum MasterUrl {
  ATTRIBUTE_PAYMENT = "/api/master/attribute-payment",
}

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

const getAttributePayment = async (
  token: string
): Promise<GetAttributePaymentResponse> => {
  try {
    const response = await axios.get(`${MasterUrl.ATTRIBUTE_PAYMENT}`, {
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

const MasterService = {
  getAttributePayment,
};

export default MasterService;
