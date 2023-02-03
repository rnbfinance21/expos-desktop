import Image from "next/image";
import React from "react";
import { Menu } from "../../services/MenuService";
import { numberFormat } from "../../utils/currency";

interface MenuItemProps {
  data: Menu;
  type?: string;
  onClick?: () => void;
}

const MenuItem = ({ data, type, onClick }: MenuItemProps) => {
  return (
    <>
      <div
        onClick={onClick}
        className="shadow rounded bg-white h-48 border text-center flex flex-col p-2 cursor-pointer active:bg-gray-50"
      >
        {type === "list" ? (
          <>
            <div className="text-center">
              <span className="text-[10px] font-light">
                {data.kategori_menu_name}
              </span>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <span className="text-xs font-semibold">{data.name}</span>
            </div>
            <div className="text-center">
              <span className="text-xs font-medium">
                {numberFormat(data.price, 0)}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="relative w-full h-28 bg-gray-100 rounded overflow-hidden">
              <Image src={data.photo} layout="fill" objectFit="cover" />
            </div>
            <div className="flex-1 flex flex-col py-1 items-start justify-between">
              <span className="text-xs font-semibold text-left leading-normal max-h-16">
                {data.name}
              </span>
              <span className="text-[10px] font-normal text-left">
                {numberFormat(data.price, 0)}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

MenuItem.defaultProps = {
  type: "list",
};

export default MenuItem;
