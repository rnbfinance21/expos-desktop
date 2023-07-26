import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getSupplier, setRefetch } from "../../features/supplierSlice";
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

const Main = () => {
  const dispatch = useDispatch();
  const { token, outlet } = useAuth();
  const { date, search, refetchSupplier } = useSelector(getSupplier);

  const [data, setData] = useState<SupplierData[]>([]);

  const { isLoading, isRefetching, refetch } = useQuery(
    ["pengeluaran", token],
    () =>
      SupplierService.get(token, {
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
    (id: number) => SupplierService.deleteSupplier(token, id),
    {
      onSuccess: (res) => {
        Toast.fire("Berhasil!", res.message, "success");
        refetch();
      },
      onError: handleErrorAxios,
    }
  );

  const _onClick = (item: SupplierData) => {
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

  useEffect(() => {
    refetch();
  }, [date, search]);

  useEffect(() => {
    if (refetchSupplier) {
      refetch();
    }
  }, [refetchSupplier]);

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
                  Tanggal
                </th>
                <th className="text-sm font-medium py-2 px-4 text-left">
                  Supplier
                </th>
                <th className="text-sm font-medium py-2 px-4 w-64 text-center">
                  Jumlah
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-2 px-4 text-center">
                    Data Tidak Tersedia
                  </td>
                </tr>
              ) : (
                <>
                  {data.map((item) => {
                    return (
                      <tr
                        key={`supplier_${item.id}`}
                        className="hover:bg-gray-100 border-b"
                      >
                        <td className="text-xs font-light py-2 px-4 w-16 text-center">
                          <button
                            onClick={() => _onClick(item)}
                            className="p-2 rounded bg-red-500"
                          >
                            <DynamicHeroIcon
                              icon="TrashIcon"
                              className="text-white"
                            />
                          </button>
                        </td>
                        <td className="text-xs font-light py-2 px-4 w-48 text-center">
                          {item.tanggal}
                        </td>
                        <td className="text-xs font-light py-2 px-4 text-left">
                          {item.supplier_name}
                        </td>
                        <td className="text-xs font-light py-2 px-4 w-64 text-end">
                          <div className="flex flex-row">
                            <span>Rp</span>
                            <span className="flex-1">
                              {numberFormat(item.jumlah, 0)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
            <tfoot className="sticky bottom-0">
              <tr className="border-b">
                <th
                  colSpan={3}
                  className="text-sm font-medium py-2 px-4 w-48 text-end"
                >
                  Total
                </th>
                <th className="text-sm font-medium py-2 px-4 text-end">
                  <div className="flex flex-row">
                    <span>Rp</span>
                    <span className="flex-1">
                      {numberFormat(
                        data.reduce((acc, item) => {
                          return acc + item.jumlah;
                        }, 0),
                        0
                      )}
                    </span>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default Main;
