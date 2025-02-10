import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/AuthContext";
import PengeluaranService, {
    PengeluaranData,
} from "../../services/PengeluaranService";
import { numberFormat } from "../../utils/currency";
import { handleErrorAxios } from "../../utils/errors";
import Toast from "../../utils/toast";
import { DynamicHeroIcon, Loading } from "../globals/icons";
import SupplierService, { SupplierData } from "../../services/SupplierService";
import Header from "./main/Header";
import { getPurchase, setRefetch } from "../../features/purchaseSlice";
import PurchaseService, { Purchase } from "../../services/purchaseService";
import { formatDate } from "../../utils/date";
import DetailModal from "./modal/DetailModal";

const STATUS = {
    0: "Draft",
    1: "Proses",
    2: "Disetujui",
    3: "Dibatalkan",
};

const Main = () => {
    const dispatch = useDispatch();
    const { token, outlet } = useAuth();
    const { date, search, refetchPurchase } = useSelector(getPurchase);

    const [data, setData] = useState<Purchase[]>([]);

    const [showDetail, setShowDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<number>();

    const { isLoading, isRefetching, refetch } = useQuery(
        ["purchase", token],
        () =>
            PurchaseService.get(token, {
                search,
                date,
            }),
        {
            refetchOnWindowFocus: false,
            onSuccess: (res) => {
                setData(res.data);
            },
            onSettled: () => {
                dispatch(setRefetch(false));
            },
        }
    );

    const deleteMutation = useMutation(
        (id: number) => PurchaseService.remove(token, id),
        {
            onSuccess: (res) => {
                Toast.fire("Berhasil!", res.message, "success");
                refetch();
            },
            onError: handleErrorAxios,
        }
    );

    const cancelMutation = useMutation(
        (id: number) => PurchaseService.cancel(token, id),
        {
            onSuccess: (res) => {
                Toast.fire("Berhasil!", res.message, "success");
                refetch();
            },
            onError: handleErrorAxios,
        }
    );

    const _onClick = (item: Purchase) => {
        Swal.fire({
            title: "Apakah Anda akan menbatalkan data ini?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Batalkan",
            cancelButtonText: "Tidak",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(item.id);
            }
        });
    };

    const _onCancel = (item: Purchase) => {
        Swal.fire({
            title: "Apakah Anda akan menbatalkan data ini?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Batalkan",
            cancelButtonText: "Tidak",
        }).then((result) => {
            if (result.isConfirmed) {
                cancelMutation.mutate(item.id);
            }
        });
    };

    const _onDetail = (item: Purchase) => {
        setSelectedId(item.id);
        setShowDetail(true);
    };

    useEffect(() => {
        refetch();
    }, [date, search]);

    useEffect(() => {
        if (refetchPurchase) {
            refetch();
        }
    }, [refetchPurchase]);

    return (
        <div className="flex-1 flex flex-col overflow-auto bg-white">
            <Header />
            {isLoading || isRefetching ? (
                <div className="flex-1 flex justify-center items-center">
                    <Loading />
                </div>
            ) : (
                <div className="h-0 ">
                    <table className="min-w-full">
                        <thead className="sticky top-[54px]">
                            <tr className="bg-gray-100">
                                <th className="text-sm font-medium py-2 px-4 w-16 text-center">
                                    Aksi
                                </th>
                                <th className="text-sm font-medium py-2 px-4 w-48 text-center">
                                    Tanggal Pembuatan
                                </th>
                                <th className="text-sm font-medium py-2 px-4 w-48 text-center">
                                    Tanggal
                                </th>
                                <th className="text-sm font-medium py-2 px-4 text-left">
                                    Supplier
                                </th>
                                <th className="text-sm font-medium py-2 px-4 w-64 text-center">
                                    status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-2 px-4 text-center"
                                    >
                                        Data Tidak Tersedia
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {data.map((item) => {
                                        return (
                                            <tr
                                                onClick={() => {
                                                    console.log("click");
                                                }}
                                                key={`supplier_${item.id}`}
                                                className="hover:bg-gray-100 border-b cursor-pointer"
                                            >
                                                <td className="text-xs font-light py-2 px-4 w-16 text-center">
                                                    {item.status == 0 ? (
                                                        <button
                                                            onClick={() =>
                                                                _onClick(item)
                                                            }
                                                            className="p-2 rounded bg-red-500"
                                                        >
                                                            <DynamicHeroIcon
                                                                icon="TrashIcon"
                                                                className="text-white"
                                                            />
                                                        </button>
                                                    ) : null}
                                                    {item.status == 1 ? (
                                                        <button
                                                            onClick={() =>
                                                                _onCancel(item)
                                                            }
                                                            className="p-2 rounded bg-red-500"
                                                        >
                                                            <DynamicHeroIcon
                                                                icon="XMarkIcon"
                                                                className="text-white"
                                                            />
                                                        </button>
                                                    ) : null}
                                                    <button
                                                        onClick={() =>
                                                            _onDetail(item)
                                                        }
                                                        className="p-2 rounded border border-gray-300"
                                                    >
                                                        <DynamicHeroIcon
                                                            icon="EyeIcon"
                                                            className="text-gray-500"
                                                        />
                                                    </button>
                                                </td>
                                                <td className="text-xs font-light py-2 px-4 w-48 text-center">
                                                    {formatDate(
                                                        item.created_at
                                                    )}
                                                </td>
                                                <td className="text-xs font-light py-2 px-4 w-48 text-center">
                                                    {formatDate(item.tanggal)}
                                                </td>
                                                <td className="text-xs font-light py-2 px-4 text-left">
                                                    {item.supplier.name}
                                                </td>
                                                <td className="text-xs font-light py-2 px-4 w-64 text-end">
                                                    {STATUS[item.status] ??
                                                        "DRAFT"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            <DetailModal
                visible={showDetail}
                onClose={() => {
                    setSelectedId(undefined);
                    setShowDetail(false);
                }}
                selectedId={selectedId}
            />
        </div>
    );
};

export default Main;
