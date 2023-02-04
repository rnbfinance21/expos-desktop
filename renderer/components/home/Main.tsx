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
import OrderService, { Order } from "../../services/OrderService";
import { Loading } from "../globals/icons";
import Header from "./Header";
import OrderItem from "./OrderItem";

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

  const [data, setData] = useState<Order[]>([]);

  const { isLoading, isRefetching, refetch } = useQuery(
    ["orders", token],
    () =>
      OrderService.getOrderOutlet(token, {
        search,
        status,
        date,
      }),
    {
      onSuccess: (res) => {
        setData(res.data);
      },
      onSettled: () => {
        dispatch(setRefetchOrder(false));
      },
      refetchInterval: 30000,
    }
  );

  const _onSelectedItem = (id: number) => dispatch(setSelectedOrder(id));

  useEffect(() => {
    refetch();
  }, [date, status, search]);

  useEffect(() => {
    if (refetchOrder) {
      refetch();
    }
  }, [refetchOrder]);

  return (
    <div className="flex-1 flex flex-row bg-gray-100">
      <div className="flex-1 flex flex-col overflow-auto bg-white">
        <Header />
        {isLoading || isRefetching ? (
          <div className="flex-1 flex justify-center items-center">
            <Loading />
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
                      onClick={() => _onSelectedItem(item.id)}
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
