import { Bars3BottomLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useState } from "react";
import { DynamicHeroIcon } from "../components/globals/icons";
import { useAuth } from "../hooks/AuthContext";
import { ucwords } from "../utils/string";
import SideBar from "./Sidebar";

const Header = () => {
  const { user, outlet } = useAuth();
  const [openSideBar, setOpenSideBar] = useState(false);

  return (
    <>
      <div className="px-4 py-3 w-full bg-white border-b">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-4">
            <button
              onClick={() => setOpenSideBar(true)}
              className="p-2 border rounded-lg"
            >
              <DynamicHeroIcon
                icon="Bars3BottomLeftIcon"
                className="h-5 w-5 text-gray-900"
              />
            </button>
            <div>
              <p className="text-3xl tracking-wide text-red-500">EXPOS</p>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-col items-end">
              <p className="text-xs font-bold">{ucwords(user?.name ?? "")}</p>
              <p className="text-[10px] font-thin">
                {ucwords(outlet?.name ?? "")}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-50 border">
              {user ? (
                <Image
                  src={user?.photo}
                  width={40}
                  height={40}
                  objectFit="cover"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <SideBar show={openSideBar} onClose={() => setOpenSideBar(false)} />
    </>
  );
};

export default Header;
