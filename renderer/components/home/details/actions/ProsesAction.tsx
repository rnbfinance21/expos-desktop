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
import GabungModal from "../GabungModal";
import UangKasModal from "../../../modals/UangKasModal";
import CetakModal from "../CetakModal";

interface ProsesActionProps {
  data: OrderDetail;
}

const ProsesAction = ({ data }: ProsesActionProps) => {
  const ipcRenderer = electron.ipcRenderer || false;
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, outlet, user, setKasState } = useAuth();

  const [openPasscodeModal, setOpenPasscodeModal] = useState(false);
  const [openGabungModal, setOpenGabungModal] = useState(false);

  const [openKasModal, setOpenKasModal] = useState(false);
  const [openKasType, setOpenKasType] = useState("PAYMENT");

  const [openPrintModal, setOpenPrintModal] = useState(false);

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

  const checkKasMuation = useMutation(
    () => OrderService.checkKas(token, outlet.id),
    {
      onSuccess: (res) => {
        setKasState(res.state);
      },
      onError: () => {
        setKasState(false);
      },
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
          let tmpVariant: VariantOrder[] = [];

          d.variants.forEach((e) => {
            let find = tmpVariant.findIndex((f) => f.id === e.variant_id);

            if (find === -1) {
              tmpVariant.push({
                id: e.variant_id,
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
            id_detail: d.id,
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

  const _onCancel = () => {
    setOpenPasscodeModal(true);
  };

  const _redirectToPayment = () => {
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
          let tmpVariant: VariantOrder[] = [];

          d.variants.forEach((e) => {
            let find = tmpVariant.findIndex((f) => f.id === e.variant_id);

            if (find === -1) {
              tmpVariant.push({
                id: e.variant_id,
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
            variants: tmpVariant,
            type_order: d.type_order,
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
        }),
      })
    );
    router.push("/payment");
  };

  const _onPayment = () => {
    checkKasMuation.mutateAsync().then((res) => {
      if (!res.state) {
        setOpenKasType("UPDATE");
        setOpenKasModal(true);
      } else {
        _redirectToPayment();
      }
    });
  };

  const _onSuccessKas = () => {
    _redirectToPayment();

    setOpenKasModal(false);
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

  const _onMerge = () => {
    setOpenGabungModal(true);
  };

  return (
    <>
      <div className="flex-1 flex flex-row flex-wrap items-start justify-start gap-2">
        <DetailActionButton
          icon="PrinterIcon"
          title="Cetak"
          onClick={() => setOpenPrintModal(true)}
        />
        {/* <DetailActionButton
          icon="TruckIcon"
          title="Cetak Tambahan"
          onClick={_sendToKitchen}
        />
        <DetailActionButton
          icon="PrinterIcon"
          title="Cetak Struk"
          onClick={_printBill}
        /> */}
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
          icon="BanknotesIcon"
          title="Gabung ke"
          onClick={_onMerge}
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
      <GabungModal
        show={openGabungModal}
        onClose={() => setOpenGabungModal(false)}
        data={data}
      />
      <UangKasModal
        visible={openKasModal}
        openState={1}
        onError={() => {}}
        onSuccess={_onSuccessKas}
      />
      <CetakModal
        show={openPrintModal}
        onClose={() => setOpenPrintModal(false)}
        data={data}
      />
    </>
  );
};

export default ProsesAction;
