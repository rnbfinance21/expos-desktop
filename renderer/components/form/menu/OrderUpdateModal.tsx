import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustom, setModalUpdate } from "../../../features/customSlice";
import { deleteItem, updateItemCustom } from "../../../features/orderSlice";
import { Button } from "../../globals/buttons";
import { DynamicHeroIcon } from "../../globals/icons";

const OrderUpdateModal = () => {
  const dispatch = useDispatch();
  const { openModalUpdate, selectedOrder, selectedMenuCustom } =
    useSelector(getCustom);

  const [qty, setQty] = useState("1");
  const [diskon, setDiskon] = useState("0");

  const _closeModal = () => dispatch(setModalUpdate(false));

  const increment = (index: number) => {
    if (index === 1) {
      setQty((prev) => (parseInt(prev, 10) + 1).toString());
    } else if (index === 2) {
      setDiskon((prev) => (parseInt(prev, 10) + 1).toString());
    }
  };

  const decrement = (index: number) => {
    if (index === 1) {
      if (qty !== "1") {
        setQty((prev) => (parseInt(prev, 10) - 1).toString());
      }
    } else if (index === 2) {
      if (diskon !== "0") {
        setDiskon((prev) => (parseInt(prev, 10) - 1).toString());
      }
    }
  };

  const _onSubmit = () => {
    if (selectedOrder) {
      dispatch(
        updateItemCustom({
          prev: selectedOrder,
          new: {
            id: selectedMenuCustom?.id,
            box: 0,
            margin: 0,
            margin_stat: selectedMenuCustom?.box_state,
            diskon: parseInt(diskon, 10),
            notes: null,
            pajak_stat: selectedMenuCustom?.tax_state,
            price: selectedOrder.price,
            qty: parseInt(qty, 10),
            variants: [],
            menu: selectedMenuCustom,
          },
        })
      );
    }

    _closeModal();
  };

  const _onDelete = () => {
    if (selectedOrder) {
      dispatch(deleteItem(selectedOrder));
    }

    _closeModal();
  };

  useEffect(() => {
    if (openModalUpdate && selectedOrder) {
      setQty(selectedOrder.qty.toString());
      setDiskon(selectedOrder.diskon.toString());
    }
  }, [openModalUpdate]);

  return (
    <Transition appear show={openModalUpdate} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg text-center font-medium leading-6 text-gray-900"
                >
                  Ubah Pesanan
                </Dialog.Title>

                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-medium">Jumlah</p>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span
                          onClick={() => decrement(1)}
                          className="cursor-pointer inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                        >
                          <DynamicHeroIcon icon="MinusIcon" />
                        </span>
                        <input
                          type="number"
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none focus:ring-red-500 focus:border-red-500 sm:text-xs border-gray-300"
                          placeholder="Jumlah"
                          value={qty}
                          onChange={(e) => setQty(e.currentTarget.value)}
                          maxLength={3}
                          min={1}
                        />
                        <span
                          onClick={() => increment(1)}
                          className="cursor-pointer inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                        >
                          <DynamicHeroIcon icon="PlusIcon" />
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium">Diskon</p>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span
                          onClick={() => decrement(2)}
                          className="cursor-pointer inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                        >
                          <DynamicHeroIcon icon="MinusIcon" />
                        </span>
                        <input
                          type="number"
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none focus:ring-red-500 focus:border-red-500 sm:text-xs border-gray-300"
                          placeholder="Diskon"
                          value={diskon}
                          onChange={(e) => setDiskon(e.currentTarget.value)}
                          maxLength={3}
                          min={0}
                        />
                        <span
                          onClick={() => increment(2)}
                          className="cursor-pointer inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                        >
                          <DynamicHeroIcon icon="PlusIcon" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Button onClick={_onSubmit} type="submit" blok>
                    Simpan
                  </Button>
                  <Button
                    onClick={_onDelete}
                    type="submit"
                    blok
                    className="bg-red-500 text-white"
                  >
                    Hapus
                  </Button>
                </div>

                <div className="absolute top-5 right-6">
                  <div
                    onClick={_closeModal}
                    className="border p-1 rounded-full cursor-pointer hover:bg-red-100"
                  >
                    <DynamicHeroIcon
                      icon="XMarkIcon"
                      className="h-5 w-5 hover:text-red-900"
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OrderUpdateModal;
