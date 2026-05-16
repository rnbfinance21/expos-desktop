import { useRouter } from "next/router";
import { useCallback, useRef } from "react";
import { useMutation } from "react-query";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import electron from "electron";
import { AppDispatch, RootState } from "@/config/store";
import { resetOrder } from "@/features/orderSlice";
import {
    getOrderType,
    getPaymentType,
} from "@/features/paymentAttributeSlice";
import {
    getPaymentAllSumPrice,
    resetPayment,
    setInputNumpad,
} from "@/features/paymentSlice";
import { useAuth } from "@/hooks/AuthContext";
import { savePayment, updatePayment, voidPayment } from "@/modules/order/api";
import {
    SavePaymentParams,
    UpdatePaymentParams,
    VoidPaymentParams,
} from "@/modules/order/type";
import axios from "@/utils/axios";
import { handleErrorAxios } from "@/utils/errors";
import { generateRandomString, ucwords } from "@/utils/string";
import Toast from "@/utils/toast";
import {
    buildReceiptIdentity,
    buildSimulateOrder,
    mapPaymentDetailsPayload,
} from "@/modules/payment/components/actionSection.utils";

const MySwal = withReactContent(Swal);

const selectActionSectionState = (state: RootState) => {
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
    } = state.payment;

    return {
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
    };
};

const isReadyForSimulation = (
    orderType: number | null,
    paymentType: number | null,
    tax: number | null
) => orderType !== null && paymentType !== null && tax !== null;

const isReadyForSave = (
    orderType: number | null,
    paymentType: number | null,
    tax: number | null,
    kembalian: number
) => isReadyForSimulation(orderType, paymentType, tax) && kembalian >= 0;

type UseActionSectionResult = {
    type: string;
    inputNumpad: number;
    onNumpadChange: (value: string) => void;
    onPayment: () => Promise<void>;
    onVoid: () => Promise<void>;
    onSimulatePrint: () => void;
    isSubmitting: boolean;
    isVoiding: boolean;
};

