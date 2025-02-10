/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { useAuth } from "../../../hooks/AuthContext";
import { handleErrorAxios } from "../../../utils/errors";
import Toast from "../../../utils/toast";
import { Button } from "../../globals/buttons";
import { ErrorLabel } from "../../globals/labels";
import MyModal from "../../globals/modal/MyModal";
import ButtonAttributes from "../../payment/ButtonAttributes";
import SupplierService, {
    SaveSupplierParams,
    SupplierName,
} from "../../../services/SupplierService";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { DynamicHeroIcon } from "../../globals/icons";
import { formatDate } from "../../../utils/date";
import PurchaseService, {
    CreatePurchaseParams,
} from "../../../services/purchaseService";

interface FormModalProps {
    visible: boolean;
    formType: number;
    onClose: () => void;
    onSuccess: () => void;
}

type FormData = {
    supplier_id: number;
    tanggal: string;
};

const schema = yup.object({
    supplier_id: yup.number().required("Pilih Supplier"),
    tanggal: yup.string().required("Pilih Tanggal"),
});

const FormModal = ({
    visible,
    onClose,
    formType,
    onSuccess,
}: FormModalProps) => {
    const { token, outlet } = useAuth();

    const [supplierData, setSupplierData] = useState<
        {
            label: string;
            value: number;
        }[]
    >([]);

    const [tanggal, setTanggal] = useState(new Date());

    const [rows, setRows] = useState([
        { id: 1, namaBarang: "", qty: 0, keterangan: "" },
    ]);

    // Tambahkan baris baru
    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            namaBarang: "",
            qty: 0,
            keterangan: "",
        };
        setRows([...rows, newRow]);
    };

    // Hapus baris
    const deleteRow = (id) => {
        setRows(rows.filter((row) => row.id !== id));
    };

    // Update nilai input
    const handleInputChange = (id, field, value) => {
        const updatedRows = rows.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
        );
        setRows(updatedRows);
    };

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            tanggal: formatDate(new Date()),
        },
    });

    const fetchSupplier = useQuery(
        "fetchSupplier",
        () => SupplierService.getSupplier(token),
        {
            refetchOnWindowFocus: false,
            onSuccess: (res) => {
                setSupplierData(
                    res.data.map((e) => {
                        return {
                            label: e.name,
                            value: e.id,
                        };
                    })
                );
            },
        }
    );

    const mutation = useMutation(
        (params: CreatePurchaseParams) => PurchaseService.create(token, params),
        {
            onSuccess: (res) => {
                Toast.fire("Berhasil!", res.message, "success");
                onSuccess();
            },
            onError: handleErrorAxios,
        }
    );

    const onSubmit = (data: FormData) => {
        mutation.mutate({
            supplier_id: data.supplier_id,
            tanggal: formatDate(data.tanggal),
            items: rows.map((item) => {
                return {
                    nama_barang: item.namaBarang,
                    qty: item.qty,
                    unit: item.keterangan,
                };
            }),
        });
    };

    useEffect(() => {
        if (!visible) {
            setRows([{ id: 1, namaBarang: "", qty: 0, keterangan: "" }]);
            reset();
        } else {
            fetchSupplier.refetch();
        }
    }, [visible]);

    return (
        <MyModal title="Supplier" show={visible} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 w-full">
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="mb-4">
                        <label
                            htmlFor="supplier_id"
                            className="block text-sm font-light mb-2"
                        >
                            Supplier
                        </label>
                        <Controller
                            control={control}
                            name="supplier_id"
                            render={({ field }) => {
                                return (
                                    <Select
                                        id="supplier_id"
                                        placeholder="Pilih Supplier"
                                        options={supplierData}
                                        isSearchable={false}
                                        onChange={(e) =>
                                            field.onChange(e.value)
                                        }
                                        value={supplierData.find(
                                            (e) => e.value === field.value
                                        )}
                                    />
                                );
                            }}
                        />
                        {errors.supplier_id ? (
                            <ErrorLabel
                                text={errors.supplier_id.message ?? ""}
                            />
                        ) : null}
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="supplier_id"
                            className="block text-sm font-light mb-2"
                        >
                            Tanggal
                        </label>
                        <Controller
                            control={control}
                            name="tanggal"
                            render={({ field }) => {
                                return (
                                    <div className="relative">
                                        <DatePicker
                                            selected={tanggal}
                                            onChange={(date) => {
                                                if (date !== null) {
                                                    setTanggal(date);
                                                    field.onChange(date);
                                                }
                                            }}
                                            dateFormat="yyyy-MM-dd"
                                            className="text-sm rounded-lg border border-gray-300 font-medium w-full focus:ring-0 focus:border-gray-300"
                                            minDate={new Date()}
                                        />
                                        <div className="absolute top-3 right-3">
                                            <DynamicHeroIcon icon="CalendarIcon" />
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        {errors.tanggal ? (
                            <ErrorLabel text={errors.tanggal.message ?? ""} />
                        ) : null}
                    </div>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="text-sm font-medium py-2 px-4 w-[25px] text-center">
                                No
                            </th>
                            <th className="text-sm font-medium py-2 px-4 text-center">
                                Nama Barang
                            </th>
                            <th className="text-sm font-medium py-2 px-4 text-center">
                                Qty
                            </th>
                            <th className="text-sm font-medium py-2 px-4 text-center">
                                Keterangan
                            </th>
                            <th className="text-sm font-medium py-2 px-4 text-center">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={row.id}>
                                <td className="text-center">{index + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.namaBarang}
                                        onChange={(e) =>
                                            handleInputChange(
                                                row.id,
                                                "namaBarang",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Nama Barang"
                                        className="flex-1 block w-full text-left focus:ring-red-500 focus:border-red-500 min-w-0 rounded-md sm:text-base border-gray-200"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.qty}
                                        onChange={(e) =>
                                            handleInputChange(
                                                row.id,
                                                "qty",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Qty"
                                        className="flex-1 block w-full text-left focus:ring-red-500 focus:border-red-500 min-w-0 rounded-md sm:text-base border-gray-200"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.keterangan}
                                        onChange={(e) =>
                                            handleInputChange(
                                                row.id,
                                                "keterangan",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Keterangan"
                                        className="flex-1 block w-full text-left focus:ring-red-500 focus:border-red-500 min-w-0 rounded-md sm:text-base border-gray-200"
                                    />
                                </td>
                                <td className="text-center">
                                    <button
                                        onClick={() => deleteRow(row.id)}
                                        className="p-2 rounded bg-red-500"
                                    >
                                        <DynamicHeroIcon
                                            icon="TrashIcon"
                                            className="text-white"
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={5}>
                                <Button
                                    type="button"
                                    onClick={addRow}
                                    style={{ marginTop: "10px" }}
                                >
                                    Tambah Data
                                </Button>
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <div className="grid grid-cols-1 gap-4 mt-8">
                    <Button
                        type="submit"
                        className="text-xs"
                        blok
                        isLoading={mutation.isLoading}
                        disabled={mutation.isLoading}
                    >
                        Simpan
                    </Button>
                </div>
            </form>
        </MyModal>
    );
};

export default FormModal;
