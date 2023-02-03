import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import {
  setCash,
  setOrder,
  setPayment,
  setTax,
} from "../../features/paymentAttributeSlice";
import { useAuth } from "../../hooks/AuthContext";
import MasterService from "../../services/MasterService";
import { Loading } from "../globals/icons";
import ActionSection from "./ActionSection";
import AttributeSection from "./AttributeSection";
import InputSection from "./InputSection";

const Detail = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();

  const { isLoading, refetch } = useQuery(
    ["payment_attributes", token],
    () => MasterService.getAttributePayment(token),
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
            <ActionSection />
          </div>
        </>
      )}
    </div>
  );
};

export default Detail;
