import React from "react";
import { Orders } from "../../../features/orderSlice";
import { Detail } from "../../../services/OrderService";
import { numberFormat } from "../../../utils/currency";
import { ucwords } from "../../../utils/string";

type DetailOrderItemProps = {
  data: Orders;
};

const DetailOrderItem = ({ data }: DetailOrderItemProps) => {
  const diskon = (data.price * data.qty * data.diskon) / 100;

  const total = data.price * data.qty - diskon;

  return (
    <div className="py-4 border-b border-b-gray-300 border-dashed">
      <div className="flex flex-row justify-between">
        <span className="text-xs font-bold text-red-500">{ucwords(data.menu.name)}</span>
        <span className="text-xs font-bold">Rp{numberFormat(total, 0)}</span>
      </div>
      <div className="flex flex-col mt-1 justify-between">
        {data.variants.map((variant) => {
          return (
            <div className="flex flex-row">
              <span className="text-[10px] text-gray-500 font-light mr-1">
                {ucwords(variant.category_name)}:
              </span>
              <span className="text-[10px] text-gray-800 font-semibold">
                {ucwords(variant.option_name)}
              </span>
            </div>
          );
        })}
      </div>
      {data.notes !== null ? (
        <div className="mt-1">
          <p className="text-[10px] text-gray-500 font-light mr-1">
            Catatan Pembeli: &quot;{data.notes}&quot;
          </p>
        </div>
      ) : null}
      <div className="flex flex-row mt-2 justify-between">
        <div className="flex flex-row">
          <span className="text-[10px] text-gray-500 font-light mr-1">
            Jumlah:
          </span>
          <span className="text-[10px] text-gray-800 font-semibold">
            {data.qty}
          </span>
        </div>
        <div className="flex flex-row">
          <span className="text-[10px] text-gray-800 font-semibold">
            Disc ({data.diskon ?? 0}%) {numberFormat(data.price, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DetailOrderItem;
