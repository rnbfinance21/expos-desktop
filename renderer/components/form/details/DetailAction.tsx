import React, { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { setSearch } from "../../../features/menuSlice";
import {
  getOrder,
  getSumOrder,
  resetOrder,
} from "../../../features/orderSlice";
import { useAuth } from "../../../hooks/AuthContext";
import OrderService from "../../../services/OrderService";
import { numberFormat } from "../../../utils/currency";
import Toast from "../../../utils/toast";
import UangKasModal from "../../modals/UangKasModal";
import DetailActionButton from "./DetailActionButton";

const DetailAction = () => {
  const dispatch = useDispatch();
  const { token, kasState, outlet, setKasState } = useAuth();
  const { identity, orders, type } = useSelector(getOrder);
  const sum = useSelector(getSumOrder);

  const [openKasModal, setOpenKasModal] = useState(false);

  const changeStateMutation = useMutation(
    () => OrderService.checkKas(token, outlet.id),
    {
      onSuccess: (res) => {
        setKasState(res.state);
        if (!res.state) {
          setOpenKasModal(true);
        }
      },
      onError: () => {
        setKasState(false);
      },
    }
  );

  const _onConfirm = () => {
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
        Swal.fire("Berhasil!!", "Simpan Data", "success");
      }
    });
  };

  const _onSuccessKas = () => {
    _onConfirm();

    setOpenKasModal(false);
  };

  const _onSave = () => {
    if (identity.name === "" || identity.table === "") {
      Toast.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "Silahkan isi data pelanggan",
      });
    } else if (orders.length === 0) {
      Toast.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "Transaksi minimal 1 item",
      });
    } else {
      if (!kasState) {
        changeStateMutation.mutate();
      } else {
        _onConfirm();
      }
    }
  };

  return (
    <>
      <div className="flex flex-col bg-white border-b pt-4 border-t">
        <div className="flex flex-row pb-2 px-4">
          <div className="flex-1 flex flex-row gap-2">
            <DetailActionButton
              icon="CubeIcon"
              title="Tambah Box"
              onClick={() => dispatch(setSearch("box"))}
            />
          </div>
          <div>
            <DetailActionButton
              icon="XMarkIcon"
              title="Batal Pesan"
              outline={false}
              iconClassName="text-white"
              onClick={() => dispatch(resetOrder())}
            />
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div
            onClick={_onSave}
            className="bg-blue-500 active:bg-blue-600 text-white p-4 text-center text-sm font-medium cursor-pointer"
          >
            Simpan
          </div>
          <div className="bg-green-500 active:bg-green-600 text-white p-4 text-center text-sm font-medium cursor-pointer">
            Rp {numberFormat(sum, 0)}
          </div>
        </div>
      </div>
      <UangKasModal
        visible={openKasModal}
        openState={1}
        onError={() => {}}
        onSuccess={_onSuccessKas}
      />
    </>
  );
};

export default DetailAction;
