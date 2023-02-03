import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPayment,
  setOpenModal,
  setSelectedItem,
} from "../../features/paymentSlice";
import ChangePriceModal from "./ChangePriceModal";
import PaymentOrderItem from "./details/PaymentOrderItem";
import ProfileSection from "./details/ProfileSection";

const Main = () => {
  const dispatch = useDispatch();
  const { orders, changeState, openModal, selectedItem } =
    useSelector(getPayment);

  return (
    <div className="w-[600px] h-full flex flex-col border-r">
      <ProfileSection />
      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="h-0">
          {orders.map((item) => {
            return (
              <PaymentOrderItem
                key={`payment_item_${item.id}`}
                data={item}
                change={changeState}
                onChange={() => {
                  dispatch(setSelectedItem(item));
                  dispatch(setOpenModal(true));
                }}
              />
            );
          })}
        </div>
      </div>
      <ChangePriceModal
        visible={openModal}
        onClose={() => dispatch(setOpenModal(false))}
        data={selectedItem}
      />
    </div>
  );
};

export default Main;
