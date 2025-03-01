import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getOrderType,
    getPaymentType,
} from "../../../features/paymentAttributeSlice";
import {
    autoSetBayar,
    getPayment,
    resetItemCustom,
    resetMargin,
    setBayar,
    setChangeState,
    setMargin,
    setOrderType,
    setPaymentType,
} from "../../../features/paymentSlice";
import { OrderType } from "../../../services/MasterService";
import ButtonAttributes from "../ButtonAttributes";

const OrderTypeSection = () => {
    const dispatch = useDispatch();
    const listOrderType = useSelector(getOrderType);
    const listPaymentType = useSelector(getPaymentType);
    const { orderType } = useSelector(getPayment);

    const setSelectedPayment = (val: number | null) =>
        dispatch(setPaymentType(val));

    const _onClick = (item: OrderType) => {
        dispatch(setOrderType(item.id));

        if (item.margin !== 0) {
            dispatch(resetItemCustom());
            dispatch(
                setMargin({
                    margin: item.margin,
                    box: item.box,
                })
            );
        } else {
            dispatch(resetMargin());
            dispatch(resetItemCustom());
        }

        const findDefault = listPaymentType.findIndex(
            (e) => e.kategori_order_id === item.id
        );

        if (findDefault !== -1) {
            const findPayment = listPaymentType[findDefault];

            setSelectedPayment(findPayment.id);
            dispatch(autoSetBayar());
        } else {
            setSelectedPayment(null);
            dispatch(setBayar(0));
        }

        dispatch(setChangeState(!!item.change_state));
    };

    return (
        <div className="flex flex-col gap-2 px-4 py-2 cursor-pointer">
            <div>
                <p className="text-xs font-medium">Jenis Order</p>
            </div>
            <div className="grid grid-cols-5 gap-2">
                {listOrderType.map((item) => {
                    return (
                        <ButtonAttributes
                            key={`order_attr_${item.id}`}
                            label={item.name}
                            isSelected={orderType === item.id ? true : false}
                            onClick={() => _onClick(item)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTypeSection;
