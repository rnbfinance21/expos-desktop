/* eslint-disable react/require-default-props */
import { Dialog, Transition } from "@headlessui/react";
import { AxiosError } from "axios";
import React, { Fragment, useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useMutation } from "react-query";

import { useAuth } from "../../hooks/AuthContext";
import AuthService, { UangKasParams } from "../../services/AuthService";
import { handleErrorAxios } from "../../utils/errors";
import { Button } from "../globals/buttons";
import { Numpad } from "../globals/keyboard";

type UangKasModalProps = {
  visible: boolean;
  onError: (error: string) => void;
  onSuccess: () => void;
  openState?: number;
};

const UangKasModal = ({ visible, onSuccess, openState }: UangKasModalProps) => {
  const { token } = useAuth();
  const [inputUangKas, setInputUangKas] = useState("");

  const uangKasMutation = useMutation(
    (params: UangKasParams) => AuthService.uangKas(token, params),
    {
      onSuccess: () => {
        onSuccess();
      },
      onError: handleErrorAxios,
    }
  );

  const onSubmit = () => {
    const params: UangKasParams = {
      kas: parseInt(inputUangKas, 10),
    };

    if (openState !== undefined) {
      params.state = openState;
    }

    uangKasMutation.mutate(params);
  };

  useEffect(() => {
    setInputUangKas("0");
  }, [visible]);

  return (
    <Transition appear show={visible} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg text-center font-medium leading-6 text-gray-900"
                >
                  Uang Kas / Laci
                </Dialog.Title>
                <div className="mt-4">
                  <CurrencyInput
                    allowDecimals={false}
                    defaultValue={0}
                    decimalSeparator=","
                    groupSeparator="."
                    onValueChange={(value) => {
                      if (value) {
                        setInputUangKas(value);
                      } else {
                        setInputUangKas("0");
                      }
                    }}
                    value={inputUangKas}
                    className="flex-1 block w-full text-center focus:ring-red-500 focus:border-red-500 min-w-0 rounded-none rounded-r-md sm:text-base border-gray-200"
                  />
                  <div className="mt-4">
                    <Numpad value={inputUangKas} onChange={setInputUangKas} />
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    type="button"
                    className="text-xs"
                    blok
                    onClick={onSubmit}
                    isLoading={uangKasMutation.isLoading}
                    disabled={uangKasMutation.isLoading}
                  >
                    Simpan
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UangKasModal;
