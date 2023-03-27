import React from "react";
import { Orders } from "../../../features/orderSlice";
import { numberFormat } from "../../../utils/currency";
import { ucwords } from "../../../utils/string";

type DetailOrderItemProps = {
  data: Orders;
  onClick?: () => void;
};

const DetailOrderItem = ({ data, onClick }: DetailOrderItemProps) => {
  const price =
    data.price +
    data.variants.reduce((acc, itm) => {
      return acc + itm.price;
    }, 0);

  const diskon = (price * data.qty * data.diskon) / 100;

  const total = price * data.qty - diskon;

  return (
    <div
      onClick={onClick}
      className="p-4 border-b border-b-gray-300 border-dashed active:bg-gray-50 cursor-pointer"
    >
      <div className="flex flex-row justify-between">
        <span className="text-xs font-bold text-red-500">
          {ucwords(data.menu.name)}
        </span>
        <span className="text-xs font-bold">Rp{numberFormat(total, 0)}</span>
      </div>
      {data.type_order === 2 ? (
        <div className="flex flex-row">
          <span className="text-[10px] text-gray-800 font-semibold">
            Take Away / Dibungkus
          </span>
        </div>
      ) : null}
      <div className="flex flex-col mt-1 justify-between">
        {data.variants.map((variant) => {
          return (
            <div
              key={`variant_${variant.category_id}`}
              className="flex flex-row"
            >
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
      {data.notes !== "" && data.notes !== null ? (
        <div className="mt-1">
          <p className="text-[10px] text-gray-500 font-light mr-1">
            Catatan Pembeli:
          </p>
          <p className="text-[10px] text-gray-800 font-semibold mr-1">
            {data.notes}
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
