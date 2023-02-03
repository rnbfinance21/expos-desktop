import { Bars3BottomLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { DynamicHeroIcon } from "../components/globals/icons";
import { useAuth } from "../hooks/AuthContext";
import { ucwords } from "../utils/string";
import SideBar from "./Sidebar";

interface HeaderProps {
  isBack: boolean;
}

const Header = ({ isBack }) => {
  const navigate = useRouter();
  const { user, outlet } = useAuth();
  const [openSideBar, setOpenSideBar] = useState(false);

  return (
    <>
      <div className="px-4 py-1 w-full bg-white border-b">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-4 items-center">
            {isBack ? (
              <button
                onClick={() => navigate.back()}
                className="text-xs p-2 border rounded-lg flex flex-row justify-center items-center"
              >
                <DynamicHeroIcon
                  icon="ArrowLeftIcon"
                  className="h-5 w-5 text-gray-900 mr-2"
                />
                Kembali
              </button>
            ) : (
              <>
                <button
                  onClick={() => setOpenSideBar(true)}
                  className="p-2 border rounded-lg"
                >
                  <DynamicHeroIcon
                    icon="Bars3BottomLeftIcon"
                    className="h-5 w-5 text-gray-900"
                  />
                </button>
                <div className="flex justify-center">
                  <p className="text-xl tracking-wide text-red-500">EXPOS</p>
                </div>
              </>
            )}
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
