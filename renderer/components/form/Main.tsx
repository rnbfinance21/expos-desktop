import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  getMenu,
  getMenuData,
  setMenu,
  setRefetchMenu,
} from "../../features/menuSlice";
import { useAuth } from "../../hooks/AuthContext";
import MenuService, { Menu } from "../../services/MenuService";
import { numberFormat } from "../../utils/currency";
import { Loading } from "../globals/icons";
import Header from "./Header";
import MenuItem from "./MenuItem";

const Main = () => {
  const dispatch = useDispatch();
  const { token, outlet } = useAuth();
  const { refetchMenu, type } = useSelector(getMenu);
  const menuData = useSelector(getMenuData);

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
          <div className="grid grid-cols-5 gap-2 px-2 py-2 h-0">
            {menuData.map((m) => {
              return <MenuItem data={m} type={type} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
