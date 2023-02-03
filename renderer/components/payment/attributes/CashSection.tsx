import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListCash } from "../../../features/paymentAttributeSlice";
import { setCash } from "../../../features/paymentSlice";
import { numberFormat } from "../../../utils/currency";
import ButtonAttributes from "../ButtonAttributes";

const CashSection = () => {
  const dispatch = useDispatch();
  const listCash = useSelector(getListCash);

  const _onClick = (val: number) => {
    dispatch(setCash(val));
  };

  return (
    <div className="flex flex-col gap-2 px-4 py-2 cursor-pointer">
      <div>
        <p className="text-xs font-medium">Bayar</p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {listCash.map((item) => {
          return (
            <ButtonAttributes
              key={`cash_attr_${item}`}
              label={numberFormat(item, 0)}
              onClick={() => _onClick(item)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CashSection;
