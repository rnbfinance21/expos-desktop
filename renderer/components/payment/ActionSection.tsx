import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { resetOrder } from "../../features/orderSlice";
import {
  getOrderType,
  getPaymentType,
} from "../../features/paymentAttributeSlice";
import {
  getPayment,
  getPaymentAllSumPrice,
  resetPayment,
  setInputNumpad,
} from "../../features/paymentSlice";
import { useAuth } from "../../hooks/AuthContext";
import OrderService, {
  OrderDetail,
  SavePaymentParams,
  UpdatePaymentParams,
  VoidPaymentParams,
} from "../../services/OrderService";
import { handleErrorAxios } from "../../utils/errors";
import Toast from "../../utils/toast";
import { Button } from "../globals/buttons";
import { Numpad } from "../globals/keyboard";
import electron from "electron";
import { ucwords } from "../../utils/string";
import { formatFullDate } from "../../utils/date";
import { DetailVariant } from "../../services/OrderService";

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
    keterangan,
    changeState,
  } = useSelector(getPayment);
  const { kembalian, total, diskon_value, pajak_value, subtotal, sumPayment } =
    useSelector(getPaymentAllSumPrice);
  const orderTypeList = useSelector(getOrderType);
  const paymentTypeList = useSelector(getPaymentType);

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

  const validationSimulate = () => {
    if (orderType !== null && paymentType !== null && tax !== null) {
      return true;
    }

    return false;
  };

  const saveMutation = useMutation(
    (params: SavePaymentParams) => OrderService.savePayment(token, params),
    {
      onSuccess: async (res) => {
        if (ipcRenderer) {
          if (changeState) {
            ipcRenderer.send(
              "print-reprint-with-struk",
              {
                name: outlet.name,
                address: outlet.address,
                instagram: "ramenbajuri",
                kasir: ucwords(user.name),
              },
              res.data,
              2
            );
          } else {
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
    (params: VoidPaymentParams) => OrderService.voidPayment(token, params),
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
                let resultVariant: {
                  option_id: number;
                  price: number;
                }[] = [];

                d.variants.forEach((e) => {
                  e.data.forEach((data) => {
                    resultVariant.push({
                      option_id: data.option_id,
                      price: data.price,
                    });
                  });
                });

                return {
                  menu_id: d.menu.id,
                  box: d.box,
                  description: d.notes,
                  diskon: d.diskon,
                  margin: d.margin,
                  pajak_state: d.pajak_stat,
                  price: d.price,
                  qty: d.qty,
                  variants: resultVariant,
                  type_order: d.type_order,
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
                let resultVariant: {
                  option_id: number;
                  price: number;
                }[] = [];

                d.variants.forEach((e) => {
                  e.data.forEach((data) => {
                    resultVariant.push({
                      option_id: data.option_id,
                      price: data.price,
                    });
                  });
                });

                return {
                  menu_id: d.menu.id,
                  box: d.box,
                  description: d.notes,
                  diskon: d.diskon,
                  margin: d.margin,
                  pajak_state: d.pajak_stat,
                  price: d.price,
                  qty: d.qty,
                  variants: resultVariant,
                  type_order: d.type_order,
                };
              }),
            });
          }
        }
      });
    } else {
      Toast.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "Silahkan lengkapi data pembayaran",
      });
    }
  };

  const _onVoid = () => {
    if (validationSave() && id !== null && keterangan !== "") {
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
            keterangan,
            details: orders.map((d) => {
              let resultVariant: {
                option_id: number;
                price: number;
              }[] = [];

              d.variants.forEach((e) => {
                e.data.forEach((data) => {
                  resultVariant.push({
                    option_id: data.option_id,
                    price: data.price,
                  });
                });
              });

              return {
                menu_id: d.menu.id,
                box: d.box,
                description: d.notes,
                diskon: d.diskon,
                margin: d.margin,
                pajak_state: d.pajak_stat,
                price: d.price,
                qty: d.qty,
                variants: resultVariant,
                type_order: d.type_order,
              };
            }),
          });
        }
      });
    } else if (keterangan === "") {
      Toast.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "Silahkan isi keterangan void",
      });
    } else {
      Toast.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "Silahkan lengkapi data pembayaran",
      });
    }
  };

  const _simulatePrint = () => {
    if (validationSimulate() && id !== null) {
      if (ipcRenderer) {
        let simluateData: OrderDetail = {
          id: 0,
          bayar,
          created_at: "",
          updated_at: "",
          date: formatFullDate(new Date()),
          deleted_at: null,
          diskon: diskon,
          diskon_value,
          items_count: orders.length,
          kasir_id: null,
          kembalian,
          kategori_order_id: orderType,
          kategori_payment_id: paymentType,
          kategori_order_name: orderTypeList[orderType - 1].name,
          kategori_payment_name: paymentTypeList[paymentType - 1].name,
          kode_transaksi: "-",
          name: identity.name,
          no_bill: identity.no_bill,
          outlet_id: null,
          pajak: tax,
          pajak_value,
          potongan,
          reason: null,
          status: 1,
          status_text: "Proses",
          subtotal,
          subtotal_box: 0,
          subtotal_pajak: sumPayment,
          table: identity.table,
          total: total,
          type: 1,
          type_text: "Dine In",
          details: orders.map((o) => {
            let margin = (o.price * o.margin) / 100;
            let sum = o.price + margin + o.box;
            let diskon = (sum * o.diskon) / 100;

            let total = (sum - diskon) * o.qty;

            let myVariants: DetailVariant[] = [];

            o.variants.forEach((e) => {
              e.data.forEach((f) => {
                myVariants.push({
                  id: 0,
                  transaksi_detail_id: o.id,
                  variant_option_id: f.option_id,
                  price: f.price,
                  state: 1,
                  deleted_at: null,
                  created_at: "",
                  updated_at: "",
                  option_name: f.option_name,
                  variant_name: e.name,
                  variant_id: e.id,
                });
              });
            });

            o.variants.map((e) => {
              return e.data.map((f) => {
                return {
                  id: 0,
                  transaksi_detail_id: o.id,
                  variant_option_id: f.option_id,
                  price: f.price,
                  state: 1,
                  deleted_at: null,
                  created_at: "",
                  updated_at: "",
                  option_name: f.option_name,
                  variant_name: e.name,
                  variant_id: e.id,
                };
              });
            });

            return {
              box: o.box,
              id: o.id,
              description: o.notes,
              diskon: o.diskon,
              margin: o.margin,
              menu: o.menu,
              menu_id: o.menu.id,
              pajak_state: o.pajak_stat,
              price: o.price,
              qty: o.qty,
              status: 1,
              total: total,
              transaksi_id: 1,
              variants: myVariants,
              created_at: "",
              updated_at: "",
              deleted_at: "",
              type: 0,
              type_order: 1,
            };
          }),
          member: {
            id: 0,
            name: "",
            username: "",
            password_show: "",
            type: 1,
          },
        };

        ipcRenderer.send(
          "print-simulate",
          {
            name: outlet.name,
            address: outlet.address,
            instagram: "ramenbajuri",
            kasir: ucwords(user.name),
          },
          simluateData
        );
      }
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
          onClick={_simulatePrint}
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
