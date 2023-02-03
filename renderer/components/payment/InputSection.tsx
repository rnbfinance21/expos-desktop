import React from "react";
import CurrencyInput from "react-currency-input-field";
import { useDispatch, useSelector } from "react-redux";
import {
  getPayment,
  getPaymentAllSumPrice,
  setBayar,
  setDiskon,
  setFocus,
  setPotongan,
} from "../../features/paymentSlice";

const InputSection = () => {
  const dispatch = useDispatch();
  const { diskon, potongan, bayar } = useSelector(getPayment);

  const { total, kembalian } = useSelector(getPaymentAllSumPrice);

  const onFocus = (value: number) => dispatch(setFocus(value));

  const setInputDiskon = (value: string) =>
    dispatch(setDiskon(parseInt(value, 10)));

  const setInputPotongan = (value: string) =>
    dispatch(setPotongan(parseInt(value, 10)));

  const setInputBayar = (value: string) =>
    dispatch(setBayar(parseInt(value, 10)));

  return (
    <div className="mb-4 space-y-2">
      <div className="w-full flex rounded-md shadow-sm">
        <span className="inline-flex pl-2 items-center w-32 rounded-l-md border border-r-0  bg-gray-50 text-gray-800 font-semibold sm:text-xs">
          Diskon
        </span>
        <CurrencyInput
          defaultValue={0}
          allowNegativeValue={false}
          decimalSeparator=","
          groupSeparator="."
          disableGroupSeparators
          maxLength={3}
          max={100}
          onValueChange={(value) => {
            if (value) {
              setInputDiskon(value);
            } else {
              setInputDiskon("0");
            }
          }}
          value={diskon.toString()}
          onClick={() => onFocus(1)}
          className="flex-1 block w-full text-right focus:ring-red-500 focus:border-red-500 min-w-0 rounded-none rounded-r-md sm:text-xs border-gray-200"
        />
      </div>
      <div className="w-full flex rounded-md shadow-sm">
        <span className="inline-flex pl-2 items-center w-32 rounded-l-md border border-r-0  bg-gray-50 text-gray-800 font-semibold sm:text-xs">
          Potongan
        </span>
        <CurrencyInput
          defaultValue={0}
          allowNegativeValue={false}
          decimalSeparator=","
          groupSeparator="."
          onValueChange={(value) => {
            if (value) {
              setInputPotongan(value);
            } else {
              setInputPotongan("0");
            }
          }}
          value={potongan.toString()}
          onClick={() => onFocus(2)}
          className="flex-1 block w-full text-right focus:ring-red-500 focus:border-red-500 min-w-0 rounded-none rounded-r-md sm:text-xs border-gray-200"
        />
      </div>
      <div className="w-full flex rounded-md shadow-sm">
        <span className="inline-flex pl-2 items-center w-32 rounded-l-md border border-r-0  bg-gray-50 text-gray-800 font-semibold sm:text-xs">
          Bayar
        </span>
        <CurrencyInput
          allowDecimals={false}
          defaultValue={0}
          decimalSeparator=","
          groupSeparator="."
          onValueChange={(value) => {
            if (value) {
              setInputBayar(value);
            } else {
              setInputBayar("0");
            }
          }}
          value={bayar}
          onClick={() => onFocus(3)}
          className="flex-1 block w-full text-right focus:ring-red-500 focus:border-red-500 min-w-0 rounded-none rounded-r-md sm:text-xs border-gray-200"
        />
      </div>
      <div className="w-full flex rounded-md shadow-sm">
        <span className="inline-flex pl-2 items-center w-32 rounded-l-md border border-r-0  bg-gray-50 text-gray-800 font-semibold sm:text-xs">
          Total
        </span>
        <CurrencyInput
          allowDecimals={false}
          defaultValue={0}
          decimalSeparator=","
          groupSeparator="."
          value={total}
          readOnly
          className="flex-1 block w-full text-right focus:ring-red-500 focus:border-red-500 min-w-0 rounded-none rounded-r-md sm:text-xs border-gray-200"
        />
      </div>
      <div className="w-full flex rounded-md shadow-sm">
        <span className="inline-flex pl-2 items-center w-32 rounded-l-md border border-r-0  bg-gray-50 text-gray-800 font-semibold sm:text-xs">
          Kembalian
        </span>
        <CurrencyInput
          allowDecimals={false}
          defaultValue={0}
          decimalSeparator=","
          groupSeparator="."
          value={kembalian}
          readOnly
          className="flex-1 block w-full text-right focus:ring-red-500 focus:border-red-500 min-w-0 rounded-none rounded-r-md sm:text-xs border-gray-200"
        />
      </div>
    </div>
  );
};

export default InputSection;
