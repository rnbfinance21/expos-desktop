import React from "react";
import electron from "electron";
import { useMutation } from "react-query";
import { useAuth } from "@/hooks/AuthContext";
import { DynamicHeroIcon } from "@/components/globals/icons";
import MyModal from "@/components/globals/modal/MyModal";
import { OrderDetail } from "@/modules/order/type";
import { ucwords } from "@/utils/string";
import Toast from "@/utils/toast";
import axios from "@/utils/axios";

interface CetakModalProps {
  show: boolean;
  onClose: () => void;
  data: OrderDetail;
}

const CetakModal = ({ show, onClose, data }: CetakModalProps) => {
  const ipcRenderer = electron.ipcRenderer || false;
  const { token, outlet, user } = useAuth();

  const mutationLogs = useMutation((deskription: string) =>
    axios.post(
      "/api/transaksi/logs",
      {
        transaksi_id: data.id,
        type: 0,
        deskripsi: deskription,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );

  const sendToKitchen = () => {
    if (ipcRenderer) {
      ipcRenderer.send("print-order", data, 1);
    }
  };

  const sendToKitchenAdditional = () => {
    if (ipcRenderer) {
      if (data.details.filter((e) => e.type === 1).length > 0) {
        ipcRenderer.send("print-order-additional", data, 1);
      } else {
        Toast.fire(
          "Peringatan!",
          "Tidak terdapat item tambahan pada pesanan ini",
          "warning"
        );
      }
    }
  };

  const printBill = () => {
    if (ipcRenderer) {
      ipcRenderer.send(
        "print-bill",
        {
          name: outlet.name,
          address: outlet.address,
          instagram: outlet.instagram,
          kasir: ucwords(user.name),
          tax: outlet.tax,
          contact: outlet.contact,
        },
        data
      );

      mutationLogs.mutate("[Belum Lunas] cetak struk");
    }
  };

  const printAccount = () => {
    if (ipcRenderer && data.member !== null) {
      ipcRenderer.send("print-account", {
        name: data.member.name,
        username: data.member.username,
        password: data.member.password_show,
      });
    }
  };

  return (
    <MyModal title="Pilih Opsi Cetak" show={show} onClose={onClose}>
      <div className="mt-4">
        <div
          onClick={sendToKitchen}
          className="flex flex-row p-4 bg-gray-100 cursor-pointer mb-2 items-center active:bg-gray-200"
        >
          <DynamicHeroIcon icon="TruckIcon" className="mr-4 h-6 w-6" />
          <span className="text-sm font-medium text-gray-900">Cetak ke Dapur</span>
        </div>
        <div
          onClick={sendToKitchenAdditional}
          className="flex flex-row p-4 bg-gray-100 cursor-pointer mb-2 items-center active:bg-gray-200"
        >
          <DynamicHeroIcon icon="DocumentPlusIcon" className="mr-4 h-6 w-6" />
          <span className="text-sm font-medium text-gray-900">
            Cetak Item Tambahan ke Dapur
          </span>
        </div>
        <div
          onClick={printBill}
          className="flex flex-row p-4 bg-gray-100 cursor-pointer mb-2 items-center active:bg-gray-200"
        >
          <DynamicHeroIcon icon="PrinterIcon" className="mr-4 h-6 w-6" />
          <span className="text-sm font-medium text-gray-900">Cetak Struk</span>
        </div>
        {data.member !== null ? (
          <div
            onClick={printAccount}
            className="flex flex-row p-4 bg-gray-100 cursor-pointer mb-2 items-center active:bg-gray-200"
          >
            <DynamicHeroIcon icon="UserIcon" className="mr-4 h-6 w-6" />
            <span className="text-sm font-medium text-gray-900">Cetak Akun</span>
          </div>
        ) : null}
      </div>
    </MyModal>
  );
};

export default CetakModal;
