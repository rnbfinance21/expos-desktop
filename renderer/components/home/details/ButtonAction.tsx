import React from "react";
import electron from "electron";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setRefetchOrder } from "../../../features/listOrderSlice";
import { useAuth } from "../../../hooks/AuthContext";
import OrderService, {
  OrderDetail,
  UpdateStateParams,
} from "../../../services/OrderService";
import { handleErrorAxios } from "../../../utils/errors";
import { Button } from "../../globals/buttons";

interface ButtonActionProps {
  data: OrderDetail;
}

const ButtonAction = ({ data }: ButtonActionProps) => {
  const dispatch = useDispatch();
  const ipcRenderer = electron.ipcRenderer || false;
  const { token } = useAuth();

  const changeStateMutation = useMutation(
    (params: UpdateStateParams) => OrderService.updateState(token, params),
    {
      onSuccess: (res) => {
        Swal.fire("Berhasil!", res.message, "success");
        dispatch(setRefetchOrder(true));
      },
      onError: handleErrorAxios,
    }
  );

  const _onAccept = () => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Transaksi ini akan di proses",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Saya yakin",
      cancelButtonText: "Tidak",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        changeStateMutation.mutate({
          id: data.id,
          status: 1,
        });
      }
    });
  };

  const _onReject = (type = 0) => {
    Swal.fire({
      title: type === 0 ? "Alasan penolakan" : "Alasan Pembatalan",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Simpan",
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        changeStateMutation.mutate({
          id: data.id,
          status: -1,
          description: result.value,
        });
      }
    });
  };

  const _printOrder = () => {
    if (ipcRenderer) {
      ipcRenderer.send("print-order", data);
    }
  };

  return (
    <>
      {data?.status === 0 ? (
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={_onAccept}>Terima</Button>
          <Button onClick={() => _onReject(0)}>Tolak</Button>
        </div>
      ) : null}
    </>
  );
};

export default ButtonAction;
