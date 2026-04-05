import axios from "@/utils/axios";
import { GetAttributePaymentResponse } from "@/modules/payment/type";

const ATTRIBUTE_PAYMENT = "/api/master/attribute-payment";

export const getAttributePayment = async (
  token: string
): Promise<GetAttributePaymentResponse> => {
  try {
    const response = await axios.get(ATTRIBUTE_PAYMENT, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
