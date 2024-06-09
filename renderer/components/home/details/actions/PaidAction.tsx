import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setRefetchOrder } from "../../../../features/listOrderSlice";
import {
  VariantOrder,
  setId,
  setIdentity,
  setOrders,
  setType,
} from "../../../../features/orderSlice";
import { resetPayment, setPayment } from "../../../../features/paymentSlice";
import { useAuth } from "../../../../hooks/AuthContext";
import OrderService, {
  OrderDetail,
  UpdateStateParams,
} from "../../../../services/OrderService";
import { handleErrorAxios } from "../../../../utils/errors";
import DetailActionButton from "../../../form/details/DetailActionButton";
import PasscodeModal from "../../../modals/PasscodeModal";
import electron from "electron";
import { ucwords } from "../../../../utils/string";
import Toast from "../../../../utils/toast";
import axios from "../../../../utils/axios";

interface PaidActionProps {
  data: OrderDetail;
}

const PaidAction = ({ data }: PaidActionProps) => {
  const ipcRenderer = electron.ipcRenderer || false;
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, outlet, user } = useAuth();

  const [openPasscodeModal, setOpenPasscodeModal] = useState(false);

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

  const _onCancel = () => {
    setOpenPasscodeModal(true);
  };

  const _onSuccessPasscode = () => {
    setOpenPasscodeModal(false);
    dispatch(setType("VOID"));
    dispatch(
      setIdentity({
        memberId: null,
        name: data.name,
        no_bill: data.no_bill,
        table: data.table,
      })
    );
    dispatch(
      setOrders(
        data.details.map((d) => {
          let tmpVariant: VariantOrder[] = [];

          d.variants.forEach((e) => {
            let find = tmpVariant.findIndex((f) => f.id === e.id);

            if (find === -1) {
              tmpVariant.push({
                id: e.id,
                name: e.variant_name,
                data: [
                  {
                    option_id: e.variant_option_id,
                    option_name: e.option_name,
                    price: e.price,
                  },
                ],
              });
            } else {
              let selected = tmpVariant[find];

              let tmpData: {
                option_id: number;
                option_name: string;
                price: number;
              }[] = [
                ...selected.data,
                {
                  option_id: e.variant_option_id,
                  option_name: e.option_name,
                  price: e.price,
                },
              ];

              tmpVariant[find].data = tmpData;
            }
          });

          return {
            id: d.menu.id,
            box: d.box,
            diskon: d.diskon,
            margin: d.margin,
            margin_stat: d.menu.box_state,
            pajak_stat: d.pajak_state,
            notes: d.description,
            price: d.price,
            qty: d.qty,
            menu: d.menu,
            type_order: d.type_order,
            id_detail: d.id,
            variants: tmpVariant,
            // variants: d.variants.map((v) => {
            //   return {
            //     option_id: v.variant_option_id,
            //     price: v.price,
            //     category_id: v.variant_id,
            //     category_name: v.variant_name,
            //     option_name: v.option_name,
            //   };
            // }),
          };
        })
      )
    );
    dispatch(setId(data.id));
    router.push("/form");
  };

  const _sendToKitchen = () => {
    if (ipcRenderer) {
      // let copies =
      //   ipcRenderer.sendSync("electron-store-get", "printer-kitchen-copies") ??
      //   2;

      // for (let index = 0; index < copies; index++) {
      // }
      ipcRenderer.send("print-order", data, 1);
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

  const _rePrint = () => {
    if (ipcRenderer) {
      ipcRenderer.send(
        "print-reprint",
        {
          name: outlet.name,
          address: outlet.address,
          instagram: outlet.instagram,
          kasir: ucwords(user.name),
          contact: outlet.contact
        },
        data,
        1
      );

      mutationLogs.mutate("[Lunas] cetak ulang struk");
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-row flex-wrap items-start justify-start gap-2">
        <DetailActionButton
          icon="PrinterIcon"
          title="Cetak Struk"
          onClick={_rePrint}
        />
        <DetailActionButton
          icon="PrinterIcon"
          title="Cetak Pesanan"
          onClick={_sendToKitchen}
        />
        <DetailActionButton
          icon="PrinterIcon"
          title="Cetak Tambahan"
          onClick={_sendToKitchenAdditional}
        />
        <DetailActionButton
          icon="XMarkIcon"
          title="Void"
          outline={false}
          onClick={_onCancel}
          iconClassName="text-white"
        />
      </div>
      <PasscodeModal
        visible={openPasscodeModal}
        onClose={() => setOpenPasscodeModal(false)}
        onSuccess={_onSuccessPasscode}
      />
    </>
  );
};

export default PaidAction;
