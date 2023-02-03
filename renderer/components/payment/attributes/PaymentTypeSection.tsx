import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderType,
  getPaymentType,
} from "../../../features/paymentAttributeSlice";
import {
  autoSetBayar,
  getPayment,
  setBayar,
  setOrderType,
  setPaymentType,
} from "../../../features/paymentSlice";
import { PaymentType } from "../../../services/MasterService";
import ButtonAttributes from "../ButtonAttributes";

const PaymentTypeSection = () => {
  const dispatch = useDispatch();
  const listOrderType = useSelector(getOrderType);
  const listPaymentType = useSelector(getPaymentType);
  const { paymentType } = useSelector(getPayment);

  const setSelectedOrder = (id: number) => dispatch(setOrderType(id));

  const _onClick = (item: PaymentType) => {
    dispatch(setPaymentType(item.id));

    const findDefault = listOrderType.findIndex(
      (e) => e.id === item.kategori_order_id
    );

    if (findDefault !== -1) {
      const findOrder = listOrderType[findDefault];

      setSelectedOrder(findOrder.id);
    }

    if (item.id !== 1) {
      dispatch(autoSetBayar());
    } else {
      dispatch(setBayar(0));
    }
  };

  return (
    <div className="flex flex-col gap-2 px-4 py-2 cursor-pointer">
      <div>
        <p className="text-xs font-medium">Jenis Pembayaran</p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {listPaymentType.map((item) => {
          return (
            <ButtonAttributes
              key={`payment_attr_${item.id}`}
              label={item.name}
              isSelected={paymentType === item.id ? true : false}
              onClick={() => _onClick(item)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PaymentTypeSection;
