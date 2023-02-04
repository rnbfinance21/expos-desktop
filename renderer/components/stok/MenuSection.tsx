import { Switch } from "@headlessui/react";
import React, { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  getMenu,
  getMenuData,
  setMenu,
  setRefetchMenu,
} from "../../features/stokMenuSlice";
import { useAuth } from "../../hooks/AuthContext";
import MenuService, {
  ChangeStockStateParams,
} from "../../services/MenuService";
import { handleErrorAxios } from "../../utils/errors";
import { Loading } from "../globals/icons";
import Header from "./menu/Header";

const MenuSection = () => {
  const dispatch = useDispatch();
  const { token, outlet } = useAuth();

  const { refetchMenu } = useSelector(getMenu);
  const menu = useSelector(getMenuData);

  const { isLoading, isRefetching, refetch } = useQuery(
    ["stok_menu", token],
    () => MenuService.getMenuOutlet(token, outlet.code),
    {
      onSuccess: (res) => {
        dispatch(setMenu(res.data));
      },
      onSettled: () => {
        dispatch(setRefetchMenu(false));
      },
    }
  );

  const updateStockMutation = useMutation(
    (params: ChangeStockStateParams) =>
      MenuService.changeStockState(token, params),
    {
      onSuccess: (res) => {
        refetch();
      },
      onError: handleErrorAxios,
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
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <>
            {menu.length === 0 ? (
              <div className="flex-1 flex justify-center items-center">
                <p className="text-sm font-medium">Menu tidak tersedia</p>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2 px-2 py-2 h-0">
                {menu.map((m) => {
                  return (
                    <div className="p-4 border flex flex-row">
                      <div className="flex-1">
                        <p className="text-xs font-medium">{m.name}</p>
                      </div>
                      <Switch
                        checked={!!m.in_stock}
                        onChange={(e) => {
                          updateStockMutation.mutate({
                            menu_id: m.id,
                            outlet_id: outlet.id,
                            state: e ? 1 : 0,
                          });
                        }}
                        className={`${
                          !!m.in_stock ? "bg-green-500" : "bg-red-500"
                        }
          relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span className="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          className={`${
                            !!m.in_stock ? "translate-x-5" : "translate-x-0"
                          }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MenuSection;
