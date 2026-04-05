import React from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import Main from "@/modules/payment/components/Main";
import Detail from "@/modules/payment/components/Detail";

const payment = () => {
  return (
    <DefaultLayout title="Pembayaran" isBack>
      <div className="flex-grow w-full flex flex-row">
        <Main />
        <Detail />
      </div>
    </DefaultLayout>
  );
};

export default payment;
