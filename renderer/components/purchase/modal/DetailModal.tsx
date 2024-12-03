import React, { FC, useEffect } from "react";
import MyModal from "../../globals/modal/MyModal";
import { useQuery } from "react-query";
import PurchaseService from "../../../services/purchaseService";
import { useAuth } from "../../../hooks/AuthContext";
import { formatDate, formatFullDate } from "../../../utils/date";

type Props = {
    visible: boolean;
    selectedId?: number;
    onClose?: () => void;
};

const DetailModal: FC<Props> = ({
    selectedId,
    visible,
    onClose = () => {},
}) => {
    const { token } = useAuth();

    const { data, refetch } = useQuery(
        "fetchDetailPurchase",
        () => PurchaseService.detail(token, selectedId),
        {
            refetchOnWindowFocus: false,
        }
    );

    useEffect(() => {
        if (selectedId) {
            refetch();
        }
    }, [selectedId]);

    return (
        <MyModal title="Supplier" show={visible} onClose={onClose}>
            <div className="mt-6">
                <div className="grid grid-cols-3 mb-4">
                    <div className="col-span-1">
                        <p>Nama Supplier</p>
                    </div>
                    <div className="col-span-2">
                        <p>: {data?.data.supplier.name ?? "-"}</p>
                    </div>
                    <div className="col-span-1">
                        <p>Tanggal Pembuatan</p>
                    </div>
                    <div className="col-span-2">
                        <p>
                            :{" "}
                            {data?.data.created_at
                                ? formatFullDate(data.data.created_at)
                                : "-"}
                        </p>
                    </div>
                    <div className="col-span-1">
                        <p>Tanggal Pengajuan</p>
                    </div>
                    <div className="col-span-2">
                        <p>
                            :{" "}
                            {data?.data.tanggal
                                ? formatDate(data.data.tanggal)
                                : "-"}
                        </p>
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
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data?.details?.length != 0 ? (
                            <>
                                {data?.data?.details.map((item, index) => {
                                    return (
                                        <tr>
                                            <td className="text-sm font-light py-2 px-4 w-[25px] text-center">
                                                {index + 1}
                                            </td>
                                            <td className="text-sm font-light py-2 px-4 w-48 text-center">
                                                {item.nama_barang}
                                            </td>
                                            <td className="text-sm font-light py-2 px-4 w-48 text-center">
                                                {item.qty}
                                            </td>
                                            <td className="text-sm font-light py-2 px-4 w-48 text-center">
                                                {item.unit}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </>
                        ) : (
                            <tr>
                                <td colSpan={4}> Data Tidak Tersedia</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </MyModal>
    );
};

export default DetailModal;
