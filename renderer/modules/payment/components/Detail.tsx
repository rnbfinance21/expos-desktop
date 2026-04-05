import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  setCash,
  setOrder,
  setPayment,
  setTax,
} from "@/features/paymentAttributeSlice";
import {
  autoSetBayar,
  getPayment,
  setTax as setInputTax,
} from "@/features/paymentSlice";
import { useAuth } from "@/hooks/AuthContext";
import { getAttributePayment } from "@/modules/payment/api";
import { Loading } from "@/components/globals/icons";
import ActionSection from "@/modules/payment/components/ActionSection";
import AttributeSection from "@/modules/payment/components/AttributeSection";
import InputSection from "@/modules/payment/components/InputSection";

const Detail = () => {
  const dispatch = useDispatch();
  const { token, outlet } = useAuth();
  const { paymentType, orderType } = useSelector(getPayment);
  const outletTax =
    typeof outlet?.tax === "number" && !Number.isNaN(outlet.tax)
      ? outlet.tax
      : null;

  const { isLoading, refetch } = useQuery(
    ["payment_attributes", token],
    () => getAttributePayment(token),
    {
      onSuccess: (res) => {
        const { order, payment, cash, tax } = res.data;

        dispatch(setOrder(order));
        dispatch(setPayment(payment));
        dispatch(setTax(tax));
        dispatch(setCash(cash));
      },
    }
  );

  useEffect(() => {
    if (orderType !== 1) {
      dispatch(setInputTax(0));
    } else if (outletTax !== null) {
      dispatch(setInputTax(outletTax));
    }

    if (paymentType !== 1) {
      dispatch(autoSetBayar());
    }
  }, [dispatch, orderType, outletTax, paymentType]);

  return (
    <div className="flex-1 flex flex-col">
      {isLoading ? (
        <div className="flex flex-1 h-full w-full justify-center items-center">
          <Loading />
        </div>
      ) : (
        <>
          <AttributeSection />
          <div className="px-4 pb-4 border-t pt-2">
            <InputSection />
            {/* <ActionSection /> */}
          </div>
        </>
      )}
    </div>
  );
};

export default Detail;
