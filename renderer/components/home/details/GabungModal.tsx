import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setRefetchOrder } from "../../../features/listOrderSlice";
import { useAuth } from "../../../hooks/AuthContext";
import OrderService, {
  GabungParams,
  Order,
  OrderDetail,
} from "../../../services/OrderService";
import { handleErrorAxios } from "../../../utils/errors";
import { ucwords } from "../../../utils/string";
import { Button } from "../../globals/buttons";
import { DynamicHeroIcon, Loading } from "../../globals/icons";
import MyModal from "../../globals/modal/MyModal";

interface GabungModalProps {
  show: boolean;
  onClose: () => void;
  data: OrderDetail;
}

const GabungModal = ({ show, onClose, data }: GabungModalProps) => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const [search, setSearch] = useState("");

  const [listData, setListData] = useState<Order[]>([]);

  const [selectedTransaction, setSelectedTransaction] = useState(0);

  const { isLoading, isRefetching, refetch } = useQuery(
    ["mergeOrder", token],
    () => OrderService.getOrderMerge(token, data.id),
    {
      enabled: false,
      onSuccess: (res) => {
        setListData(res.data);
      },
    }
  );

  const gabungMutation = useMutation(
    (params: GabungParams) => OrderService.gabungOrder(token, params),
    {
      onSuccess: (res) => {
        Swal.fire("Berhasil!", res.message, "success");
        dispatch(setRefetchOrder(true));
        onClose();
      },
      onError: handleErrorAxios,
    }
  );

  const _onSubmit = () => {
    gabungMutation.mutate({
      from: data.id,
      to: selectedTransaction,
    });
  };

  useEffect(() => {
    if (show) {
      refetch();
    }
  }, [show]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) {
        refetch();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <MyModal title="Gabung pesanan ke" show={show} onClose={onClose}>
      <div className="mt-4">
        <div className="relative">
          <input
            className="border text-sm pl-8 pr-4 py-2 rounded-md w-full "
            placeholder="Cari transaksi..."
            autoCapitalize="none"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                refetch();
              }
            }}
          />
          <DynamicHeroIcon
            icon="MagnifyingGlassIcon"
            className="absolute left-3 top-3"
          />
        </div>
        <div className="mt-4 h-[250px] overflow-auto">
          {isLoading ? (
            <div className="h-full w-full flex justify-center items-center">
              <Loading />
            </div>
          ) : (
            <>
              {listData.length === 0 ? (
                <div className="p-4 bg-gray-100 text-center">
                  <p className="text-sm font-bold text-gray-900">
                    Transaksi tidak ditemukan
                  </p>
                </div>
              ) : (
                <div className="h-0 space-y-2">
                  {listData.map((item) => {
                    return (
                      <div
                        onClick={() => {
                          if (selectedTransaction === item.id) {
                            setSelectedTransaction(0);
                          } else {
                            setSelectedTransaction(item.id);
                          }
                        }}
                        className="p-4 flex flex-row items-center border-b cursor-pointer hover:bg-gray-100"
                      >
                        <div className="w-11 h-11 bg-gray-100 border rounded-md overflow-hidden flex justify-center items-center">
                          <span className="font-bold text-gray-900">
                            {item.table}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col ml-4">
                          <p className="text-xs font-bold text-gray-900">
                            {ucwords(item.name)}
                          </p>
                          <div className="flex flex-row gap-2 items-center">
                            <p className="text-[10px] font-light text-gray-600">
                              #{data.kode_transaksi}
                            </p>
                          </div>
                        </div>
                        {item.id === selectedTransaction ? (
                          <DynamicHeroIcon
                            icon="CheckCircleIcon"
                            className="text-green-500 h-7 w-7"
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
        <div className="mt-4">
          <Button
            blok
            onClick={_onSubmit}
            isLoading={gabungMutation.isLoading}
            disabled={gabungMutation.isLoading}
          >
            Simpan
          </Button>
        </div>
      </div>
    </MyModal>
  );
};

export default GabungModal;
