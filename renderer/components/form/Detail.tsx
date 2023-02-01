import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalCustom,
  setSelectedMenuCustom,
  setSelectedOrder,
  setType,
} from "../../features/customSlice";
import { setSearch } from "../../features/menuSlice";
import {
  getOrder,
  getSumOrder,
  Orders,
  resetOrder,
} from "../../features/orderSlice";
import { numberFormat } from "../../utils/currency";
import { DynamicHeroIcon } from "../globals/icons";
import Customer from "./details/Customer";
import DetailActionButton from "./details/DetailActionButton";
import DetailOrderItem from "./details/DetailOrderItem";

const Detail = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector(getOrder);
  const sum = useSelector(getSumOrder);

  const _onClick = (item: Orders) => {
    const isCustom = item.menu.variants.length > 0 ?? false;

    if (isCustom) {
      dispatch(setType("UPDATE"));
      dispatch(setModalCustom(true));
      dispatch(setSelectedMenuCustom(item.menu));
      dispatch(setSelectedOrder(item));
    } else {
      // open modal edit
    }
  };

  return (
    <div className="w-[450px] h-full bg-white border-l">
      <div className="h-full w-full flex flex-col  bg-white">
        <Customer />
        <div className="flex-1 overflow-auto scrollbar-hide">
          <div className="h-0">
            {orders.map((item) => {
              return (
                <DetailOrderItem data={item} onClick={() => _onClick(item)} />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col bg-white border-b pt-4 border-t">
          <div className="flex flex-row pb-2 px-4">
            <div className="flex-1 flex flex-row gap-2">
              <DetailActionButton
                icon="CubeIcon"
                title="Tambah Box"
                onClick={() => dispatch(setSearch("box"))}
              />
            </div>
            <div>
              <DetailActionButton
                icon="XMarkIcon"
                title="Batal Pesan"
                outline={false}
                iconClassName="text-white"
                onClick={() => dispatch(resetOrder())}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="bg-blue-500 active:bg-blue-600 text-white p-4 text-center text-sm font-medium cursor-pointer">
              Simpan
            </div>
            <div className="bg-green-500 active:bg-green-600 text-white p-4 text-center text-sm font-medium cursor-pointer">
              Rp {numberFormat(sum, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
