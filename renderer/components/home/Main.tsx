import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getListOrder } from "../../features/listOrderSlice";
import Header from "./Header";
import OrderItem from "./OrderItem";

const Main = () => {
  const { date, status, search } = useSelector(getListOrder);

  useEffect(() => {
    console.table({
      date,
      status,
      search,
    });
  }, [date, status, search]);
  return (
    <div className="flex-1 flex flex-row bg-gray-100">
      <div className="flex-1 flex flex-col overflow-auto bg-white">
        <Header />
        <div className="h-0">
          {[...Array(25)].map(() => {
            return <OrderItem />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Main;
