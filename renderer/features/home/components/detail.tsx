import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { getListOrder } from "@/features/listOrderSlice";
import { useAuth } from "@/hooks/AuthContext";
import { getHomeTransactionDetail } from "@/features/home/api";
import { ucwords } from "@/utils/string";
import { DynamicHeroIcon, Loading } from "@/components/globals/icons";
import PaidAction from "@/features/home/components/details/actions/paid-action";
import PendingAction from "@/features/home/components/details/actions/pending-action";
import ProsesAction from "@/features/home/components/details/actions/proses-action";
import DetailItem from "@/features/home/components/details/detail-item";
import InfoItem from "@/features/home/components/details/info-item";

const Detail = () => {
  const { token } = useAuth();
  const { selectedOrder } = useSelector(getListOrder);

  const {
    data,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useQuery(
    ["home_transaction_detail", token, selectedOrder],
    () => getHomeTransactionDetail(selectedOrder as number),
    {
      enabled: token !== null && token !== "" && !!selectedOrder,
      refetchOnWindowFocus: false,
      retry: 3,
    }
  );

  const selectedData = data?.data;

  return (
    <Transition as={Fragment} show>
      <div className="w-[400px] h-full bg-white border-l flex flex-col">
        {selectedOrder ? (
          <>
            {isLoading || isRefetching ? (
              <div className="w-full h-full flex justify-center items-center">
                <Loading />
              </div>
            ) : isError ? (
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
                  <div className="space-y-2 pb-4 border-b border-gray-300 border-dashed">
                    <InfoItem
                      title="Kode Transaksi"
                      value={`#${selectedData?.kode_transaksi}`}
                    />
                    <InfoItem
                      title="Nama"
                      value={ucwords(selectedData?.name ?? "")}
                    />
                    <InfoItem title="Nomor Meja" value={selectedData?.table} />
                    <InfoItem title="Tanggal" value={selectedData?.date} />
                    <InfoItem title="Status" value={selectedData?.status_text} />
                    {selectedData?.status === -1 ? (
                      <InfoItem col title="Alasan" value={selectedData?.reason} />
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
                    return <DetailItem key={`detail_item_menu_${item.id}`} data={item} />;
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
  );
};

export default Detail;
