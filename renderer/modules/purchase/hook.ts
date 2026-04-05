import { useMutation, useQuery } from "react-query";
import { useAuth } from "@/hooks/AuthContext";
import { handleErrorAxios } from "@/utils/errors";
import {
  getPurchase,
  getPurchaseDetail,
  createPurchase,
  removePurchase,
  cancelPurchase,
} from "@/modules/purchase/api";
import { CreatePurchaseParams, GetPurchaseParams } from "@/modules/purchase/type";

export const usePurchaseQuery = (params: GetPurchaseParams) => {
  const { token } = useAuth();
  return useQuery(
    ["purchase", params],
    () => getPurchase(token, params),
    {
      enabled: !!token,
      refetchOnWindowFocus: false,
      onError: handleErrorAxios,
    }
  );
};

export const usePurchaseDetailQuery = (id: number) => {
  const { token } = useAuth();
  return useQuery(
    ["purchase_detail", id],
    () => getPurchaseDetail(token, id),
    { enabled: !!id, refetchOnWindowFocus: false }
  );
};

export const useCreatePurchaseMutation = () => {
  const { token } = useAuth();
  return useMutation(
    (params: CreatePurchaseParams) => createPurchase(token, params),
    { onError: handleErrorAxios }
  );
};

export const useRemovePurchaseMutation = () => {
  const { token } = useAuth();
  return useMutation(
    (id: number) => removePurchase(token, id),
    { onError: handleErrorAxios }
  );
};

export const useCancelPurchaseMutation = () => {
  const { token } = useAuth();
  return useMutation(
    (id: number) => cancelPurchase(token, id),
    { onError: handleErrorAxios }
  );
};
