import React from "react";
import { Order, OrderDetail } from "../../services/OrderService";
import { classNames, ucwords } from "../../utils/string";
import PendingAction from "./details/actions/PendingAction";
import ProsesAction from "./details/actions/ProsesAction";
import PaidAction from "./details/actions/PaidAction";

interface OrderItemProps {
  data: OrderDetail;
  onClick?: () => void;
  selected?: boolean;
}

const OrderItem = ({ data, onClick, selected }: OrderItemProps) => {
  const stateColor: {
    [key: number]: {
      background: string;
      text: string;
    };
  } = {
    0: {
      background: "bg-gray-100",
      text: "text-gray-900",
    },
    1: {
      background: "bg-blue-100",
      text: "text-blue-900",
    },
    2: {
      background: "bg-green-100",
      text: "text-green-900",
    },
    "-1": {
      background: "bg-red-100",
      text: "text-red-900",
    },
  };

  const selectColor = stateColor[data.status] ?? stateColor["-1"];

  return (
    <div
      onClick={onClick}
      className={classNames(
        "flex flex-col w-full p-4 border-b hover:bg-gray-50 cursor-pointer",
        selected ? "bg-gray-50" : ""
      )}
    >
      <div className="flex-1 flex flex-row items-center">
        <div className="h-11 bg-gray-100 border rounded-md overflow-hidden flex justify-center items-center px-4">
          <span className="text-sm font-bold text-gray-900 text-center">
            {data.table}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-end h-full mx-4">
          <div className="flex flex-row items-center gap-2 mb-1">
            <p className="text-sm font-bold">{ucwords(data.name)}</p>
            <button
              className={`text-[10px] font-bold ${selectColor.background} ${selectColor.text} px-3 rounded-lg cursor-auto`}
            >
              {data.status_text}
            </button>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <p className="text-[10px] font-light text-gray-600">
              #{data.kode_transaksi}
            </p>
            <div className="h-[6px] w-[6px] rounded-full bg-gray-300" />
            <p className="text-[10px] font-light text-gray-600">{data.date}</p>
            <div className="h-[6px] w-[6px] rounded-full bg-gray-300" />
            <p className="text-[10px] font-light text-gray-600">
              {data.items_count} items
            </p>
          </div>
        </div>

        <div className="w-[350px]">
          {data.status === 0 ? (
            <PendingAction data={data} />
          ) : data?.status === 1 ? (
            <ProsesAction data={data} />
          ) : data?.status === 2 ? (
            <PaidAction data={data} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

OrderItem.defaultProps = {
  selected: false,
};

export default OrderItem;
