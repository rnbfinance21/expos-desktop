import React, { useState } from "react";
import electron from "electron";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setRefetchOrder } from "@/features/listOrderSlice";
import { useAuth } from "@/hooks/AuthContext";
import { updateState } from "@/modules/order/api";
import { OrderDetail, UpdateStateParams } from "@/modules/order/type";
import { handleErrorAxios } from "@/utils/errors";
import { Button } from "@/components/globals/buttons";

interface PendingActionProps {
  data: OrderDetail;
}

const PendingAction = ({ data }: PendingActionProps) => {
  const ipcRenderer = electron.ipcRenderer || false;
  const dispatch = useDispatch();
  const { token } = useAuth();

  const [typeConfirm, setTypeConfirm] = useState(1);

  const changeStateMutation = useMutation(
    (params: UpdateStateParams) => updateState(token, params),
    {
      onSuccess: (res) => {
        if (ipcRenderer && typeConfirm === 1) {
          ipcRenderer.send("print-order", data, 1);
        }

        Swal.fire("Berhasil!", res.message, "success");
        dispatch(setRefetchOrder(true));
      },
      onError: handleErrorAxios,
    }
  );

  const onAccept = () => {
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

  const onReject = (type = 0) => {
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
      <Button onClick={onAccept}>Terima</Button>
      <Button onClick={() => onReject(0)}>Tolak</Button>
    </div>
  );
};

export default PendingAction;
