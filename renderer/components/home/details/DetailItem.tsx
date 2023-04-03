import React from "react";
import { Detail } from "../../../services/OrderService";
import { numberFormat } from "../../../utils/currency";
import { ucwords } from "../../../utils/string";
import { VariantOrder } from "../../../features/orderSlice";

type DetailItemProps = {
  data: Detail;
};

const DetailItem = ({ data }: DetailItemProps) => {
  let tmpVariant: VariantOrder[] = [];

  data.variants.forEach((e) => {
    let find = tmpVariant.findIndex((f) => f.id === e.variant_id);

    if (find === -1) {
      tmpVariant.push({
        id: e.variant_id,
        name: e.variant_name,
        data: [
          {
            option_id: e.variant_option_id,
            option_name: e.option_name,
            price: e.price,
          },
        ],
      });
    } else {
      let selected = tmpVariant[find];

      let tmpData: {
        option_id: number;
        option_name: string;
        price: number;
      }[] = [
        ...selected.data,
        {
          option_id: e.variant_option_id,
          option_name: e.option_name,
          price: e.price,
        },
      ];

      tmpVariant[find].data = tmpData;
    }
  });

  return (
    <div className="py-4 border-b border-b-gray-300 border-dashed">
      <div className="flex flex-row justify-between">
        <span className="text-sm font-bold">
          {ucwords(data.menu.name)}{" "}
          {data.type === 1 ? (
            <span className="text-green-500 text-[10px]">(tambahan)</span>
          ) : null}
        </span>
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
        {tmpVariant.map((variant) => {
          return (
            <div key={`detail_variant_${variant.id}`} className="flex flex-row">
              <span className="text-[10px] text-gray-500 font-light mr-1">
                {ucwords(variant.name)}:
              </span>
              <span className="text-[10px] text-gray-800 font-semibold">
                {variant.data
                  .map((opt: any, oi: number) => {
                    let result = `${opt.option_name} `;
                    return result;
                  })
                  .toString()}
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
