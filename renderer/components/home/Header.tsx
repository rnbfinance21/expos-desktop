import Link from "next/link";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import {
    getListOrder,
    setRefetchOrder,
    setSearch,
    setSelectedOrder,
    setStatus,
} from "../../features/listOrderSlice";
import {
    getOrder,
    resetOrder,
    setKey,
    setType,
} from "../../features/orderSlice";
import { useAuth } from "../../hooks/AuthContext";
import { DynamicHeroIcon } from "../globals/icons";
import Filter from "./Filter";
import { generateRandomString } from "../../utils/string";

const Header = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { openState } = useAuth();
    const { status } = useSelector(getListOrder);
    const { type } = useSelector(getOrder);

    const [inputSearch, setInputSearch] = useState("");

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputSearch(e.target.value);
    };

    const _setStatus = (valStatus: number | null) =>
        dispatch(setStatus(valStatus));

    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputSearch !== undefined) {
                dispatch(setSearch(inputSearch));
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [inputSearch]);

    return (
        <div className="px-4 py-2 shadow flex flex-col sticky top-0 bg-white border-b">
            <div className="flex flex-row items-center justify-between mb-4">
                <div className="flex-1">
                    <div className="relative max-w-sm">
                        <input
                            className="border text-sm pl-8 pr-4 py-2 rounded-md w-full "
                            placeholder="Cari transaksi..."
                            // data-kioskboard-type="all"
                            // data-kioskboard-placement="bottom"
                            // data-kioskboard-capsLockActive={false}
                            autoCapitalize="none"
                            onChange={handleOnChange}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    dispatch(setSearch(inputSearch));
                                }
                            }}
                        />
                        <DynamicHeroIcon
                            icon="MagnifyingGlassIcon"
                            className="absolute left-3 top-3"
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-2">
                    {openState ? (
                        <button
                            onClick={() => {
                                if (type !== "ADD") {
                                    dispatch(resetOrder());
                                }
                                dispatch(setKey(generateRandomString(32)));
                                router.push("/form");
                            }}
                        >
                            <div className="flex flex-row border py-2 px-2 text-xs gap-2 rounded-md">
                                <DynamicHeroIcon icon="PlusIcon" />
                                Buat Order
                            </div>
                        </button>
                    ) : null}
                    <button
                        onClick={() => {
                            // dispatch(setSelectedOrder(null));
                            dispatch(setRefetchOrder(true));
                        }}
                        className="flex flex-row border py-2 px-2 text-xs gap-2 rounded-md"
                    >
                        <DynamicHeroIcon icon="ArrowPathIcon" />
                        Perbarui
                    </button>
                    <Filter />
                </div>
            </div>
            <div className="flex flex-row gap-4">
                <button
                    onClick={() => _setStatus(null)}
                    className={twMerge(
                        "flex flex-row justify-center border py-2 px-2 text-xs font-light text-gray-600 gap-2 rounded-md w-[100px]",
                        status === null ? "bg-red-500 text-white" : ""
                    )}
                >
                    Belum Bayar
                </button>
                <button
                    onClick={() => _setStatus(2)}
                    className={twMerge(
                        "flex flex-row justify-center border py-2 px-2 text-xs font-light text-gray-600 gap-2 rounded-md w-[100px]",
                        status === 2 ? "bg-red-500 text-white" : ""
                    )}
                >
                    Sudah Bayar
                </button>
                <button
                    onClick={() => _setStatus(-1)}
                    className={twMerge(
                        "flex flex-row justify-center border py-2 px-2 text-xs font-light text-gray-600 gap-2 rounded-md w-[100px]",
                        status === -1 ? "bg-red-500 text-white" : ""
                    )}
                >
                    Lainnya
                </button>
            </div>
        </div>
    );
};

export default Header;
