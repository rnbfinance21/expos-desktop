import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { Fragment } from "react";
import { useAuth } from "../hooks/AuthContext";
import { classNames, ucwords } from "../utils/string";
import Divider from "../components/globals/dividers/Divider";
import { DynamicHeroIcon } from "../components/globals/icons";
import { IconName } from "../components/globals/icons/DynamicHeroIcon";
import { useRouter } from "next/router";

type SideBarProps = {
  show: boolean;
  onClose: () => void;
};

type SideBarMenuProps = {
  title: string;
  onClick: () => void;
  icon: IconName;
};

const SideBarMenu = ({ title, onClick, icon }: SideBarMenuProps) => {
  return (
    <div>
      <button
        type="button"
        className={classNames(
          "group w-full flex items-center pl-2 py-4 text-sm font-medium rounded-md bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
        onClick={onClick}
      >
        <DynamicHeroIcon
          icon={icon}
          className="mr-3 flex-shrink-0 h-6 w-6 "
          aria-hidden="true"
        />
        {title}
      </button>
    </div>
  );
};

const SideBar = ({ show, onClose }: SideBarProps) => {
  const { user, outlet, logout } = useAuth();
  const router = useRouter();

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex flex-col flex-shrink-0 items-center justify-center px-4">
                <div className="h-36 w-36 rounded-full bg-gray-100 overflow-hidden mb-2">
                  <img
                    src={user?.photo}
                    alt="user profile"
                    className="w-full h-full"
                  />
                </div>
                <span className="text-sm font-semibold text-red-500">
                  {ucwords(user?.name ?? "Nama Kasir")}
                </span>
                <span className="text-sm font-semibold text-red-500">
                  {ucwords(outlet?.name ?? "Outlet")}
                </span>
              </div>
              <div className="mt-5 h-0 flex-1 overflow-y-auto">
                <nav className="space-y-1 px-2">
                  <div className="pb-10">
                    <div>
                      <SideBarMenu
                        title="Utama"
                        onClick={() => router.push("/home")}
                        icon="HomeIcon"
                      />
                    </div>
                    <div>
                      <SideBarMenu
                        title="Laporan"
                        onClick={() => router.push("/report")}
                        icon="DocumentChartBarIcon"
                      />
                    </div>
                    <div>
                      <SideBarMenu
                        title="Pengeluaran"
                        onClick={() => router.push("/pengeluaran")}
                        icon="CreditCardIcon"
                      />
                    </div>
                    <div>
                      <SideBarMenu
                        title="Stok Menu"
                        onClick={() => router.push("/stok/")}
                        icon="DocumentArrowUpIcon"
                      />
                    </div>
                    <div>
                      <SideBarMenu
                        title="Stok Variant"
                        onClick={() => router.push("/stok/variant")}
                        icon="DocumentArrowDownIcon"
                      />
                    </div>
                  </div>
                  <Divider />
                  <div>
                    <SideBarMenu
                      title="Pengaturan"
                      onClick={() => router.push("/config")}
                      icon="Cog8ToothIcon"
                    />
                  </div>
                  <Divider />
                  <div>
                    <SideBarMenu
                      title="Keluar"
                      onClick={logout}
                      icon="ArrowRightOnRectangleIcon"
                    />
                  </div>
                  <Divider />
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
          <div className="w-14 flex-shrink-0" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SideBar;
