import React from "react";
import CashSection from "./attributes/CashSection";
import OrderTypeSection from "./attributes/OrderTypeSection";
import PaymentTypeSection from "./attributes/PaymentTypeSection";
import TaxSection from "./attributes/TaxSection";

const AttributeSection = () => {
  return (
    <div className="flex-1 flex flex-col overflow-auto scrollbar-hide">
      <div className="h-0">
        <OrderTypeSection />
        <PaymentTypeSection />
        <TaxSection />
        <CashSection />
      </div>
    </div>
  );
};

export default AttributeSection;
