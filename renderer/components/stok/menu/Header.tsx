import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getKategoriMenu,
  getMenu,
  setRefetchMenu,
  setSearch,
  setSelectedCategory,
} from "../../../features/stokMenuSlice";
import { classNames, ucwords } from "../../../utils/string";
import { DynamicHeroIcon } from "../../globals/icons";

const CategoryItem = ({ onClick, isActive, title }) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "text-xs px-4 pt-2 pb-2 hover:border-b-2 hover:border-b-red-500 cursor-pointer",
        isActive ? "border-b-2 border-b-red-500" : ""
      )}
    >
      <p className="w-24 text-center">{ucwords(title)}</p>
    </div>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const kategoriMenu = useSelector(getKategoriMenu);
  const { selectedCategory, search } = useSelector(getMenu);

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

  useEffect(() => {
    if (inputSearch !== search) {
      setInputSearch(search);
    }
  }, [search]);

  return (
    <div className="flex flex-col sticky top-0 z-10 bg-white border-b">
      <div className="px-4 py-2 shadow flex flex-row items-center justify-between">
        <div className="flex-1">
          <div className="relative max-w-sm">
            <input
              className="border text-sm pl-8 pr-4 py-2 rounded-md w-full "
              placeholder="Cari menu..."
              autoCapitalize="none"
              onChange={handleOnChange}
              onKeyUp={(e) => {
                if (e.code === "Enter") {
                  dispatch(setSearch(inputSearch));
                }
              }}
              value={inputSearch}
            />
            <DynamicHeroIcon
              icon="MagnifyingGlassIcon"
              className="absolute left-3 top-3"
            />
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <button
            onClick={() => dispatch(setRefetchMenu(true))}
            className="flex flex-row border py-2 px-2 text-xs gap-2 rounded-md"
          >
            <DynamicHeroIcon icon="ArrowPathIcon" />
            Perbarui
          </button>
        </div>
      </div>
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex flex-row w-0">
          <CategoryItem
            onClick={() => dispatch(setSelectedCategory(null))}
            isActive={selectedCategory === null}
            title={"Semua"}
          />
          {kategoriMenu.map((c) => {
            return (
              <CategoryItem
                onClick={() => dispatch(setSelectedCategory(c.id))}
                isActive={selectedCategory === c.id}
                title={c.name}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Header;
