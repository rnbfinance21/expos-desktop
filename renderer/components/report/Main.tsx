import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { getReport, setRefetch } from "../../features/reportSlice";
import { useAuth } from "../../hooks/AuthContext";
import OrderService, { Order } from "../../services/OrderService";
import { numberFormat } from "../../utils/currency";
import { ucwords } from "../../utils/string";
import { Loading } from "../globals/icons";
import Header from "./main/Header";

const Main = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const { date, search, refetchReport } = useSelector(getReport);

  const [data, setData] = useState<Order[]>([]);

  const { isLoading, isRefetching, refetch } = useQuery(
    ["reports", token],
    () =>
      OrderService.getOrderOutlet(token, {
        search,
        status: 2,
        date,
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
    if (refetchReport) {
      refetch();
    }
  }, [refetchReport]);

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
              <tr>
                <th className="text-sm font-medium bg-gray-100 py-2 px-4 w-48 text-left">
                  Kode Transaksi
                </th>
                <th className="text-sm font-medium bg-gray-100 py-2 px-4 w-32 text-left">
                  Nama
                </th>
                <th className="text-sm font-medium bg-gray-100 py-2 px-4 w-44 text-center">
                  Jenis Order
                </th>
                <th className="text-sm font-medium bg-gray-100 py-2 px-4 w-44 text-center">
                  Jenis Pembayaran
                </th>
                <th className="text-sm font-medium bg-gray-100 py-2 px-4 text-end">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                return (
                  <tr className="border-b">
                    <td className="text-xs font-medium py-2 px-4">
                      {item.kode_transaksi}
                    </td>
                    <td className="text-xs font-medium py-2 px-4">
                      {ucwords(item.name)}
                    </td>
                    <td className="text-xs font-medium py-2 px-4 text-center">
                      {item.kategori_order_name}
                    </td>
                    <td className="text-xs font-medium py-2 px-4 text-center">
                      {item.kategori_payment_name}
                    </td>
                    <td className="text-xs font-medium py-2 px-4 text-end flex flex-row">
                      <span>Rp</span>
                      <span className="flex-1">
                        {numberFormat(item.total, 0)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Main;
