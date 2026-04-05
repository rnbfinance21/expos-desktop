import { useMutation } from "react-query";
import { useAuth } from "@/hooks/AuthContext";
import { handleErrorAxios } from "@/utils/errors";
import { openOutlet } from "@/modules/outlet/api";
import { OpenOutletParams } from "@/modules/outlet/type";

export const useOpenOutletMutation = () => {
  const { token } = useAuth();
  return useMutation(
    (params: OpenOutletParams) => openOutlet(token, params),
    { onError: handleErrorAxios }
  );
};
