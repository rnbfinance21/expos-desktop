import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { setSearch } from "../../../features/menuSlice";
import {
  getOrder,
  getSumOrder,
  resetOrder,
} from "../../../features/orderSlice";
import { resetPayment, setPayment } from "../../../features/paymentSlice";
import { useAuth } from "../../../hooks/AuthContext";
import OrderService, {
  SaveDraftParams,
  UpdateDraftParams,
} from "../../../services/OrderService";
import { numberFormat } from "../../../utils/currency";
import { handleErrorAxios } from "../../../utils/errors";
import Toast from "../../../utils/toast";
import UangKasModal from "../../modals/UangKasModal";
import DetailActionButton from "./DetailActionButton";
import { generateRandomString } from "../../../utils/string";

const DetailAction = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, kasState, outlet, setKasState } = useAuth();
  const { identity, orders, type, id, updateLog, deleteLog, key } =
    useSelector(getOrder);
  const sum = useSelector(getSumOrder);

  const idempotencyKeyRef = useRef<string>(generateRandomString(32));
  const [openKasModal, setOpenKasModal] = useState(false);
  const [openKasType, setOpenKasType] = useState("SAVE");

  const changeStateMutation = useMutation(
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

  const saveDraftMutation = useMutation(
    (params: SaveDraftParams) => OrderService.saveDraft(token, params),
    {
      retry: false,
      onSuccess: (res) => {
        dispatch(resetOrder());
        Swal.fire("Berhasil!", res.message, "success");
        router.replace("/home");
      },
      onError: handleErrorAxios,
    }
  );

  const updateDraftMutation = useMutation(
    (params: UpdateDraftParams) => OrderService.updateDraft(token, params),
    {
      retry: false,
      onSuccess: (res) => {
        dispatch(resetOrder());
        Swal.fire("Berhasil!", res.message, "success");
        router.replace("/home");
      },
      onError: handleErrorAxios,
    }
  );

  const _onConfirm = () => {
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
        if (type === "ADD") {
          saveDraftMutation.mutate({
            key: key ?? idempotencyKeyRef.current,
            outlet_id: outlet.id,
            name: identity.name,
            table: identity.table,
            no_bill: identity.no_bill,
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
        } else {
          updateDraftMutation.mutate({
            id,
            name: identity.name,
            table: identity.table,
            no_bill: identity.no_bill,
            updateLogs: updateLog,
            deleteLogs: deleteLog,
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
                id_detail: d.id_detail,
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
  };

  const _redirectPayment = () => {
    dispatch(resetPayment());
    dispatch(
      setPayment({
        type: type,
        key: key ?? idempotencyKeyRef.current,
        id: id,
        identity: {
          member_id: null,
          name: identity.name,
          table: identity.table,
          no_bill: identity.no_bill,
        },
        orders: orders.map((d) => {
          return {
            id: d.id,
            box: d.box,
            diskon: d.diskon,
            margin: d.margin,
            margin_stat: d.menu.box_state,
            pajak_stat: d.menu.tax_state,
            notes: d.notes,
            price: d.price,
            price_menu: d.price,
            qty: d.qty,
            menu: d.menu,
            variants: d.variants,
            type_order: d.type_order,
            // variants: d.variants.map((v) => {
            //   return {
            //     option_id: v.option_id,
            //     price: v.price,
            //     category_id: v.category_id,
            //     category_name: v.category_name,
            //     option_name: v.option_name,
            //   };
            // }),
          };
        }),
      })
    );
    router.push("/payment");
  };

  const _onSuccessKas = () => {
    if (openKasType === "SAVE") {
      _onConfirm();
    } else {
      _redirectPayment();
    }

    setOpenKasModal(false);
  };

  const _onSave = () => {
    if (identity.name === "" || identity.table === "") {
      Toast.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "Silahkan isi data pelanggan",
      });
    } else if (orders.length === 0) {
      Toast.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "Transaksi minimal 1 item",
      });
    } else {
      changeStateMutation.mutateAsync().then((res) => {
        if (!res.state) {
          setOpenKasType("SAVE");
          setOpenKasModal(true);
        } else {
          _onConfirm();
        }
      });
    }
  };

  const _onPayment = () => {
    if (identity.name == null || identity.name == "") {
      Toast.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "Silahkan isi nama pelanggan",
      });
    } else if (identity.table == null || identity.table == "") {
      Toast.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "Silahkan isi nomor meja",
      });
    } else if (identity.no_bill == null || identity.no_bill == "") {
      Toast.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "Silahkan isi nomor bill / bon ",
      });
    } else if (orders.length === 0) {
      Toast.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "Transaksi minimal 1 item",
      });
    } else {
      changeStateMutation.mutateAsync().then((res) => {
        if (!res.state) {
          setOpenKasType("PAYMENT");
          setOpenKasModal(true);
        } else {
          _redirectPayment();
        }
      });
    }
  };

  return (
    <>
      <div className="flex flex-col bg-white border-b pt-4 border-t">
        <div className="flex flex-row pb-2 px-4">
          <div className="flex-1 flex flex-row gap-2">
            <DetailActionButton
              icon="CubeIcon"
              title="Tambah Box"
              onClick={() => dispatch(setSearch("box"))}
            />
          </div>
          <div>
            <DetailActionButton
              icon="XMarkIcon"
              title="Batal Pesan"
              outline={false}
              iconClassName="text-white"
              onClick={() => dispatch(resetOrder())}
            />
          </div>
        </div>
        {/* {type === "ADD" && (
          <div className="grid grid-cols-2">
            <div
              onClick={_onSave}
              className="bg-blue-500 active:bg-blue-600 text-white p-4 text-center text-sm font-medium cursor-pointer"
            >
              {saveDraftMutation.isLoading ? "Mohon Tunggu..." : "Simpan"}
            </div>
            <div
              onClick={_onPayment}
              className="bg-green-500 active:bg-green-600 text-white p-4 text-center text-sm font-medium cursor-pointer"
            >
              Rp {numberFormat(sum, 0)}
            </div>
          </div>
        )} */}
        {type !== "VOID" ? (
          <div className="grid grid-cols-2">
            <button
              onClick={_onSave}
              disabled={saveDraftMutation.isLoading || updateDraftMutation.isLoading}
              className="bg-blue-500 active:bg-blue-600 text-white p-4 text-center text-sm font-medium cursor-pointer"
            >
              {saveDraftMutation.isLoading ? "Mohon Tunggu..." : "Simpan"}
            </button>
            <div
              onClick={_onPayment}
              className="bg-green-500 active:bg-green-600 text-white p-4 text-center text-sm font-medium cursor-pointer"
            >
              Rp {numberFormat(sum, 0)}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1">
            <div
              onClick={_onPayment}
              className="bg-green-500 active:bg-green-600 text-white p-4 text-center text-sm font-medium cursor-pointer"
            >
              Lanjut
            </div>
          </div>
        )}
      </div>
      <UangKasModal
        visible={openKasModal}
        openState={1}
        onError={() => {}}
        onSuccess={_onSuccessKas}
      />
    </>
  );
};

export default DetailAction;
