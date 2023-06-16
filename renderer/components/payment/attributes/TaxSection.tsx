import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListTax } from "../../../features/paymentAttributeSlice";
import {
  autoSetBayar,
  getPayment,
  setPaymentType,
  setTax,
} from "../../../features/paymentSlice";
import ButtonAttributes from "../ButtonAttributes";
import { useAuth } from "../../../hooks/AuthContext";

const TaxSection = () => {
  const dispatch = useDispatch();
  const listTax = useSelector(getListTax);
  const { outlet } = useAuth();
  const { tax, paymentType } = useSelector(getPayment);

  const _onClick = (val: number) => {
    dispatch(setTax(val));

    if (paymentType !== 1) {
      dispatch(autoSetBayar());
    }
  };

  useEffect(() => {
    dispatch(setTax(outlet.tax));
  }, []);

  return (
    <div className="flex flex-col gap-2 px-4 py-2 cursor-pointer">
      <div>
        <p className="text-xs font-medium">Pajak</p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {listTax.map((item) => {
          return (
            <ButtonAttributes
              key={`tax_attr_${item}`}
              label={`${item.toString()}%`}
              isSelected={tax === item ? true : false}
              onClick={() => _onClick(item)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TaxSection;
