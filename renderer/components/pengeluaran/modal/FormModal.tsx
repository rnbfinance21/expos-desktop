/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import React, { useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as yup from "yup";
import { useAuth } from "../../../hooks/AuthContext";
import PengeluaranService, {
    SavePengeluaranParams,
} from "../../../services/PengeluaranService";
import { handleErrorAxios } from "../../../utils/errors";
import Toast from "../../../utils/toast";
import { Button } from "../../globals/buttons";
import { TextInput } from "../../globals/forms";
import { ErrorLabel } from "../../globals/labels";
import MyModal from "../../globals/modal/MyModal";
import ButtonAttributes from "../../payment/ButtonAttributes";

interface FormModalProps {
    visible: boolean;
    formType: number;
    onClose: () => void;
    onSuccess: () => void;
}

type FormData = {
    transaksi: string;
    amount: string;
    qty: string;
    price: string;
    satuan: string;
    description: string;
    type_transaction: number;
};

const schema = yup.object({
    transaksi: yup.string().required("Masukkan nama transaksi"),
    amount: yup.string().required("Masukkan total transaksi"),
    type_transaction: yup.number().required("Pilih tipe transaksi"),
    description: yup.string().required("Masukkan keterangan"),
    qty: yup.string().required("Masukan jumlah barang"),
    price: yup.string().required("Masukan harga barang"),
    satuan: yup.string().required("Masukan satuan barang"),
});

const FormModal = ({
    visible,
    onClose,
    formType,
    onSuccess,
}: FormModalProps) => {
    const { token, outlet } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            type_transaction: 1,
        },
    });

    const pengeluaranMutation = useMutation(
        (params: SavePengeluaranParams) =>
            PengeluaranService.savePengeluaran(token, params),
        {
            onSuccess: (res) => {
                Toast.fire("Berhasil!", res.message, "success");
                onSuccess();
            },
            onError: handleErrorAxios,
        }
    );

    const onSubmit = (data: FormData) => {
        pengeluaranMutation.mutate({
            outlet_id: outlet.id,
            transaksi: data.transaksi,
            amount: data.amount,
            qty: data.qty,
            price: data.price,
            satuan: data.satuan,
            description: data.description,
            type: formType,
            type_transaction: data.type_transaction,
        });
    };

    useEffect(() => {
        if (!visible) {
            reset();
        }
    }, [visible]);

    return (
        <MyModal
            title={formType === 1 ? "Uang Masuk" : "Uang Keluar"}
            show={visible}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col mb-4">
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-sm font-light mb-2"
                        >
                            Transaksi
                        </label>
                        <TextInput
                            id="transaksi"
                            type="text"
                            placeholder="Masukkan transaksi"
                            {...register("transaksi")}
                        />
                        {errors.transaksi ? (
                            <ErrorLabel text={errors.transaksi.message ?? ""} />
                        ) : null}
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-sm font-light mb-2"
                        >
                            Tipe Pengeluaran
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <ButtonAttributes
                                label="Food"
                                isSelected={
                                    watch("type_transaction") === 1
                                        ? true
                                        : false
                                }
                                onClick={() => setValue("type_transaction", 1)}
                            />
                            <ButtonAttributes
                                label="Non Food"
                                isSelected={
                                    watch("type_transaction") === 2
                                        ? true
                                        : false
                                }
                                onClick={() => setValue("type_transaction", 2)}
                            />
                        </div>
                        {errors.type_transaction ? (
                            <ErrorLabel
                                text={errors.type_transaction.message ?? ""}
                            />
                        ) : null}
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-sm font-light mb-2"
                        >
                            Keterangan
                        </label>
                        <textarea
                            cols={50}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                            placeholder="Masukkan Keterangan"
                            {...register("description")}
                        />
                        {errors.description ? (
                            <ErrorLabel
                                text={errors.description.message ?? ""}
                            />
                        ) : null}
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="block text-sm font-light mb-2"
                            >
                                Quantity
                            </label>
                            <CurrencyInput
                                allowDecimals={false}
                                // defaultValue={0}
                                decimalSeparator=","
                                groupSeparator="."
                                placeholder="Quantity"
                                className="flex-1 block w-full text-left focus:ring-red-500 focus:border-red-500 min-w-0 rounded-md sm:text-base border-gray-200"
                                {...register("qty")}
                            />
                            {errors.qty ? (
                                <ErrorLabel
                                    className="ml-0"
                                    text={errors.qty.message ?? ""}
                                />
                            ) : null}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="satuan"
                                className="block text-sm font-light mb-2"
                            >
                                Satuan
                            </label>
                            <TextInput
                                id="satuan"
                                type="text"
                                placeholder="Masukkan satuan"
                                className="py-[10px]"
                                {...register("satuan")}
                            />
                            {errors.satuan ? (
                                <ErrorLabel
                                    className="ml-0"
                                    text={errors.satuan.message ?? ""}
                                />
                            ) : null}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="block text-sm font-light mb-2"
                            >
                                Harga Satuan
                            </label>
                            <CurrencyInput
                                allowDecimals={false}
                                // defaultValue={0}
                                decimalSeparator=","
                                groupSeparator="."
                                placeholder="Harga Satuan"
                                className="flex-1 block w-full text-left focus:ring-red-500 focus:border-red-500 min-w-0 rounded-md sm:text-base border-gray-200"
                                {...register("price")}
                            />
                            {errors.price ? (
                                <ErrorLabel
                                    className="ml-0"
                                    text={errors.price.message ?? ""}
                                />
                            ) : null}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="block text-sm font-light mb-2"
                            >
                                Total
                            </label>
                            <CurrencyInput
                                allowDecimals={false}
                                // defaultValue={0}
                                decimalSeparator=","
                                groupSeparator="."
                                placeholder="Jumlah"
                                className="flex-1 block w-full text-left focus:ring-red-500 focus:border-red-500 min-w-0 rounded-md sm:text-base border-gray-200"
                                {...register("amount")}
                            />
                            {errors.amount ? (
                                <ErrorLabel
                                    className="ml-0"
                                    text={errors.amount.message ?? ""}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <Button
                        type="submit"
                        className="text-xs"
                        blok
                        isLoading={pengeluaranMutation.isLoading}
                        disabled={pengeluaranMutation.isLoading}
                    >
                        Simpan
                    </Button>
                </div>
            </form>
        </MyModal>
    );
};

export default FormModal;
