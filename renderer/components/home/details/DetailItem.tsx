import React from "react";
import { Detail } from "../../../services/OrderService";
import { numberFormat } from "../../../utils/currency";
import { ucwords } from "../../../utils/string";

type DetailItemProps = {
  data: Detail;
};

const DetailItem = ({ data }: DetailItemProps) => {
  return (
    <div className="py-4 border-b border-b-gray-300 border-dashed">
      <div className="flex flex-row justify-between">
        <span className="text-sm font-bold">{ucwords(data.menu.name)}</span>
        <span className="text-sm font-bold">
          Rp{numberFormat(data.total, 0)}
        </span>
      </div>
      {data.type_order === 2 ? (
        <div className="mt-1">
          <p className="text-[10px] text-gray-500 font-light mr-1">
            Take Away / Dibungkus
          </p>
        </div>
      ) : null}
      <div className="flex flex-col mt-1 justify-between">
        {data.variants.map((variant) => {
          return (
            <div key={`detail_variant_${variant.id}`} className="flex flex-row">
              <span className="text-[10px] text-gray-500 font-light mr-1">
                {ucwords(variant.variant_name)}:
              </span>
              <span className="text-[10px] text-gray-800 font-semibold">
                {ucwords(variant.option_name)}
              </span>
            </div>
          );
        })}
      </div>
      {data.description !== null ? (
        <div className="mt-1">
          <p className="text-[10px] text-gray-500 font-light mr-1">
            Catatan Pembeli: &quot;{data.description}&quot;
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

export default DetailItem;
