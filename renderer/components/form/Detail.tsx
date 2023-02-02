import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalCustom,
  setModalUpdate,
  setSelectedMenuCustom,
  setSelectedOrder,
  setType,
} from "../../features/customSlice";
import { getOrder, Orders } from "../../features/orderSlice";
import Customer from "./details/Customer";
import DetailAction from "./details/DetailAction";
import DetailOrderItem from "./details/DetailOrderItem";
import OrderUpdateModal from "./menu/OrderUpdateModal";

const Detail = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector(getOrder);

  const _onClick = (item: Orders) => {
    const isCustom = item.menu.variants.length > 0 ?? false;

    if (isCustom) {
      dispatch(setType("UPDATE"));
      dispatch(setModalCustom(true));
      dispatch(setSelectedMenuCustom(item.menu));
      dispatch(setSelectedOrder(item));
    } else {
      dispatch(setType("UPDATE"));
      dispatch(setModalUpdate(true));
      dispatch(setSelectedMenuCustom(item.menu));
      dispatch(setSelectedOrder(item));
    }
  };

  return (
    <div className="w-[450px] h-full bg-white border-l">
      <div className="h-full w-full flex flex-col  bg-white">
        <Customer />
        <div className="flex-1 overflow-auto scrollbar-hide">
          <div className="h-0">
            {orders.map((item) => {
              return (
                <DetailOrderItem data={item} onClick={() => _onClick(item)} />
              );
            })}
          </div>
        </div>
        <DetailAction />
      </div>
      <OrderUpdateModal />
    </div>
  );
};

export default Detail;
