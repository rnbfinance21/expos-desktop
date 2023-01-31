import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrder, setIdentity } from "../../../features/orderSlice";
import { ucwords } from "../../../utils/string";
import { Button } from "../../globals/buttons";
import { TextInput } from "../../globals/forms";
import { DynamicHeroIcon } from "../../globals/icons";
import { KeyboardWrapper } from "../../globals/keyboard";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { ErrorLabel } from "../../globals/labels";

type FormType = {
  name: string;
  table: string;
  bill: string;
};

const schema = yup
  .object({
    name: yup.string().required("Masukkan nama pelanggan"),
    table: yup.string().required("Masukkan nomor meja"),
  })
  .required();

const Customer = () => {
  const keyboard = useRef<any>(null);
  const dispatch = useDispatch();
  const { identity } = useSelector(getOrder);

  const [isOpen, setIsOpen] = useState(false);

  const [inputFocus, setInputFocus] = useState(0); // 0 = name, 1 = meja, 2 = bill

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: yupResolver(schema),
  });

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const onFocus = (index: number) => {
    switch (index) {
      case 0:
        keyboard.current?.setInput(getValues("name"));
        break;
      case 1:
        keyboard.current?.setInput(getValues("table"));
        break;
      case 2:
        keyboard.current?.setInput(getValues("bill"));
        break;

      default:
        break;
    }

    setInputFocus(index);
  };

  const onKeyboardChange = (value: string) => {
    switch (inputFocus) {
      case 0:
        setValue("name", value);
        break;
      case 1:
        setValue("table", value);
        break;
      case 2:
        setValue("bill", value);
        break;

      default:
        break;
    }
  };

  const onChangeInput = (index: number) => {
    let result = "";

    switch (index) {
      case 0:
        result = getValues("name");
        break;
      case 1:
        result = getValues("table");
        break;
      case 2:
        result = getValues("bill");
        break;

      default:
        break;
    }
    keyboard.current?.setInput(result);
  };

  const onSubmit = (data: FormType) => {
    dispatch(
      setIdentity({
        memberId: null,
        name: data.name,
        no_bill: data.bill,
        table: data.table,
      })
    );
    closeModal();
  };

  useEffect(() => {
    if (isOpen) {
      setValue("name", identity.name);
      setValue("table", identity.table);
      setValue("bill", identity.no_bill);
    }
  }, [isOpen]);

  return (
    <>
      <div className="flex flex-col sticky top-0 z-10 bg-white border-b">
        <div className="px-4 py-[7px] flex flex-row items-center">
          <DynamicHeroIcon icon="UserCircleIcon" className="h-10 w-10" />
          <div className="flex-1 flex flex-col ml-1">
            <p className="text-xs font-medium">
              {identity.name == "" ? "-" : ucwords(identity.name)}
            </p>
            <div className="flex flex-row gap-4">
              <div className="flex flex-row">
                <p className="text-xs font-thin">Table :</p>
                <p className="text-xs font-medium">
                  {identity.table == "" ? "-" : ucwords(identity.table)}
                </p>
              </div>
              <div className="flex flex-row">
                <p className="text-xs font-thin">Bill :</p>
                <p className="text-xs font-medium">
                  {identity.no_bill == "" || identity.no_bill == null
                    ? "-"
                    : ucwords(identity.no_bill)}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex flex-row border py-2 px-2 text-xs gap-2 rounded-md"
          >
            <DynamicHeroIcon icon="PencilSquareIcon" />
            Ubah
          </button>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
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
                <Dialog.Panel className="w-full max-w-4xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg text-center font-medium leading-6 text-gray-900"
                  >
                    Data Pelanggan
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="mb-4">
                          <p className="text-xs font-bold">Nama</p>
                          <TextInput
                            type="text"
                            placeholder="Nama"
                            className="text-left"
                            onClick={() => onFocus(0)}
                            {...register("name", {
                              onChange: () => {
                                onChangeInput(0);
                              },
                            })}
                          />
                          {errors.name ? (
                            <ErrorLabel text={errors.name.message} />
                          ) : null}
                        </div>
                        <div className="mb-4">
                          <p className="text-xs font-bold">Nomor Meja</p>
                          <TextInput
                            type="text"
                            placeholder="Nomor Meja"
                            className="text-left"
                            onClick={() => onFocus(1)}
                            {...register("table", {
                              onChange: () => {
                                onChangeInput(1);
                              },
                            })}
                          />
                          {errors.table ? (
                            <ErrorLabel text={errors.table.message} />
                          ) : null}
                        </div>
                        <div className="mb-4">
                          <p className="text-xs font-bold">Bill</p>
                          <TextInput
                            type="text"
                            placeholder="Bill"
                            className="text-left"
                            onClick={() => onFocus(2)}
                            {...register("bill", {
                              onChange: () => {
                                onChangeInput(2);
                              },
                            })}
                          />
                          {errors.bill ? (
                            <ErrorLabel text={errors.bill.message} />
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button type="submit" blok>
                        Simpan
                      </Button>
                    </div>
                  </form>

                  <div className="mt-4">
                    <KeyboardWrapper
                      keyboardRef={keyboard}
                      onChange={onKeyboardChange}
                    />
                  </div>

                  <div className="absolute top-5 right-6">
                    <div
                      onClick={closeModal}
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
    </>
  );
};

export default Customer;
