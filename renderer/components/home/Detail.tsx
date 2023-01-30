import { Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { getListOrder } from "../../features/listOrderSlice";
import { useAuth } from "../../hooks/AuthContext";
import OrderService, { OrderDetail } from "../../services/OrderService";
import { numberFormat } from "../../utils/currency";
import { ucwords } from "../../utils/string";
import { Loading } from "../globals/icons";
import ButtonAction from "./details/ButtonAction";
import DetailItem from "./details/DetailItem";
import InfoItem from "./details/InfoItem";

const Detail = () => {
  const { token } = useAuth();
  const { selectedOrder } = useSelector(getListOrder);

  const [selectedData, setSelectedData] = useState<OrderDetail>();

  const { isLoading, isRefetching, refetch } = useQuery(
    ["orderDetail", token],
    () => OrderService.getOrderDetail(token, selectedOrder),
    {
      enabled: false,
      onSuccess: (res) => {
        setSelectedData(res.data);
      },
    }
  );

  useEffect(() => {
    if (selectedOrder !== null) {
      refetch();
    }
  }, [selectedOrder]);

  return (
    <Transition as={Fragment} show={selectedOrder !== null ? true : false}>
      <div className="w-[400px] h-full bg-white border-l">
        {isLoading || isRefetching ? (
          <div className="w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <div className="h-full w-full overflow-auto scroll-smooth scrollbar-hide">
            <div className="p-4 border-b sticky top-0 bg-white space-y-2">
              <div className="space-y-2">
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
              <ButtonAction data={selectedData} />
            </div>
            <div className="px-4 h-0">
              {selectedData?.details.map((item) => {
                return <DetailItem data={item} />;
              })}
            </div>
          </div>
        )}
      </div>
    </Transition>
  );
};

export default Detail;
