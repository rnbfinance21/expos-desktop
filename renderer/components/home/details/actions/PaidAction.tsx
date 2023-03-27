import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setRefetchOrder } from "../../../../features/listOrderSlice";
import {
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

interface PaidActionProps {
  data: OrderDetail;
}

const PaidAction = ({ data }: PaidActionProps) => {
  const ipcRenderer = electron.ipcRenderer || false;
  const dispatch = useDispatch();
  const router = useRouter();
  const { outlet, user } = useAuth();

  const [openPasscodeModal, setOpenPasscodeModal] = useState(false);

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
            variants: d.variants.map((v) => {
              return {
                option_id: v.variant_option_id,
                price: v.price,
                category_id: v.variant_id,
                category_name: v.variant_name,
                option_name: v.option_name,
              };
            }),
          };
        })
      )
    );
    dispatch(setId(data.id));
    router.push("/form");
  };

  const _rePrint = () => {
    if (ipcRenderer) {
      ipcRenderer.send(
        "print-reprint",
        {
          name: outlet.name,
          address: outlet.address,
          instagram: "ramenbajuri",
          kasir: ucwords(user.name),
        },
        data,
        1
      );
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-row gap-2">
        <DetailActionButton
          icon="PrinterIcon"
          title="Cetak Struk"
          onClick={_rePrint}
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
