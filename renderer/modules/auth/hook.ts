import { useMutation } from "react-query";
import { AxiosError } from "axios";
import electron from "electron";
import { useAuth } from "@/hooks/AuthContext";
import { BaseResponse } from "@/utils/types";
import Toast from "@/utils/toast";
import { LoginUsernameParams } from "@/modules/auth/type";
import { loginUsername } from "@/modules/auth/api";

export const useLogin = () => {
  const ipcRenderer = electron.ipcRenderer || false;
  const { signIn } = useAuth();

  const { mutate, isLoading } = useMutation(
    (params: LoginUsernameParams) => loginUsername(params),
    {
      onSuccess: (res) => {
        signIn(res.data.access_token);
      },
      onError: (err: AxiosError<BaseResponse>) => {
        if (err.isAxiosError && err.response) {
          const statusCode = err.response.status;
          const { message } = err.response.data;

          switch (statusCode) {
            case 422:
              Toast.fire("Pemberitahuan!", message, "warning");
              break;
            default:
              Toast.fire("Error!", message, "error");
              break;
          }
        } else {
          Toast.fire("Error!", "Terjadi kesalahan pada sistem", "error");
        }
      },
    }
  );

  const login = (username: string, password: string) => {
    const _fcm: any = ipcRenderer
      ? ipcRenderer.sendSync("electron-store-get", "_fcm")
      : undefined;

    mutate({ username, password, device_token: _fcm });
  };

  return { login, isLoading };
};
