import { useMutation, useQuery } from "react-query";
import { useAuth } from "@/hooks/AuthContext";
import { handleErrorAxios } from "@/utils/errors";
import {
  getOrderDetail,
  getOrderOutletNew2,
  updateState,
  checkKas,
  saveDraft,
  updateDraft,
  savePayment,
  updatePayment,
  voidPayment,
  gabungOrder,
  getOrderMerge,
} from "@/modules/order/api";
import {
  GetOrderOutletParams,
  UpdateStateParams,
  SaveDraftParams,
  UpdateDraftParams,
  SavePaymentParams,
  UpdatePaymentParams,
  VoidPaymentParams,
  GabungParams,
} from "@/modules/order/type";

export const useOrderDetailQuery = (transaksiId: number) => {
  const { token } = useAuth();
  return useQuery(
    ["order_detail", transaksiId],
    () => getOrderDetail(token, transaksiId),
    {
      enabled: !!transaksiId,
      refetchOnWindowFocus: false,
      onError: handleErrorAxios,
    }
  );
};

export const useOrderMergeQuery = (id: number) => {
  const { token } = useAuth();
  return useQuery(
    ["order_merge", id],
    () => getOrderMerge(token, id),
    { enabled: false, refetchOnWindowFocus: false }
  );
};

export const useUpdateStateMutation = () => {
  const { token } = useAuth();
  return useMutation((params: UpdateStateParams) => updateState(token, params));
};

export const useCheckKasMutation = () => {
  const { token } = useAuth();
  return useMutation((outletId: number) => checkKas(token, outletId));
};

export const useSaveDraftMutation = () => {
  const { token } = useAuth();
  return useMutation((params: SaveDraftParams) => saveDraft(token, params));
};

export const useUpdateDraftMutation = () => {
  const { token } = useAuth();
  return useMutation((params: UpdateDraftParams) => updateDraft(token, params));
};

export const useSavePaymentMutation = () => {
  const { token } = useAuth();
  return useMutation((params: SavePaymentParams) => savePayment(token, params));
};

export const useUpdatePaymentMutation = () => {
  const { token } = useAuth();
  return useMutation((params: UpdatePaymentParams) =>
    updatePayment(token, params)
  );
};

export const useVoidPaymentMutation = () => {
  const { token } = useAuth();
  return useMutation((params: VoidPaymentParams) => voidPayment(token, params));
};

export const useGabungOrderMutation = () => {
  const { token } = useAuth();
  return useMutation((params: GabungParams) => gabungOrder(token, params));
};
