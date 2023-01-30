import { AxiosError } from "axios";
import { BaseResponse } from "../services/types";
import Toast from "./toast";

export const handleErrorAxios = (err: AxiosError<BaseResponse>) => {
  if (err.isAxiosError) {
    if (err.response) {
      const code = err.response.status;
      const { data } = err.response;

      switch (code) {
        case 400:
          Toast.fire({
            icon: "warning",
            title: "Peringatan",
            text: data.message,
          });
          break;
        case 422:
          Toast.fire({
            icon: "warning",
            title: "Peringatan",
            text: data.message,
          });
          break;

        default:
          Toast.fire({
            icon: "error",
            title: "Error",
            text: "Terjadi kesalahan pada server",
          });
          break;
      }
    } else {
      Toast.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan pada sistem",
      });
    }
  }
};
