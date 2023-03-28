import React from "react";
import { Payment } from "../../../features/paymentSlice";
import { numberFormat } from "../../../utils/currency";
import { ucwords } from "../../../utils/string";

type PaymentOrderItemProps = {
  data: Payment;
  onChange?: () => void;
  change: boolean;
};

const PaymentOrderItem = ({
  data,
  change,
  onChange,
}: PaymentOrderItemProps) => {
  const priceMenu = data.price;
  const sum = priceMenu * data.qty;
  const box = data.qty * data.box;

  const margin = (sum * data.margin) / 100;
  const price = sum + margin + box;

  const diskon = (price * data.diskon) / 100;

  const result = price - diskon;

  const priceItem = priceMenu + (priceMenu * data.margin) / 100 + data.box;

  return (
    <div className="border-b border-b-gray-300 border-dashed flex flex-row">
      <div className="flex-1 p-4">
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
      {change ? (
        <button
          type="button"
          onClick={onChange}
          className="bg-green-500 px-8 py-2 ml-4 text-xs font-bold text-white flex justify-center items-center"
        >
          <p>Ubah</p>
        </button>
      ) : null}
    </div>
  );
};

export default PaymentOrderItem;
