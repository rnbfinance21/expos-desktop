import { Switch } from "@headlessui/react";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { Loading } from "../../components/globals/icons";
import { useAuth } from "../../hooks/AuthContext";
import DefaultLayout from "../../layouts/DefaultLayout";
import MenuService, {
  ChangeVariantStateParams,
  VariantData,
} from "../../services/MenuService";
import { handleErrorAxios } from "../../utils/errors";
import { ucwords } from "../../utils/string";

const variant = () => {
  const { token, outlet } = useAuth();

  const [data, setData] = useState<VariantData[]>([]);

  const { isLoading, refetch } = useQuery(
    ["stok_variant", token],
    () => MenuService.getVariantOutlet(token, outlet?.id ?? 1),
    {
      onSuccess: (res) => {
        setData(res.data);
      },
    }
  );

  const updateVariantMutation = useMutation(
    (params: ChangeVariantStateParams) =>
      MenuService.changeVariantState(token, params),
    {
      onSuccess: (res) => {
        refetch();
      },
      onError: handleErrorAxios,
    }
  );

  return (
    <DefaultLayout title="Stok Variant">
      <div className="flex-grow w-full flex flex-col">
        <div className="flex-1 flex flex-row bg-gray-100">
          <div className="flex-1 flex flex-col overflow-auto bg-white scrollbar-hide py-4 px-2">
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <Loading />
              </div>
            ) : (
              <>
                {data.length === 0 ? (
                  <div className="flex-1 flex justify-center items-center">
                    <p className="text-sm font-medium">Menu tidak tersedia</p>
                  </div>
                ) : (
                  <div className="h-0">
                    {data.map((v) => {
                      return (
                        <div key={`variant_${v.id}`} className="flex flex-col">
                          <div className="px-4">
                            <span className="text-sm font-medium">
                              {ucwords(v.name)}
                            </span>
                          </div>
                          <div className="grid grid-cols-5 gap-2 px-2 py-2">
                            {v.options.map((m) => {
                              return (
                                <div
                                  key={`variant_option_${m.id}`}
                                  className="p-4 border flex flex-row"
                                >
                                  <div className="flex-1">
                                    <p className="text-xs font-light">
                                      {m.name}
                                    </p>
                                  </div>
                                  <Switch
                                    checked={!!m.state}
                                    onChange={(e) => {
                                      updateVariantMutation.mutate({
                                        variant_option_id: m.id,
                                        outlet_id: outlet.id,
                                        state: e ? 1 : 0,
                                      });
                                    }}
                                    className={`${
                                      !!m.state ? "bg-green-500" : "bg-red-500"
                                    }
          relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                  >
                                    <span className="sr-only">Use setting</span>
                                    <span
                                      aria-hidden="true"
                                      className={`${
                                        !!m.state
                                          ? "translate-x-5"
                                          : "translate-x-0"
                                      }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                    />
                                  </Switch>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default variant;
