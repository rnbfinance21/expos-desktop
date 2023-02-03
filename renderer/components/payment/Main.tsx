import React from "react";
import { useSelector } from "react-redux";
import { getPayment } from "../../features/paymentSlice";
import PaymentOrderItem from "./details/PaymentOrderItem";
import ProfileSection from "./details/ProfileSection";

const Main = () => {
  const { orders } = useSelector(getPayment);

  return (
    <div className="w-[600px] h-full flex flex-col border-r">
      <ProfileSection />
      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="h-0">
          {orders.map((item) => {
            return (
              <PaymentOrderItem key={`payment_item_${item.id}`} data={item} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Main;
