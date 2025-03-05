import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setModalCustom,
    setModalUpdate,
    setSelectedMenuCustom,
    setSelectedOrder,
    setType,
} from "../../features/customSlice";
import { getOrder, Orders } from "../../features/orderSlice";
import PasscodeModal from "../modals/PasscodeModal";
import Customer from "./details/Customer";
import DetailAction from "./details/DetailAction";
import DetailOrderItem from "./details/DetailOrderItem";
import OrderUpdateModal from "./menu/OrderUpdateModal";
import Toast from "../../utils/toast";
import Swal from "../../utils/swal";

const Detail = () => {
    const dispatch = useDispatch();
    const { orders, type } = useSelector(getOrder);

    const [selectedData, setSelectedData] = useState<Orders>();
    const [openPasscodeModal, setOpenPasscodeModal] = useState(false);

    const _showModalUpdate = (item: Orders) => {
        setOpenPasscodeModal(false);
        // dispatch(setType("UPDATE"));
        // dispatch(setModalCustom(true));
        // dispatch(setSelectedMenuCustom(item.menu));
        // dispatch(setSelectedOrder(item));
        if (selectedData) {
            // const isCustom = selectedData.menu.variants.length > 0 ?? false;

            if (item.menu.custom_state) {
                dispatch(setType("UPDATE"));
                dispatch(setSelectedMenuCustom(selectedData.menu));
                dispatch(setSelectedOrder(selectedData));

                setTimeout(() => {
                    dispatch(setModalCustom(true));
                }, 500);
            } else {
                dispatch(setType("UPDATE"));
                dispatch(setSelectedMenuCustom(selectedData.menu));
                dispatch(setSelectedOrder(selectedData));

                setTimeout(() => {
                    dispatch(setModalUpdate(true));
                }, 500);
            }
        }
    };

    const _onClick = (item: Orders) => {
        setSelectedData(item);
        if (type === "ADD") {
            _showModalUpdate(item);
        } else if (
            (type === "VOID" && item.id_detail) ||
            (type === "UPDATE" && item.id_detail)
        ) {
            Swal.fire(
                "Peringatan",
                "Hanya bisa melakukan penambahan item, untuk perubahan atau hapus item menu hanya bisa dilakukan oleh Admin",
                "warning"
            );
        } else {
            setOpenPasscodeModal(true);
        }
    };

    const _onSuccessPasscode = () => {
        _showModalUpdate(selectedData);
    };

    return (
        <div className="w-[450px] h-full bg-white border-l">
            <div className="h-full w-full flex flex-col  bg-white">
                <Customer />
                <div className="flex-1 overflow-auto scrollbar-hide">
                    <div className="h-0">
                        {orders.map((item, key) => {
                            return (
                                <DetailOrderItem
                                    key={`detail_order_${item.id}_${key}`}
                                    data={item}
                                    onClick={() => _onClick(item)}
                                />
                            );
                        })}
                    </div>
                </div>
                <DetailAction />
            </div>
            <OrderUpdateModal />
            <PasscodeModal
                visible={openPasscodeModal}
                onClose={() => setOpenPasscodeModal(false)}
                onSuccess={_onSuccessPasscode}
            />
        </div>
    );
};

export default Detail;
