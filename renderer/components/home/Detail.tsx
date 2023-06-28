import { Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { getListOrder, setSelectedOrder } from "../../features/listOrderSlice";
import { useAuth } from "../../hooks/AuthContext";
import OrderService, { OrderDetail } from "../../services/OrderService";
import { numberFormat } from "../../utils/currency";
import { ucwords } from "../../utils/string";
import { DynamicHeroIcon, Loading } from "../globals/icons";
import PaidAction from "./details/actions/PaidAction";
import PendingAction from "./details/actions/PendingAction";
import ProsesAction from "./details/actions/ProsesAction";
import DetailItem from "./details/DetailItem";
import InfoItem from "./details/InfoItem";
import DetailActionButton from "../form/details/DetailActionButton";
import { twMerge } from "tailwind-merge";

const Detail = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const { selectedOrder } = useSelector(getListOrder);

  const [selectedData, setSelectedData] = useState<OrderDetail>();

  const { isRefetching, refetch, status } = useQuery(
    ["orderDetail", token],
    () => OrderService.getOrderDetail(token, selectedOrder),
    {
      enabled: false,
      onSuccess: (res) => {
        setSelectedData(res.data);
      },
      refetchOnWindowFocus: false,
      retry: 3,
    }
  );

  useEffect(() => {
    if (selectedOrder && selectedOrder !== null) {
      refetch();
    }
  }, [selectedOrder]);

  // useEffect(() => {
  //   if (selectedOrder) {
  //     refetch();
  //   }
  // }, [refetchOrder]);

  return (
    <>
      <Transition as={Fragment} show={true}>
        <div className="w-[400px] h-full bg-white border-l flex flex-col">
          {selectedOrder && selectedOrder !== null ? (
            <>
              {status === "loading" || isRefetching ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Loading />
                </div>
              ) : status === "error" ? (
                <div className="w-full h-full flex justify-center items-center">
                  <div className="flex flex-col space-y-2">
                    <span className="font-medium text-sm text-gray-900">
                      Gagal Memuat Data
                    </span>
                    <button
                      onClick={() => refetch()}
                      className="flex flex-row border py-2 px-2 text-xs gap-2 rounded-md justify-center"
                    >
                      <DynamicHeroIcon icon="ArrowPathIcon" />
                      Perbarui
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full w-full overflow-auto scroll-smooth scrollbar-hide">
                  <div className="p-4 border-b sticky top-0 bg-white space-y-2">
                    {/* <button
                      onClick={() => dispatch(setSelectedOrder(null))}
                      className="p-1 bg-red-500 text-xs text-white font-bold rounded-full"
                    >
                      <DynamicHeroIcon
                        icon="XMarkIcon"
                        className="text-white"
                      />
                    </button> */}
                    <div className="space-y-2 pb-4 border-b border-gray-300 border-dashed">
                      <InfoItem
                        title="Kode Transaksi"
                        value={`#${selectedData?.kode_transaksi}`}
                      />
                      <InfoItem
                        title="Nama"
                        value={ucwords(selectedData?.name ?? "")}
                      />
                      <InfoItem
                        title="Nomor Meja"
                        value={selectedData?.table}
                      />
                      <InfoItem title="Tanggal" value={selectedData?.date} />
                      <InfoItem
                        title="Status"
                        value={selectedData?.status_text}
                      />
                      {selectedData?.status === -1 ? (
                        <InfoItem
                          col
                          title="Alasan"
                          value={selectedData?.reason}
                        />
                      ) : null}
                    </div>
                    {selectedData?.status === 0 ? (
                      <PendingAction data={selectedData} />
                    ) : selectedData?.status === 1 ? (
                      <ProsesAction data={selectedData} />
                    ) : selectedData?.status === 2 ? (
                      <PaidAction data={selectedData} />
                    ) : null}
                  </div>
                  <div className="px-4 h-0">
                    {selectedData?.details.map((item) => {
                      return (
                        <DetailItem
                          key={`detail_item_menu_${item.id}`}
                          data={item}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-row justify-center items-center">
              <p className="text-sm font-bold text-gray-900">
                Pilih / klik Transaksi disamping
              </p>
            </div>
          )}
        </div>
      </Transition>
    </>
  );
};

export default Detail;
