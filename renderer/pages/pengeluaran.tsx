import React from "react";
import Main from "@/modules/pengeluaran/components/Main";
import DefaultLayout from "@/layouts/DefaultLayout";

const pengeluaran = () => {
  return (
    <DefaultLayout title="Pengeluaran">
      <div className="flex-grow w-full flex flex-row">
        <Main />
      </div>
    </DefaultLayout>
  );
};

export default pengeluaran;
