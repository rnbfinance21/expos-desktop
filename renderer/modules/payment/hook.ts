import { useQuery } from "react-query";
import { useAuth } from "@/hooks/AuthContext";
import { handleErrorAxios } from "@/utils/errors";
import { getAttributePayment } from "@/modules/payment/api";

export const useAttributePaymentQuery = () => {
  const { token } = useAuth();
  return useQuery(
    ["attribute_payment", token],
    () => getAttributePayment(token),
    {
      enabled: !!token,
      refetchOnWindowFocus: false,
      onError: handleErrorAxios,
    }
  );
};
