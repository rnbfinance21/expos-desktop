import React from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import VariantSection from "@/modules/stok/components/VariantSection";

const variant = () => {
  return (
    <DefaultLayout title="Stok Variant">
      <div className="flex-grow w-full flex flex-col">
        <div className="flex-1 flex flex-row bg-gray-100">
          <VariantSection />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default variant;
