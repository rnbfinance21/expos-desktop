import { useRouter } from "next/router";
import React, { useState } from "react";
import electron from "electron";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setRefetchOrder } from "@/features/listOrderSlice";
import {
  VariantOrder,
  setId,
  setIdentity,
  setOrders,
  setType,
} from "@/features/orderSlice";
import { resetPayment, setPayment } from "@/features/paymentSlice";
import { useAuth } from "@/hooks/AuthContext";
import { checkKas, updateState } from "@/modules/order/api";
import { OrderDetail, UpdateStateParams } from "@/modules/order/type";
import { handleErrorAxios } from "@/utils/errors";
import DetailActionButton from "@/modules/form/components/details/DetailActionButton";
import PasscodeModal from "@/modules/shared/components/PasscodeModal";
import UangKasModal from "@/modules/shared/components/UangKasModal";
import { generateRandomString } from "@/utils/string";
import GabungModal from "@/features/home/components/details/gabung-modal";
import CetakModal from "@/features/home/components/details/cetak-modal";

interface ProsesActionProps {
  data: OrderDetail;
}

const ProsesAction = ({ data }: ProsesActionProps) => {
  const ipcRenderer = electron.ipcRenderer || false;
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, outlet, setKasState } = useAuth();

  const [openPasscodeModal, setOpenPasscodeModal] = useState(false);
  const [openGabungModal, setOpenGabungModal] = useState(false);
  const [openKasModal, setOpenKasModal] = useState(false);
  const [openPrintModal, setOpenPrintModal] = useState(false);

  const changeStateMutation = useMutation(
    (params: UpdateStateParams) => updateState(token, params),
    {
      onSuccess: (res) => {
        Swal.fire("Berhasil!", res.message, "success");
        dispatch(setRefetchOrder(true));
      },
      onError: handleErrorAxios,
    }
  );

  const checkKasMuation = useMutation(() => checkKas(token, outlet.id), {
    onSuccess: (res) => {
      setKasState(res.state);
    },
    onError: () => {
      setKasState(false);
    },
  });

  const onChange = () => {
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
            const find = tmpVariant.findIndex((f) => f.id === e.variant_id);

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
              const selected = tmpVariant[find];

              const tmpData: {
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
          };
        })
      )
    );
    dispatch(setId(data.id));
    router.push("/form");
  };

  const redirectToPayment = () => {
    dispatch(resetPayment());
    dispatch(
      setPayment({
        key: generateRandomString(32),
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
            const find = tmpVariant.findIndex((f) => f.id === e.variant_id);

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
              const selected = tmpVariant[find];

              const tmpData: {
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
            price_menu: d.price,
            qty: d.qty,
            menu: d.menu,
            variants: tmpVariant,
            type_order: d.type_order,
          };
        }),
      })
    );
    router.push("/payment");
  };

  const onPayment = () => {
    checkKasMuation.mutateAsync().then((res) => {
      if (!res.state) {
        setOpenKasModal(true);
      } else {
        redirectToPayment();
      }
    });
  };

  const onSuccessKas = () => {
    redirectToPayment();
    setOpenKasModal(false);
  };

  const onSuccessPasscode = () => {
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
      <div className="flex-1 flex flex-row flex-wrap items-start justify-start gap-2">
        <DetailActionButton
          icon="PrinterIcon"
          title="Cetak"
          onClick={() => setOpenPrintModal(true)}
        />
        <DetailActionButton icon="PencilIcon" title="Ubah" onClick={onChange} />
        <DetailActionButton
          icon="CurrencyDollarIcon"
          title="Bayar"
          onClick={onPayment}
        />
        <DetailActionButton
          icon="BanknotesIcon"
          title="Gabung ke"
          onClick={() => setOpenGabungModal(true)}
        />
        <DetailActionButton
          icon="XMarkIcon"
          title="Batal"
          outline={false}
          onClick={() => setOpenPasscodeModal(true)}
          iconClassName="text-white"
        />
      </div>
      <PasscodeModal
        visible={openPasscodeModal}
        onClose={() => setOpenPasscodeModal(false)}
        onSuccess={onSuccessPasscode}
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
        onSuccess={onSuccessKas}
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
