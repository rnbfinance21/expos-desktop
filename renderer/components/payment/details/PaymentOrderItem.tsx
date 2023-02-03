import React from "react";
import { Payment } from "../../../features/paymentSlice";
import { numberFormat } from "../../../utils/currency";
import { ucwords } from "../../../utils/string";

type PaymentOrderItemProps = {
  data: Payment;
  onClick?: () => void;
};

const PaymentOrderItem = ({ data, onClick }: PaymentOrderItemProps) => {
  const sum = data.price * data.qty;
  const box = data.qty * data.box;

  const margin = (sum * data.margin) / 100;
  const price = sum + margin + box;

  const diskon = (price * data.diskon) / 100;

  const result = price - diskon;

  const priceItem = data.price + (data.price * data.margin) / 100 + data.box;

  return (
    <div
      onClick={onClick}
      className="p-4 border-b border-b-gray-300 border-dashed active:bg-gray-50"
    >
      <div className="flex flex-row justify-between">
        <span className="text-xs font-bold text-red-500">
          {ucwords(data.menu.name)}
        </span>
        <span className="text-xs font-bold">Rp{numberFormat(result, 0)}</span>
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
            Disc ({data.diskon ?? 0}%) {numberFormat(priceItem, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentOrderItem;
