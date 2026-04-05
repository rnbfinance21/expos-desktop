import React from "react";
import MenuSection from "@/modules/stok/components/MenuSection";
import DefaultLayout from "@/layouts/DefaultLayout";

const stok = () => {
  return (
    <DefaultLayout>
      <div className="flex-grow w-full flex flex-row">
        <MenuSection />
      </div>
    </DefaultLayout>
  );
};

export default stok;
