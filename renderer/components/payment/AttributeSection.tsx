import React from "react";
import CashSection from "./attributes/CashSection";
import OrderTypeSection from "./attributes/OrderTypeSection";
import PaymentTypeSection from "./attributes/PaymentTypeSection";
import TaxSection from "./attributes/TaxSection";
import CurrencyInput from "react-currency-input-field";
import { useDispatch, useSelector } from "react-redux";
import { autoSetBayar, getPayment, setDiskon, setFocus, setKeterangan, setPotongan } from "../../features/paymentSlice";

const AttributeSection = () => {

  const dispatch = useDispatch();
  const { diskon, potongan, paymentType, type, keterangan } =
    useSelector(getPayment);

  const setInputDiskon = (value: string) => {
    dispatch(setDiskon(parseInt(value, 10)));
    if (paymentType !== 1) {
      dispatch(autoSetBayar());
    }
  };
  const setInputPotongan = (value: string) => {
    dispatch(setPotongan(parseInt(value, 10)));
    if (paymentType !== 1) {
      dispatch(autoSetBayar());
    }
  };

  const onFocus = (value: number) => dispatch(setFocus(value));


  return (
    <div className="flex-1 flex flex-col overflow-auto scrollbar-hide">
      <div className="h-0">
        <OrderTypeSection />
        <PaymentTypeSection />
        <TaxSection />
        <CashSection />
        <div className="flex flex-col gap-2 px-4 py-2 cursor-pointer">
          <div>
            <p className="text-xs font-medium">Diskon</p>
          </div>
          <div className="w-full flex rounded-md shadow-sm">
            <span className="inline-flex pl-2 items-center w-10 rounded-l-md border border-r-0  bg-gray-50 text-gray-800 font-semibold sm:text-xs">
              Rp
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
              className="flex-1 block w-full text-left focus:ring-red-500 focus:border-red-500 min-w-0 rounded-none rounded-r-md sm:text-xs border-gray-200"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 px-4 py-2 cursor-pointer">
          <div>
            <p className="text-xs font-medium">Potongan</p>
          </div>
          <div className="w-full flex rounded-md shadow-sm">
            <span className="inline-flex pl-2 items-center w-10 rounded-l-md border border-r-0  bg-gray-50 text-gray-800 font-semibold sm:text-xs">
              Rp
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
              className="flex-1 block w-full text-left focus:ring-red-500 focus:border-red-500 min-w-0 rounded-none rounded-r-md sm:text-xs border-gray-200"
            />
          </div>

        </div>
        {type === "VOID" ? (
          <div className="flex flex-col gap-2 px-4 py-2 cursor-pointer">
            <div>
              <p className="text-xs font-medium">Keterangan</p>
            </div>
            <div className="w-full flex rounded-md shadow-sm">
              {/* <span className="inline-flex pl-2 items-center w-32 rounded-l-md border border-r-0  bg-gray-50 text-gray-800 font-semibold sm:text-xs">
              Keterangan
            </span> */}
              <textarea name="keterangan"
                value={keterangan}
                onChange={(e) => dispatch(setKeterangan(e.currentTarget.value))}
                placeholder="Keterangan void"
                rows={5}
                className="flex-1 block w-full text-left focus:ring-red-500 focus:border-red-500 min-w-0 rounded-md sm:text-xs border-gray-200"
              />

            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AttributeSection;
