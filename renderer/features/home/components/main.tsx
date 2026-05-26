import React, { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  getListOrder,
  setRefetchOrder,
  setSelectedOrder,
} from "@/features/listOrderSlice";
import { useAuth } from "@/hooks/AuthContext";
import { getHomeTransactionList } from "@/features/home/api";
import {
  GetOrderOutletPaginateParams,
  OrderPaginate,
} from "@/modules/order/type";
import { DynamicHeroIcon, Loading } from "@/components/globals/icons";
import Header from "@/features/home/components/header";
import OrderItem from "@/features/home/components/order-item";

const EmptyItem = () => {
  return (
    <div className="flex-1 flex justify-center items-center">
      <p className="text-sm font-bold">Tidak ada pesanan masuk</p>
    </div>
  );
};

const Main = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const { token } = useAuth();
  const { date, status, search, refetchOrder, selectedOrder } =
    useSelector(getListOrder);

  const queryEnabled = token !== null && token !== "";

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteQuery(
    ["home_transactions", token, date, status, search],
    ({ pageParam = 1 }) => {
      const params: GetOrderOutletPaginateParams = {
        date,
        status,
        search,
        page: pageParam,
      };

      return getHomeTransactionList(params);
    },
    {
      enabled: queryEnabled,
      getNextPageParam: (lastPage) => {
        if (!lastPage.pagination) {
          return undefined;
        }

        const { page, pageTotal } = lastPage.pagination;
        return page >= pageTotal ? undefined : page + 1;
      },
      refetchOnWindowFocus: false,
      retry: 3,
    }
  );

  const transactions = useMemo<OrderPaginate[]>(() => {
    if (!data) {
      return [];
    }

    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const onSelectedItem = (id: number) => dispatch(setSelectedOrder(id));

  useEffect(() => {
    if (queryEnabled && refetchOrder) {
      refetch().finally(() => {
        dispatch(setRefetchOrder(false));
      });
    }
  }, [dispatch, queryEnabled, refetchOrder, refetch]);

  return (
    <div className="flex-1 flex flex-row bg-gray-100">
      <div
        ref={ref}
        onScroll={() => {
          const container = ref.current;

          if (!container || !hasNextPage || isFetchingNextPage) {
            return;
          }

          const { scrollTop, scrollHeight, clientHeight } = container;
          if (scrollTop + clientHeight >= scrollHeight - 20) {
            fetchNextPage();
          }
        }}
        className="flex-1 flex flex-col overflow-auto bg-white"
      >
        <Header />
        {isLoading || (isRefetching && !isFetchingNextPage) ? (
          <div className="flex-1 flex justify-center items-center">
            <Loading />
          </div>
        ) : isError ? (
          <div className="flex-1 flex justify-center items-center">
            <button
              onClick={() => refetch()}
              className="py-2 px-4 border border-gray-300 rounded flex flex-row justify-center items-center"
            >
              <DynamicHeroIcon icon="ArrowPathIcon" /> Coba Lagi
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <EmptyItem />
        ) : (
          <div className="h-0">
            {transactions.map((item) => {
              return (
                <OrderItem
                  key={`order_item_${item.id}`}
                  data={item}
                  onClick={() => onSelectedItem(item.id)}
                  selected={selectedOrder === item.id}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
