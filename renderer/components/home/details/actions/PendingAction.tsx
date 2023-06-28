import React, { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setRefetchOrder } from "../../../../features/listOrderSlice";
import { useAuth } from "../../../../hooks/AuthContext";
import OrderService, {
  OrderDetail,
  UpdateStateParams,
} from "../../../../services/OrderService";
import { handleErrorAxios } from "../../../../utils/errors";
import { Button } from "../../../globals/buttons";
import electron from "electron";

interface PendingActionProps {
  data: OrderDetail;
}

const PendingAction = ({ data }: PendingActionProps) => {
  const ipcRenderer = electron.ipcRenderer || false;
  const dispatch = useDispatch();
  const { token } = useAuth();

  const [typeConfirm, setTypeConfirm] = useState(1); // 1 = accept, -1 = Reject

  const changeStateMutation = useMutation(
    (params: UpdateStateParams) => OrderService.updateState(token, params),
    {
      onSuccess: (res) => {
        if (ipcRenderer) {
          if (typeConfirm === 1) {
            // let copies =  ipcRenderer.sendSync("electron-store-get", "printer-kitchen-copies") ?? 2;

            // for (let index = 0; index < copies; index++) {
            // }
            ipcRenderer.send("print-order", data, 1);
          }
        }
        Swal.fire("Berhasil!", res.message, "success");
        dispatch(setRefetchOrder(true));
      },
      onError: handleErrorAxios,
    }
  );

  const _onAccept = () => {
    setTypeConfirm(1);
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
    setTypeConfirm(-1);
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
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button onClick={_onAccept}>Terima</Button>
      <Button onClick={() => _onReject(0)}>Tolak</Button>
    </div>
  );
};

export default PendingAction;
