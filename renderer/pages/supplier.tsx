import React from "react";
import Main from "../components/supplier/Main";
import DefaultLayout from "../layouts/DefaultLayout";

const SupplierPage = () => {
  return (
    <DefaultLayout title="Supplier">
      <div className="flex-grow w-full flex flex-row">
        <Main />
      </div>
    </DefaultLayout>
  );
};

export default SupplierPage;
