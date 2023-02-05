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
import electron from 'electron'

interface ProsesActionProps {
  data: OrderDetail;
}

const ProsesAction = ({ data }: ProsesActionProps) => {
  const ipcRenderer = electron.ipcRenderer || false;
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = useAuth();

  const [openPasscodeModal, setOpenPasscodeModal] = useState(false);

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

  const _onChange = () => {
    dispatch(setType("UPDATE"));
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

  const _onCancel = () => {
    setOpenPasscodeModal(true);
  };

  const _onPayment = () => {
    dispatch(resetPayment());
    dispatch(
      setPayment({
        type: "UPDATE",
        id: data.id,
        identity: {
          member_id: null,
          name: data.name,
          table: data.table,
          no_bill: data.no_bill,
        },
        orders: data.details.map((d) => {
          return {
            id: d.id,
            box: d.box,
            diskon: d.diskon,
            margin: d.margin,
            margin_stat: d.menu.box_state,
            pajak_stat: d.pajak_state,
            notes: d.description,
            price: d.price,
            qty: d.qty,
            menu: d.menu,
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
        }),
      })
    );
    router.push("/payment");
  };

  const _sendToKitchen = () => {
    if(ipcRenderer){
      ipcRenderer.send('print-order', data);
    }
  }

  const _onSuccessPasscode = () => {
    setOpenPasscodeModal(false);
    Swal.fire({
      title: "Alasan Pembatalan",
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
    <>
      <div className="flex-1 flex flex-row gap-2">
        <DetailActionButton
          icon="TruckIcon"
          title="Cetak Ke Dapur"
          onClick={_sendToKitchen}
        />
        <DetailActionButton
          icon="PrinterIcon"
          title="Cetak Struk"
          onClick={() => {}}
        />
        <DetailActionButton
          icon="PencilIcon"
          title="Ubah"
          onClick={_onChange}
        />
        <DetailActionButton
          icon="CurrencyDollarIcon"
          title="Bayar"
          onClick={_onPayment}
        />
        <DetailActionButton
          icon="XMarkIcon"
          title="Batal"
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

export default ProsesAction;
