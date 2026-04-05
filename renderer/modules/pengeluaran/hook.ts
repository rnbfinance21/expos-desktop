import { useMutation, useQuery } from "react-query";
import { useAuth } from "@/hooks/AuthContext";
import { handleErrorAxios } from "@/utils/errors";
import { getPengeluaran, savePengeluaran, deletePengeluaran } from "@/modules/pengeluaran/api";
import { GetPengeluaranParams, SavePengeluaranParams } from "@/modules/pengeluaran/type";

export const usePengeluaranQuery = (params: GetPengeluaranParams) => {
  const { token } = useAuth();
  return useQuery(
    ["pengeluaran", params],
    () => getPengeluaran(token, params),
    {
      enabled: !!token,
      refetchOnWindowFocus: false,
      onError: handleErrorAxios,
    }
  );
};

export const useSavePengeluaranMutation = () => {
  const { token } = useAuth();
  return useMutation(
    (params: SavePengeluaranParams) => savePengeluaran(token, params),
    { onError: handleErrorAxios }
  );
};

export const useDeletePengeluaranMutation = () => {
  const { token } = useAuth();
  return useMutation(
    (id: number) => deletePengeluaran(token, id),
    { onError: handleErrorAxios }
  );
};
