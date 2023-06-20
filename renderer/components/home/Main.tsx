import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Shimmer } from "react-shimmer";
import {
  getListOrder,
  setRefetchOrder,
  setSelectedOrder,
} from "../../features/listOrderSlice";
import { useAuth } from "../../hooks/AuthContext";
import OrderService, { Order, OrderDetail } from "../../services/OrderService";
import { DynamicHeroIcon, Loading } from "../globals/icons";
import Header from "./Header";
import OrderItem from "./OrderItem";
import { AxiosError } from "axios";
import { BaseResponse } from "../../services/types";

const EmptyItem = () => {
  return (
    <div className="flex-1 flex justify-center items-center">
      <p className="text-sm font-bold">Tidak ada pesanan masuk</p>
    </div>
  );
};

const OrderItemShimmer = () => {
  return (
    <>
      {[...Array(10)].map((v, i) => {
        return (
          <div
            key={`order_item_shimmer_${i}`}
            className="flex flex-col w-full p-4 border-b justify-between gap-4"
          >
            <div className="flex-1 flex flex-row gap-4 items-center">
              <Shimmer width={44} height={44} />
              <div className="flex flex-col justify-end h-full">
                <div className="flex flex-row items-center gap-2 mb-1">
                  <Shimmer width={300} height={30} />
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <Shimmer width={100} height={10} />
                  <div className="h-[6px] w-[6px] rounded-full bg-gray-300" />
                  <Shimmer width={100} height={10} />
                  <div className="h-[6px] w-[6px] rounded-full bg-gray-300" />
                  <Shimmer width={100} height={10} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

const Main = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const { date, status, search, refetchOrder, selectedOrder } =
    useSelector(getListOrder);

  const [data, setData] = useState<OrderDetail[]>([]);

  const {
    status: statusQuery,
    refetch,
    isRefetching,
  } = useQuery(
    ["orders", token],
    () =>
      OrderService.getOrderOutletNew(token, {
        search,
        status,
        date,
      }),
    {
      enabled: token !== null && token !== "" ? true : false,
      onSuccess: (res) => {
        setData(res.data);
      },
      onSettled: () => {
        dispatch(setRefetchOrder(false));
      },
      // refetchInterval: 18000, // refetch every 5 minutes
      refetchOnWindowFocus: true,
      retry: 3,
    }
  );

  // const _onSelectedItem = (id: number | null) => dispatch(setSelectedOrder(id));

  useEffect(() => {
    if (token !== null && token !== "") {
      refetch();
    }
  }, [date, status, search, token]);

  useEffect(() => {
    if (refetchOrder && token !== null && token !== "") {
      refetch();
    }
  }, [refetchOrder]);

  // useEffect(() => {
  //   _onSelectedItem(null);
  // }, []);

  return (
    <div className="flex-1 flex flex-row bg-gray-100">
      <div className="flex-1 flex flex-col overflow-auto bg-white">
        <Header />
        {statusQuery === "loading" || isRefetching ? (
          <div className="flex-1 flex justify-center items-center">
            <Loading />
          </div>
        ) : statusQuery === "error" ? (
          <div className="flex-1 flex justify-center items-center">
            <button
              onClick={() => refetch()}
              className="py-2 px-4 border border-gray-300 rounded flex flex-row justify-center items-center"
            >
              <DynamicHeroIcon icon="ArrowPathIcon" /> Coba Lagi
            </button>
          </div>
        ) : (
          <>
            {data.length === 0 ? (
              <EmptyItem />
            ) : (
              <div className="h-0">
                {data.map((item) => {
                  return (
                    <OrderItem
                      key={`order_item_${item.id}`}
                      data={item}
                      onClick={() => {}}
                      selected={selectedOrder === item.id}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Main;
