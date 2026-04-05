import { useMutation, useQuery } from "react-query";
import { useAuth } from "@/hooks/AuthContext";
import { handleErrorAxios } from "@/utils/errors";
import {
  getMenuOutlet,
  changeStockState,
  getVariantOutlet,
  changeVariantState,
} from "@/modules/menu/api";
import { ChangeStockStateParams, ChangeVariantStateParams } from "@/modules/menu/type";

export const useMenuOutletQuery = () => {
  const { token, outlet } = useAuth();
  return useQuery(
    ["menu_outlet", outlet?.code],
    () => getMenuOutlet(token, outlet?.code),
    {
      enabled: !!token && !!outlet?.code,
      refetchOnWindowFocus: false,
      onError: handleErrorAxios,
    }
  );
};

export const useVariantOutletQuery = () => {
  const { token, outlet } = useAuth();
  return useQuery(
    ["stok_variant", token],
    () => getVariantOutlet(token, outlet?.id ?? 1),
    { onError: handleErrorAxios }
  );
};

export const useChangeStockMutation = () => {
  const { token } = useAuth();
  return useMutation(
    (params: ChangeStockStateParams) => changeStockState(token, params),
    { onError: handleErrorAxios }
  );
};

export const useChangeVariantMutation = () => {
  const { token } = useAuth();
  return useMutation(
    (params: ChangeVariantStateParams) => changeVariantState(token, params),
    { onError: handleErrorAxios }
  );
};
