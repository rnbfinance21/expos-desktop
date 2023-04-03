import React from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../hooks/AuthContext";
import { DynamicHeroIcon } from "../../globals/icons";

import MyModal from "../../globals/modal/MyModal";
import electron from "electron";
import { OrderDetail } from "../../../services/OrderService";
import { ucwords } from "../../../utils/string";
import Toast from "../../../utils/toast";

interface CetakModalProps {
  show: boolean;
  onClose: () => void;
  data: OrderDetail;
}

const CetakModal = ({ show, onClose, data }: CetakModalProps) => {
  const ipcRenderer = electron.ipcRenderer || false;
  const dispatch = useDispatch();
  const { token, outlet, user } = useAuth();

  const _sendToKitchen = () => {
    if (ipcRenderer) {
      let copies =
        ipcRenderer.sendSync("electron-store-get", "printer-kitchen-copies") ??
        2;

      for (let index = 0; index < copies; index++) {
        ipcRenderer.send("print-order", data, 1);
      }
    }
  };

  const _sendToKitchenAdditional = () => {
    if (ipcRenderer) {
      if (data.details.filter((e) => e.type === 1).length > 0) {
        let copies =
          ipcRenderer.sendSync(
            "electron-store-get",
            "printer-kitchen-copies"
          ) ?? 2;

        for (let index = 0; index < copies; index++) {
          ipcRenderer.send("print-order-additional", data, 1);
        }
      } else {
        Toast.fire(
          "Peringatan!",
          "Tidak terdapat item tambahan pada pesanan ini",
          "warning"
        );
      }
    }
  };

  const _printBill = () => {
    if (ipcRenderer) {
      ipcRenderer.send(
        "print-bill",
        {
          name: outlet.name,
          address: outlet.address,
          instagram: "ramenbajuri",
          kasir: ucwords(user.name),
        },
        data
      );
    }
  };

  const _printAccount = () => {
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
          onClick={_sendToKitchen}
          className="flex flex-row p-4 bg-gray-100 cursor-pointer mb-2 items-center"
        >
          <DynamicHeroIcon icon="TruckIcon" className="mr-4 h-6 w-6" />
          <span className="text-sm font-medium text-gray-900">
            Cetak ke Dapur
          </span>
        </div>
        <div
          onClick={_sendToKitchenAdditional}
          className="flex flex-row p-4 bg-gray-100 cursor-pointer mb-2 items-center"
        >
          <DynamicHeroIcon icon="DocumentPlusIcon" className="mr-4 h-6 w-6" />
          <span className="text-sm font-medium text-gray-900">
            Cetak Item Tambahan ke Dapur
          </span>
        </div>
        <div
          onClick={_printBill}
          className="flex flex-row p-4 bg-gray-100 cursor-pointer mb-2 items-center"
        >
          <DynamicHeroIcon icon="PrinterIcon" className="mr-4 h-6 w-6" />
          <span className="text-sm font-medium text-gray-900">Cetak Struk</span>
        </div>
        {data.member !== null ? (
          <div
            onClick={_printAccount}
            className="flex flex-row p-4 bg-gray-100 cursor-pointer mb-2 items-center"
          >
            <DynamicHeroIcon icon="UserIcon" className="mr-4 h-6 w-6" />
            <span className="text-sm font-medium text-gray-900">
              Cetak Akun
            </span>
          </div>
        ) : null}
      </div>
    </MyModal>
  );
};

export default CetakModal;
