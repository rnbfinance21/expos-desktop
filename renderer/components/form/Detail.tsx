import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../../features/menuSlice";
import { getOrder, getSumOrder, resetOrder } from "../../features/orderSlice";
import { numberFormat } from "../../utils/currency";
import { DynamicHeroIcon } from "../globals/icons";
import DetailActionButton from "./details/DetailActionButton";
import DetailOrderItem from "./details/DetailOrderItem";

const Detail = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector(getOrder);
  const sum = useSelector(getSumOrder);

  return (
    <div className="w-[450px] h-full bg-white border-l">
      <div className="h-full w-full flex flex-col  bg-white">
        <div className="flex flex-col sticky top-0 z-10 bg-white border-b">
          <div className="px-4 py-[7px] flex flex-row items-center">
            <DynamicHeroIcon icon="UserCircleIcon" className="h-10 w-10" />
            <div className="flex-1 flex flex-col ml-1">
              <p className="text-xs font-medium">Luthfi</p>
              <div className="flex flex-row gap-4">
                <div className="flex flex-row">
                  <p className="text-xs font-thin">Table :</p>
                  <p className="text-xs font-medium">2</p>
                </div>
                <div className="flex flex-row">
                  <p className="text-xs font-thin">Bill :</p>
                  <p className="text-xs font-medium">0001</p>
                </div>
              </div>
            </div>
            <button className="flex flex-row border py-2 px-2 text-xs gap-2 rounded-md">
              <DynamicHeroIcon icon="PencilSquareIcon" />
              Ubah
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto scrollbar-hide">
          <div className="px-4 h-0">
            {orders.map((item) => {
              return <DetailOrderItem data={item} />;
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
