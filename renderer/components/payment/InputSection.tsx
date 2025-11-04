import React from "react";
import CurrencyInput from "react-currency-input-field";
import { useDispatch, useSelector } from "react-redux";
import {
  autoSetBayar,
  getPayment,
  getPaymentAllSumPrice,
  setBayar,
  setDiskon,
  setFocus,
  setKeterangan,
  setPotongan,
} from "../../features/paymentSlice";
import { numberFormat } from "../../utils/currency";
import ActionSection from "./ActionSection";

const InputSection = () => {
  const dispatch = useDispatch();
  const { diskon, potongan, bayar, paymentType, type, keterangan, tax } =
    useSelector(getPayment);


  const { total, kembalian, diskon_value, pajak_value, subtotal, sumPayment, sumSubtotalBox, sumSubtotalPajak } = useSelector(getPaymentAllSumPrice);

  const onFocus = (value: number) => dispatch(setFocus(value));



  const setInputBayar = (value: string) => {
    dispatch(setBayar(parseInt(value, 10)));
    if (paymentType !== 1) {
      dispatch(autoSetBayar());
    }
  };

  return (
    <div className="mb-4 space-y-2">
      <div className="grid grid-cols-2 gap-4">

        <div>
          <div className="w-full bg-white p-4 text-sm">
            {/* Subtotal */}
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-medium text-gray-800">Rp{numberFormat(sumSubtotalPajak)}</span>
            </div>



            {/* Pajak */}
            <div className="flex justify-between py-1 border-b border-gray-200 pb-2">
              <span className="text-gray-700">Pajak ({tax}%):</span>
              <span className="text-green-600 font-medium">Rp{numberFormat(pajak_value)}</span>
            </div>

            {/* Total Bayar */}
            <div className="flex justify-between py-1 font-semibold text-sm">
              <span className="text-gray-900">Subtotal:</span>
              <span className="text-gray-900">Rp{numberFormat(subtotal)}</span>
            </div>

            {/* Diskon */}
            <div className="flex justify-between py-1">
              <span className="text-gray-700">Diskon ({diskon}%):</span>
              <span className="text-red-600 font-medium">Rp{numberFormat(diskon_value)}</span>
            </div>

            {/* Potongan */}
            <div className="flex justify-between py-1">
              <span className="text-gray-700">Potongan:</span>
              <span className="text-red-600 font-medium">Rp{numberFormat(potongan)}</span>
            </div>

            {/* Total Bayar */}
            <div className="flex justify-between py-1 font-semibold text-sm border-t border-gray-200 mt-2 pt-2">
              <span className="text-gray-900">Total Bayar:</span>
              <span className="text-gray-900">Rp{numberFormat(total)}</span>
            </div>

            {/* Dibayar */}
            <div className="flex justify-between py-1">
              <span className="text-gray-700">Dibayar:</span>
              <span className="font-medium text-gray-800">Rp{numberFormat(bayar)}</span>
            </div>

            {/* Kembalian */}
            {/* <div className="flex justify-between py-1">
              <span className="text-gray-700">Kembalian:</span>
              <span className={`font-semibold ${kembalian < 0 ? 'text-red-500' : 'text-green-600'}`}>Rp{numberFormat(kembalian)}</span>
            </div> */}
          </div>
        </div>
        <div>
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
            className="flex-1 block w-full text-center text-[60px] focus:ring-red-500 focus:border-red-500 min-w-0 rounded-md border-gray-200"
          />
          <ActionSection />
        </div>
      </div>
      {/* <div className="w-full flex rounded-md shadow-sm">
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
      </div> */}
      {/* <div className="w-full flex rounded-md shadow-sm">
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
      </div> */}
    </div>
  );
};

export default InputSection;
