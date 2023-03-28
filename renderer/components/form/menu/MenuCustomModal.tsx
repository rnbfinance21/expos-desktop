import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  getCustom,
  getCustomType,
  getSelectedMenuCustom,
  getSelectedOrder,
  resetModalCustom,
  setModalCustom,
} from "../../../features/customSlice";
import {
  addItemCustom,
  deleteItem,
  setLogDelete,
  setLogUpdate,
  updateItemCustom,
} from "../../../features/orderSlice";
import { Menu, Variant, VariantOption } from "../../../services/MenuService";
import { classNames, ucwords } from "../../../utils/string";
import { Button } from "../../globals/buttons";
import { DynamicHeroIcon } from "../../globals/icons";
import OptionItem from "./OptionItem";

type SelectVariantType = {
  id: number;
  name: string;
  data: {
    option_id: number;
    price: number;
    category_id: number;
    category_name: string;
    option_name: string;
  }[];
};

const MenuCustomModal = () => {
  const dispatch = useDispatch();
  const { type, selectedMenuCustom, selectedOrder, openModalCustom } =
    useSelector(getCustom);

  const [selectVariants, setSelectVariants] = useState<SelectVariantType[]>([]);
  const [qty, setQty] = useState("1");
  const [diskon, setDiskon] = useState("0");
  const [price, setPrice] = useState(selectedMenuCustom?.price ?? 0);
  const [notes, setNotes] = useState("");

  const [selectTypeOrder, setSelectTypeOrder] = useState(1);

  const _closeModal = () => dispatch(setModalCustom(false));

  const onChangeVariants = (
    type: number,
    item: Variant,
    val: VariantOption,
    checked: boolean
  ) => {
    const find = selectVariants.findIndex(
      (findItem) => findItem.id === item.id
    );

    switch (type) {
      case 2:
        if (checked) {
          if (find === -1) {
            setSelectVariants((prevVariants) => [
              ...prevVariants,
              {
                id: item.id,
                name: item.name,
                data: [
                  {
                    option_id: val.id,
                    price: val.price,
                    category_id: item.id,
                    category_name: ucwords(item.name),
                    option_name: ucwords(val.name),
                  },
                ],
              },
            ]);
          } else {
            setSelectVariants((prevVariants) =>
              prevVariants.map((variant, index) => {
                if (index === find) {
                  const data = [
                    {
                      option_id: val.id,
                      price: val.price,
                      category_id: item.id,
                      category_name: ucwords(item.name),
                      option_name: ucwords(val.name),
                    },
                  ];
                  // return object with updated count values
                  return { ...variant, data };
                }
                return variant;
              })
            );
          }
        } else {
          setSelectVariants((prevVariants) =>
            prevVariants.map((variant, index) => {
              if (index === find) {
                let tmpData = variant.data;

                tmpData.splice(
                  tmpData.findIndex((ed) => ed.option_id === val.id),
                  1
                );
                // return object with updated count values
                return { ...variant, data: tmpData };
              }
              return variant;
            })
          );
        }
        break;
      default:
        if (find === -1) {
          setSelectVariants((prev) => [
            ...prev,
            {
              id: item.id,
              name: item.name,
              data: [
                {
                  option_id: val.id,
                  price: val.price,
                  category_id: item.id,
                  category_name: ucwords(item.name),
                  option_name: ucwords(val.name),
                },
              ],
            },
          ]);
        } else {
          setSelectVariants((prevVariants) =>
            prevVariants.map((variant, index) => {
              if (index === find) {
                const data = [
                  {
                    option_id: val.id,
                    price: val.price,
                    category_id: item.id,
                    category_name: ucwords(item.name),
                    option_name: ucwords(val.name),
                  },
                ];
                // return object with updated count values
                return { ...variant, data };
              }
              return variant;
            })
          );
        }
        break;
    }
  };

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

  const validate = () => {
    // validation
    let isValid = true;
    let message = "";

    if (selectedMenuCustom) {
      let rules: {
        id: number;
        name: string;
        isRequired: boolean;
      }[] = [];

      selectedMenuCustom.variants.forEach((element) => {
        rules.push({
          id: element.id,
          name: element.name,
          isRequired: element.required_state ? true : false,
        });
      });

      rules.every((element) => {
        if (element.isRequired) {
          let find = selectVariants.findIndex((e) => e.id === element.id);

          if (find === -1) {
            message = `Pilih ${element.name} untuk pesanan Anda`;
            isValid = false;
            return false;
          } else if (find !== -1 && selectVariants[find].data.length < 1) {
            message = `Pilih ${element.name} untuk pesanan Anda`;
            isValid = false;
            return false;
          } else {
            isValid = true;
          }
        }

        return true;
      });
    }
    return { isValid, message };
  };

  const _getSumPrice = () => {
    const price = selectedMenuCustom?.price ?? 0;

    const sumVariant = selectVariants.reduce((accumulator, item) => {
      return (
        accumulator +
        item.data.reduce((acc, itm) => {
          return acc + itm.price;
        }, 0)
      );
    }, 0);

    return price + sumVariant;
  };

  const _onSubmit = () => {
    if (selectedMenuCustom) {
      const validation = validate();

      if (!validation.isValid) {
        Swal.fire("Oooppss", validation.message, "warning");
      } else {
        let variantParams: {
          option_id: number;
          price: number;
          category_id: number;
          category_name: string;
          option_name: string;
        }[] = [];

        selectVariants.forEach((element) => {
          return element.data.forEach((vr) => {
            variantParams.push(vr);
          });
        });

        if (type === "ADD") {
          dispatch(
            addItemCustom({
              id: selectedMenuCustom?.id,
              box: 0,
              margin: 0,
              margin_stat: selectedMenuCustom?.box_state,
              diskon: parseInt(diskon, 10),
              notes,
              pajak_stat: selectedMenuCustom?.tax_state,
              price:
                selectedMenuCustom.price +
                variantParams.reduce((acc, itm) => {
                  return acc + itm.price;
                }, 0),
              qty: parseInt(qty, 10),
              type_order: selectTypeOrder,
              variants: variantParams,
              menu: selectedMenuCustom,
            })
          );
        } else {
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
                  notes,
                  pajak_stat: selectedMenuCustom?.tax_state,
                  price:
                    selectedMenuCustom.price +
                    variantParams.reduce((acc, itm) => {
                      return acc + itm.price;
                    }, 0),
                  qty: parseInt(qty, 10),
                  type_order: selectTypeOrder,
                  variants: variantParams,
                  menu: selectedMenuCustom,
                },
              })
            );
          }

          dispatch(setLogUpdate(selectedOrder.id_detail));
        }

        _closeModal();
      }
    }
  };

  const _onDelete = () => {
    dispatch(deleteItem(selectedOrder));
    if (selectedOrder) {
      dispatch(setLogDelete(selectedOrder.id_detail));
    }

    _closeModal();
  };

  useEffect(() => {
    setPrice(_getSumPrice());
  }, [JSON.stringify(selectVariants), qty]);

  useEffect(() => {
    if (!openModalCustom) {
      setSelectVariants([]);
      setQty("1");
      setDiskon("0");
      setPrice(0);
      setNotes("");
      setSelectTypeOrder(1);
    } else {
      if (type === "UPDATE" && selectedOrder) {
        let resultVariant: SelectVariantType[] = [];

        selectedOrder?.variants.forEach((e) => {
          let find = resultVariant.findIndex((f) => f.id === e.category_id);

          if (find === -1) {
            resultVariant.push({
              id: e.category_id,
              name: e.category_name,
              data: [
                {
                  option_id: e.option_id,
                  option_name: e.option_name,
                  price: e.price,
                  category_id: e.category_id,
                  category_name: e.category_name,
                },
              ],
            });
          } else {
            let tmp = resultVariant;

            let tmpData = tmp[find].data;

            if (tmpData) {
              tmpData.push({
                option_id: e.option_id,
                option_name: e.option_name,
                price: e.price,
                category_id: e.category_id,
                category_name: e.category_name,
              });

              tmp[find] = {
                id: e.category_id,
                name: e.category_name,
                data: tmpData,
              };
            }

            resultVariant = tmp;
          }
        });

        setSelectVariants(resultVariant);
        setNotes(selectedOrder?.notes ?? "");
        setPrice(selectedOrder?.price);
        setQty(selectedOrder?.qty.toString());
        setDiskon(selectedOrder.diskon.toString());
        setSelectTypeOrder(selectedOrder.type_order);
      }
    }
  }, [openModalCustom]);

  return (
    <Transition appear show={openModalCustom} as={Fragment}>
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
                  Custom Pesanan
                </Dialog.Title>

                <div className="mt-4">
                  {selectedMenuCustom?.variants.map((item) => {
                    return (
                      <div key={`modal_custom_${item.id}`} className="mb-2">
                        <div className="pb-2 border-b border-dashed">
                          <p className="text-sm">{ucwords(item.name)}</p>
                          <p className="text-[10px] text-gray-900">
                            {item.required_state ? "Harus Pilih" : "Opsional"}
                          </p>
                        </div>
                        <div
                          className={`grid ${
                            item.options.length > 5
                              ? "grid-cols-5"
                              : `grid-cols-${item.options.length}`
                          } gap-2`}
                        >
                          {item.options.map((val) => {
                            let checked =
                              selectVariants.findIndex(
                                (e) =>
                                  e.id === item.id &&
                                  e.data.findIndex(
                                    (f) => f.option_id === val.id
                                  ) !== -1
                              ) === -1
                                ? false
                                : true;

                            return (
                              <div
                                key={`option_${item.max_select}_${val.id}`}
                                onClick={() =>
                                  onChangeVariants(
                                    item.type,
                                    item,
                                    val,
                                    !checked
                                  )
                                }
                                className={classNames(
                                  "py-1 px-1 border border-red-500 text-red-600 rounded cursor-pointer flex justify-center items-center",
                                  checked ? "bg-red-500 text-white" : ""
                                )}
                              >
                                <p className="text-xs text-center">
                                  {ucwords(val.name)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  <div className="mb-2">
                    <div className="pb-2 border-b border-dashed">
                      <p className="text-sm">Jenis Order</p>
                      <p className="text-[10px] text-gray-900">Harus Pilih</p>
                    </div>
                    <div className={`grid grid-cols-2 gap-2`}>
                      {[
                        {
                          label: "Makan Ditempat",
                          value: 1,
                        },
                        {
                          label: "Take Awal / Dibungkus",
                          value: 2,
                        },
                      ].map((item) => {
                        return (
                          <div
                            key={`type_order_${item.value}`}
                            onClick={() => setSelectTypeOrder(item.value)}
                            className={classNames(
                              "py-1 px-1 border border-red-500 text-red-600 rounded cursor-pointer flex justify-center items-center",
                              item.value === selectTypeOrder
                                ? "bg-red-500 text-white"
                                : ""
                            )}
                          >
                            <p className="text-xs text-center">
                              {ucwords(item.label)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="pb-2 bg-white">
                    <div className="pb-2 border-b border-dashed">
                      <p className="text-xs font-medium">Catatan</p>
                      <p className="text-[10px] font-bold text-red-500">
                        Opsional
                      </p>
                    </div>
                    <div className="mt-2">
                      <textarea
                        id="notes"
                        name="notes"
                        rows={2}
                        className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-xs resize-none"
                        placeholder="Contoh: banyakin porsinya, ya"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
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

                <div
                  className={`mt-4 grid ${
                    type === "ADD" ? "grid-cols-1" : "grid-cols-2"
                  } gap-4`}
                >
                  <Button onClick={_onSubmit} type="submit" blok>
                    Simpan
                  </Button>
                  {type === "UPDATE" ? (
                    <Button
                      onClick={_onDelete}
                      type="submit"
                      blok
                      className="bg-red-500 text-white"
                    >
                      Hapus
                    </Button>
                  ) : null}
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

export default MenuCustomModal;
