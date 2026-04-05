import { useMutation, useQuery } from "react-query";
import { useAuth } from "@/hooks/AuthContext";
import { handleErrorAxios } from "@/utils/errors";
import {
  getSupplierList,
  getSupplierNames,
  saveSupplier,
  deleteSupplier,
} from "@/modules/supplier/api";
import { GetSupplierParams, SaveSupplierParams } from "@/modules/supplier/type";

export const useSupplierQuery = (params: GetSupplierParams) => {
  const { token } = useAuth();
  return useQuery(
    ["supplier", params],
    () => getSupplierList(token, params),
    {
      enabled: !!token,
      refetchOnWindowFocus: false,
      onError: handleErrorAxios,
    }
  );
};

export const useSupplierNamesQuery = () => {
  const { token } = useAuth();
  return useQuery(
    ["supplier_names", token],
    () => getSupplierNames(token),
    {
      enabled: !!token,
      refetchOnWindowFocus: false,
      onError: handleErrorAxios,
    }
  );
};

export const useSaveSupplierMutation = () => {
  const { token } = useAuth();
  return useMutation(
    (params: SaveSupplierParams) => saveSupplier(token, params),
    { onError: handleErrorAxios }
  );
};

export const useDeleteSupplierMutation = () => {
  const { token } = useAuth();
  return useMutation(
    (id: number) => deleteSupplier(token, id),
    { onError: handleErrorAxios }
  );
};
