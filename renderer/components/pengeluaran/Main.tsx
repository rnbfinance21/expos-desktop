import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { getPengeluaran, setRefetch } from "../../features/pengeluaranSlice";
import { useAuth } from "../../hooks/AuthContext";
import PengeluaranService, {
  PengeluaranData,
} from "../../services/PengeluaranService";
import { numberFormat } from "../../utils/currency";
import { Loading } from "../globals/icons";
import Header from "./main/Header";

const Main = () => {
  const dispatch = useDispatch();
  const { token, outlet } = useAuth();
  const { date, search, refetchPengeluaran } = useSelector(getPengeluaran);

  const [data, setData] = useState<PengeluaranData[]>([]);

  const { isLoading, isRefetching, refetch } = useQuery(
    ["pengeluaran", token],
    () =>
      PengeluaranService.getPengeluaran(token, {
        search,
        date,
        outlet_id: outlet.id,
      }),
    {
      onSuccess: (res) => {
        setData(res.data);
      },
      onSettled: () => {
        dispatch(setRefetch(false));
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [date, search]);

  useEffect(() => {
    if (refetchPengeluaran) {
      refetch();
    }
  }, [refetchPengeluaran]);

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
                <th className="text-sm font-medium py-2 px-4 w-48 text-center">
                  Tanggal
                </th>
                <th className="text-sm font-medium py-2 px-4 text-left">
                  Transaksi
                </th>
                <th className="text-sm font-medium py-2 px-4 text-left">
                  Keterangan
                </th>
                <th className="text-sm font-medium py-2 px-4 w-64 text-center">
                  Uang Masuk
                </th>
                <th className="text-sm font-medium py-2 px-4 w-64 text-center">
                  Uang Keluar
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-2 px-4 text-center">
                    Data Tidak Tersedia
                  </td>
                </tr>
              ) : (
                <>
                  {data.map((item) => {
                    return (
                      <tr>
                        <th className="text-xs font-light py-2 px-4 w-48 text-center">
                          {item.date}
                        </th>
                        <th className="text-xs font-light py-2 px-4 text-left">
                          {item.transaksi}
                        </th>
                        <th className="text-xs font-light py-2 px-4 text-left">
                          {item.description ?? "-"}
                        </th>
                        <th className="text-xs font-light py-2 px-4 w-64 text-end">
                          <div className="flex flex-row">
                            <span>Rp</span>
                            <span className="flex-1">
                              {numberFormat(
                                item.type === 1 ? item.amount : 0,
                                0
                              )}
                            </span>
                          </div>
                        </th>
                        <th className="text-xs font-light py-2 px-4 w-64 text-end">
                          <div className="flex flex-row">
                            <span>Rp</span>
                            <span className="flex-1">
                              {numberFormat(
                                item.type === 2 ? item.amount : 0,
                                0
                              )}
                            </span>
                          </div>
                        </th>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
            <tfoot className="sticky bottom-0">
              <tr>
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
                        data
                          .filter((e) => e.type === 1)
                          .reduce((acc, item) => {
                            return acc + item.amount;
                          }, 0),
                        0
                      )}
                    </span>
                  </div>
                </th>
                <th className="text-sm font-medium py-2 px-4 text-end">
                  <div className="flex flex-row">
                    <span>Rp</span>
                    <span className="flex-1">
                      {numberFormat(
                        data
                          .filter((e) => e.type === 2)
                          .reduce((acc, item) => {
                            return acc + item.amount;
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
