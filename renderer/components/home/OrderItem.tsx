import React from "react";

const OrderItem = () => {
  return (
    <div className="flex flex-col w-full p-4 border-b justify-between gap-4">
      <div className="flex-1 flex flex-row gap-4 items-center">
        <div className="w-11 h-11 bg-gray-100 border rounded-md overflow-hidden flex justify-center items-center">
          <span className="font-bold text-gray-900">2A</span>
        </div>
        <div className="flex flex-col justify-end h-full">
          <div className="flex flex-row items-center gap-2 mb-1">
            <p className="text-sm font-bold">Luthfi Pratama</p>
            <button className="text-[10px] font-bold text-white bg-red-500 px-3 rounded-lg cursor-auto">
              pending
            </button>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <p className="text-[10px] font-light text-gray-600">
              #LKG-120230130-0001
            </p>
            <div className="h-[6px] w-[6px] rounded-full bg-gray-300" />
            <p className="text-[10px] font-light text-gray-600">
              30 Jan 2023 15:38
            </p>
            <div className="h-[6px] w-[6px] rounded-full bg-gray-300" />
            <p className="text-[10px] font-light text-gray-600">4 items</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
