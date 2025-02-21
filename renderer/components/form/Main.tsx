import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModalCustom,
  setModalCustom,
  setSelectedMenuCustom,
  setType,
} from "../../features/customSlice";
import {
  getMenu,
  getMenuData,
  setMenu,
  setRefetchMenu,
} from "../../features/menuSlice";
import { addItem } from "../../features/orderSlice";
import { useAuth } from "../../hooks/AuthContext";
import MenuService, { Menu } from "../../services/MenuService";
import { numberFormat } from "../../utils/currency";
import { Loading } from "../globals/icons";
import Header from "./Header";
import MenuCustomModal from "./menu/MenuCustomModal";
import MenuItem from "./MenuItem";

const Main = () => {
  const dispatch = useDispatch();
  const { token, outlet } = useAuth();

  const { refetchMenu, type } = useSelector(getMenu);
  const menuData = useSelector(getMenuData);

  const _openModal = () => {
    dispatch(setType("ADD"));
    dispatch(setModalCustom(true));
  };

  const { isLoading, isRefetching, refetch } = useQuery(
    ["menus", token],
    () => MenuService.getMenuOutlet(token, outlet.code),
    {
      enabled: false,
      onSuccess: (res) => {
        dispatch(setMenu(res.data));
      },
      onSettled: () => {
        dispatch(setRefetchMenu(false));
      },
    }
  );

  const _onClickMenu = (menu: Menu) => {
    // const isCustom = menu.variants.length > 0 ? true : false;

    // dispatch(resetModalCustom());

    // setTimeout(() => {
    //   dispatch(setSelectedMenuCustom(menu));
    //   _openModal();
    // }, 500);

    if (menu.custom_state) {
      dispatch(setSelectedMenuCustom(menu));
      _openModal();
      // show modal
    } else {
      dispatch(
        addItem({
          id: menu.id,
          price: menu.price,
          qty: 1,
          notes: null,
          margin: 0,
          box: 0,
          diskon: 0,
          margin_stat: menu.box_state,
          pajak_stat: menu.tax_state,
          variants: [],
          menu: menu,
          type_order: 1,
        })
      );
    }
  };

  useEffect(() => {
    if (refetchMenu) {
      refetch();
    }
  }, [refetchMenu]);

  return (
    <div className="flex-1 flex flex-row bg-gray-100">
      <div className="flex-1 flex flex-col overflow-auto bg-white scrollbar-hide">
        <Header />
        {isLoading || isRefetching ? (
          <div className="w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <>
            {menuData.length === 0 ? (
              <div className="flex-1 flex justify-center items-center">
                <p className="text-sm font-medium">Menu tidak tersedia</p>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2 px-2 py-2 h-0">
                {menuData.map((m) => {
                  return (
                    <MenuItem
                      key={`menu_${m.id}`}
                      data={m}
                      type={type}
                      onClick={() => _onClickMenu(m)}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      <MenuCustomModal />
    </div>
  );
};

export default Main;
