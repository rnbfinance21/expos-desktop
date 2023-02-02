import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalCustom,
  setModalUpdate,
  setSelectedMenuCustom,
  setSelectedOrder,
  setType,
} from "../../features/customSlice";
import { getOrder, Orders } from "../../features/orderSlice";
import PasscodeModal from "../modals/PasscodeModal";
import Customer from "./details/Customer";
import DetailAction from "./details/DetailAction";
import DetailOrderItem from "./details/DetailOrderItem";
import OrderUpdateModal from "./menu/OrderUpdateModal";

const Detail = () => {
  const dispatch = useDispatch();
  const { orders, type } = useSelector(getOrder);

  const [selectedData, setSelectedData] = useState<Orders>();
  const [openPasscodeModal, setOpenPasscodeModal] = useState(false);

  const _showModalUpdate = () => {
    setOpenPasscodeModal(false);
    if (selectedData) {
      const isCustom = selectedData.menu.variants.length > 0 ?? false;

      if (isCustom) {
        dispatch(setType("UPDATE"));
        dispatch(setModalCustom(true));
        dispatch(setSelectedMenuCustom(selectedData.menu));
        dispatch(setSelectedOrder(selectedData));
      } else {
        dispatch(setType("UPDATE"));
        dispatch(setModalUpdate(true));
        dispatch(setSelectedMenuCustom(selectedData.menu));
        dispatch(setSelectedOrder(selectedData));
      }
    }
  };

  const _onClick = (item: Orders) => {
    setSelectedData(item);
    if (type === "ADD") {
      _showModalUpdate();
    } else {
      setOpenPasscodeModal(true);
    }
  };

  const _onSuccessPasscode = () => {
    _showModalUpdate();
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
      <PasscodeModal
        visible={openPasscodeModal}
        onClose={() => setOpenPasscodeModal(false)}
        onSuccess={_onSuccessPasscode}
      />
    </div>
  );
};

export default Detail;
