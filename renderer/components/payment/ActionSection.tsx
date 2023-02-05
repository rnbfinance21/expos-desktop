import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { resetOrder } from "../../features/orderSlice";
import {
  getPayment,
  getPaymentAllSumPrice,
  resetPayment,
  setInputNumpad,
} from "../../features/paymentSlice";
import { useAuth } from "../../hooks/AuthContext";
import OrderService, {
  SavePaymentParams,
  UpdatePaymentParams,
} from "../../services/OrderService";
import { handleErrorAxios } from "../../utils/errors";
import Toast from "../../utils/toast";
import { Button } from "../globals/buttons";
import { Numpad } from "../globals/keyboard";
import electron from "electron";
import { ucwords } from "../../utils/string";

const ActionSection = () => {
  const ipcRenderer = electron.ipcRenderer || false;

  const dispatch = useDispatch();
  const router = useRouter();
  const { token, outlet, user } = useAuth();
  const {
    type,
    id,
    inputNumpad,
    orderType,
    paymentType,
    tax,
    identity,
    orders,
    bayar,
    diskon,
    potongan,
  } = useSelector(getPayment);
  const { kembalian, total } = useSelector(getPaymentAllSumPrice);

  const validationSave = () => {
    if (
      orderType !== null &&
      paymentType !== null &&
      tax !== null &&
      kembalian >= 0
    ) {
      return true;
    }

    return false;
  };

  const saveMutation = useMutation(
    (params: SavePaymentParams) => OrderService.savePayment(token, params),
    {
      onSuccess: (res) => {
        if (ipcRenderer) {
          ipcRenderer.send(
            "print-reprint",
            {
              name: outlet.name,
              address: outlet.address,
              instagram: "ramenbajuri",
              kasir: ucwords(user.name),
            },
            res.data,
            2
          );
        }
        Swal.fire({
          title: "Berhasil",
          text: "Transaksi Berhasil, Jangan lupa ucapkan Terima Kasih",
          allowOutsideClick: false,
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Oke",
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(resetPayment());
            dispatch(resetOrder());

            router.replace("/home");
          }
        });
      },
      onError: handleErrorAxios,
    }
  );

  const updateMutation = useMutation(
    (params: UpdatePaymentParams) => OrderService.updatePayment(token, params),
    {
      onSuccess: (res) => {
        if (ipcRenderer) {
          ipcRenderer.send(
            "print-reprint",
            {
              name: outlet.name,
              address: outlet.address,
              instagram: "ramenbajuri",
              kasir: ucwords(user.name),
            },
            res.data,
            2
          );
        }
        Swal.fire({
          title: "Berhasil",
          text: "Transaksi Berhasil, Jangan lupa ucapkan Terima Kasih",
          allowOutsideClick: false,
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Oke",
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(resetPayment());
            dispatch(resetOrder());

            router.replace("/home");
          }
        });
      },
      onError: handleErrorAxios,
    }
  );

  const voidMutation = useMutation(
    (params: UpdatePaymentParams) => OrderService.voidPayment(token, params),
    {
      onSuccess: (res) => {
        if (ipcRenderer) {
          ipcRenderer.send(
            "print-reprint",
            {
              name: outlet.name,
              address: outlet.address,
              instagram: "ramenbajuri",
              kasir: ucwords(user.name),
            },
            res.data,
            3
          );
        }
        Swal.fire({
          title: "Berhasil",
          text: "Transaksi Berhasil, Jangan lupa ucapkan Terima Kasih",
          allowOutsideClick: false,
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Oke",
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(resetPayment());
            dispatch(resetOrder());

            router.replace("/home");
          }
        });
      },
      onError: handleErrorAxios,
    }
  );

  const _onChange = (val: string) => {
    dispatch(setInputNumpad(parseInt(val, 0)));
  };

  const _onPayment = () => {
    if (validationSave()) {
      if (type === "UPDATE" && id !== null) {
        updateMutation.mutate({
          id,
          name: identity.name,
          table: identity.table,
          no_bill: identity.no_bill,
          bayar,
          diskon,
          kategori_order_id: orderType,
          kategori_payment_id: paymentType,
          kembalian,
          pajak: tax,
          potongan,
          total,
          details: orders.map((d) => {
            return {
              menu_id: d.menu.id,
              box: d.box,
              description: d.notes,
              diskon: d.diskon,
              margin: d.margin,
              pajak_state: d.pajak_stat,
              price: d.price,
              qty: d.qty,
              variants: d.variants.map((v) => {
                return {
                  option_id: v.option_id,
                  price: v.price,
                };
              }),
            };
          }),
        });
      } else if (type === "ADD") {
        saveMutation.mutate({
          outlet_id: outlet.id,
          name: identity.name,
          table: identity.table,
          no_bill: identity.no_bill,
          bayar,
          diskon,
          kategori_order_id: orderType,
          kategori_payment_id: paymentType,
          kembalian,
          pajak: tax,
          potongan,
          total,
          details: orders.map((d) => {
            return {
              menu_id: d.menu.id,
              box: d.box,
              description: d.notes,
              diskon: d.diskon,
              margin: d.margin,
              pajak_state: d.pajak_stat,
              price: d.price,
              qty: d.qty,
              variants: d.variants.map((v) => {
                return {
                  option_id: v.option_id,
                  price: v.price,
                };
              }),
            };
          }),
        });
      }
    } else {
      Toast.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "Silahkan lengkapi data pembayaran",
      });
    }
  };

  const _onVoid = () => {
    if (validationSave() && id !== null) {
      voidMutation.mutate({
        id,
        name: identity.name,
        table: identity.table,
        no_bill: identity.no_bill,
        bayar,
        diskon,
        kategori_order_id: orderType,
        kategori_payment_id: paymentType,
        kembalian,
        pajak: tax,
        potongan,
        total,
        details: orders.map((d) => {
          return {
            menu_id: d.menu.id,
            box: d.box,
            description: d.notes,
            diskon: d.diskon,
            margin: d.margin,
            pajak_state: d.pajak_stat,
            price: d.price,
            qty: d.qty,
            variants: d.variants.map((v) => {
              return {
                option_id: v.option_id,
                price: v.price,
              };
            }),
          };
        }),
      });
    } else {
      Toast.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "Silahkan lengkapi data pembayaran",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Numpad value={inputNumpad.toString()} onChange={_onChange} />
      </div>
      <div className="flex flex-col space-y-2">
        <Button
          type="button"
          className="flex-1 bg-red-500 text-sm  text-white border border-red-300 rounded-lg"
        >
          CETAK STRUK
        </Button>
        {type !== "VOID" ? (
          <Button
            type="button"
            className="flex-1 bg-red-500 text-sm text-white border border-red-300 rounded-lg"
            isLoading={updateMutation.isLoading || saveMutation.isLoading}
            disabled={updateMutation.isLoading || saveMutation.isLoading}
            onClick={_onPayment}
          >
            BAYAR
          </Button>
        ) : (
          <Button
            type="button"
            className="flex-1 bg-red-500 text-sm text-white border border-red-300 rounded-lg"
            isLoading={voidMutation.isLoading}
            disabled={voidMutation.isLoading}
            onClick={_onVoid}
          >
            SIMPAN VOID
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActionSection;
