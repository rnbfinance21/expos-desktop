import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setRefetch, setSearch } from "../../../features/pengeluaranSlice";
import { DynamicHeroIcon } from "../../globals/icons";
import Filter from "./Filter";

const Header = () => {
  const dispatch = useDispatch();

  const [inputSearch, setInputSearch] = useState("");

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputSearch !== undefined) {
        dispatch(setSearch(inputSearch));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputSearch]);

  return (
    <div className="px-4 py-2 shadow flex flex-row items-center justify-between sticky top-0 bg-white border-b">
      <div className="flex-1">
        <div className="relative max-w-sm">
          <input
            className="border text-sm pl-8 pr-4 py-2 rounded-md w-full "
            placeholder="Cari transaksi..."
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
        <button
          onClick={() => dispatch(setRefetch(true))}
          className="flex flex-row border py-2 px-2 text-xs gap-2 rounded-md"
        >
          <DynamicHeroIcon icon="ArrowPathIcon" />
          Perbarui
        </button>
        <Filter />
      </div>
    </div>
  );
};

export default Header;
