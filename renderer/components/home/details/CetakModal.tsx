import React from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../hooks/AuthContext";
import { DynamicHeroIcon } from "../../globals/icons";

import MyModal from "../../globals/modal/MyModal";
import electron from "electron";
import { OrderDetail } from "../../../services/OrderService";
import { ucwords } from "../../../utils/string";

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
        <div className="flex flex-row p-4 bg-gray-100 cursor-pointer mb-2 items-center">
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
      </div>
    </MyModal>
  );
};

export default CetakModal;