export const useActionSection = (): UseActionSectionResult => {
    const ipcRenderer = electron.ipcRenderer || false;
    const dispatch = useDispatch<AppDispatch>();
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
    } = useSelector(selectActionSectionState, shallowEqual);
    const {
        kembalian,
        total,
        diskon_value,
        pajak_value,
        subtotal,
        sumSubtotalPajak,
        sumSubtotalBox,
    } = useSelector(getPaymentAllSumPrice, shallowEqual);
    const orderTypeList = useSelector(getOrderType, shallowEqual);
    const paymentTypeList = useSelector(getPaymentType, shallowEqual);

    const idempotencyKeyRef = useRef<string>(generateRandomString(32));

    const redirectToHome = useCallback(() => {
        dispatch(resetPayment());
        dispatch(resetOrder());
        router.replace("/home");
    }, [dispatch, router]);

    const showPaymentSuccessModal = useCallback(() => {
        const formattedChange = kembalian.toLocaleString("id-ID");

        MySwal.fire({
            title: '<div class="text-2xl font-bold text-gray-800">Terima Kasih! 🎉</div>',
            html: `<div class="mt-3 text-gray-700"><p>Transaksi Anda telah berhasil.</p><p class="text-xl font-semibold mt-3">Total Kembalian:<span class="block text-3xl text-green-600 font-bold mt-1">Rp ${formattedChange}</span></p></div>`,
            allowOutsideClick: false,
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oke",
            backdrop: `
                rgba(0,0,0,0.4)
                left top
                no-repeat
            `,
            customClass: {
                popup: "rounded-2xl shadow-lg p-4",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                redirectToHome();
            }
        });
    }, [kembalian, redirectToHome]);

    const showVoidSuccessModal = useCallback(() => {
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
                redirectToHome();
            }
        });
    }, [redirectToHome]);

    const showProcessingConfirmation = useCallback(async () => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Transaksi ini akan di proses",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Saya yakin",
            cancelButtonText: "Tidak",
            allowOutsideClick: false,
        });

        return result.isConfirmed;
    }, []);

    const notifyIncompletePayment = useCallback(() => {
        Toast.fire({
            icon: "warning",
            title: "Peringatan!",
            text: "Silahkan lengkapi data pembayaran",
        });
    }, []);

    const receiptIdentity = buildReceiptIdentity(outlet, ucwords(user.name));

    const saveMutation = useMutation(
        (params: SavePaymentParams) => savePayment(token, params),
        {
            retry: false,
            onSuccess: (res) => {
                if (ipcRenderer) {
                    if (changeState) {
                        ipcRenderer.send(
                            "print-reprint-with-struk",
                            receiptIdentity,
                            res.data,
                            2
                        );
                    } else {
                        ipcRenderer.send(
                            "print-reprint",
                            receiptIdentity,
                            res.data,
                            2
                        );
                    }
                }

                showPaymentSuccessModal();
            },
            onError: handleErrorAxios,
        }
    );

    const updateMutation = useMutation(
        (params: UpdatePaymentParams) => updatePayment(token, params),
        {
            onSuccess: (res) => {
                if (ipcRenderer) {
                    ipcRenderer.send(
                        "print-reprint",
                        receiptIdentity,
                        res.data,
                        2
                    );
                }

                showPaymentSuccessModal();
            },
            onError: handleErrorAxios,
        }
    );

    const voidMutation = useMutation(
        (params: VoidPaymentParams) => voidPayment(token, params),
        {
            onSuccess: (res) => {
                if (ipcRenderer) {
                    ipcRenderer.send(
                        "print-reprint",
                        receiptIdentity,
                        res.data,
                        3
                    );
                }

                showVoidSuccessModal();
            },
            onError: handleErrorAxios,
        }
    );

    const mutationLogs = useMutation((description: string) =>
        axios.post(
            "/api/transaksi/logs",
            {
                transaksi_id: id,
                type: 0,
                deskripsi: description,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
    );

    const onNumpadChange = useCallback(
        (value: string) => {
            dispatch(setInputNumpad(parseInt(value, 0)));
        },
        [dispatch]
    );

    const onPayment = useCallback(async () => {
        if (!isReadyForSave(orderType, paymentType, tax, kembalian)) {
            notifyIncompletePayment();
            return;
        }

        if (orderType === null || paymentType === null || tax === null) {
            notifyIncompletePayment();
            return;
        }

        const isConfirmed = await showProcessingConfirmation();
        if (!isConfirmed) {
            return;
        }

        const payloadBase = {
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
            details: mapPaymentDetailsPayload(orders),
        };

        if (type === "UPDATE" && id !== null) {
            updateMutation.mutate({
                id,
                ...payloadBase,
            });

            return;
        }

        if (type === "ADD") {
            saveMutation.mutate({
                key: idempotencyKeyRef.current,
                outlet_id: outlet.id,
                ...payloadBase,
            });
        }
    }, [
        orderType,
        paymentType,
        tax,
        kembalian,
        notifyIncompletePayment,
        showProcessingConfirmation,
        identity.name,
        identity.table,
        identity.no_bill,
        bayar,
        diskon,
        potongan,
        total,
        orders,
        type,
        id,
        updateMutation,
        saveMutation,
        outlet.id,
    ]);

    const onVoid = useCallback(async () => {
        if (keterangan === "") {
            Toast.fire({
                icon: "warning",
                title: "Peringatan!",
                text: "Silahkan isi keterangan void",
            });
            return;
        }

        if (!isReadyForSave(orderType, paymentType, tax, kembalian) || id === null) {
            notifyIncompletePayment();
            return;
        }

        if (orderType === null || paymentType === null || tax === null) {
            notifyIncompletePayment();
            return;
        }

        const isConfirmed = await showProcessingConfirmation();
        if (!isConfirmed) {
            return;
        }

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
            details: mapPaymentDetailsPayload(orders),
        });
    }, [
        keterangan,
        orderType,
        paymentType,
        tax,
        kembalian,
        id,
        notifyIncompletePayment,
        showProcessingConfirmation,
        voidMutation,
        identity.name,
        identity.table,
        identity.no_bill,
        bayar,
        diskon,
        potongan,
        total,
        orders,
    ]);

    const onSimulatePrint = useCallback(() => {
        if (!isReadyForSimulation(orderType, paymentType, tax) || id === null) {
            notifyIncompletePayment();
            return;
        }

        if (orderType === null || paymentType === null || tax === null) {
            notifyIncompletePayment();
            return;
        }

        if (ipcRenderer) {
            const simulateData = buildSimulateOrder({
                bayar,
                diskon,
                diskonValue: diskon_value,
                identity,
                kembalian,
                orderType,
                orderTypeList,
                orders,
                pajakValue: pajak_value,
                paymentType,
                paymentTypeList,
                potongan,
                subtotal,
                sumSubtotalBox,
                sumSubtotalPajak,
                tax,
                total,
            });

            ipcRenderer.send("print-simulate", receiptIdentity, simulateData);

            mutationLogs.mutate("[Belum Lunas][Simulasi Print] Cetak struk");
        }
    }, [
        orderType,
        paymentType,
        tax,
        id,
        notifyIncompletePayment,
        ipcRenderer,
        bayar,
        diskon,
        diskon_value,
        identity,
        kembalian,
        orderTypeList,
        orders,
        pajak_value,
        paymentTypeList,
        potongan,
        subtotal,
        sumSubtotalBox,
        sumSubtotalPajak,
        total,
        receiptIdentity,
        mutationLogs,
    ]);

    return {
        type,
        inputNumpad,
        onNumpadChange,
        onPayment,
        onVoid,
        onSimulatePrint,
        isSubmitting: updateMutation.isLoading || saveMutation.isLoading,
        isVoiding: voidMutation.isLoading,
    };
};
