import React from "react";
import Main from "@/modules/report/components/Main";
import Detail from "@/modules/report/components/Detail";
import DefaultLayout from "@/layouts/DefaultLayout";

const report = () => {
  return (
    <DefaultLayout title="Report">
      <div className="flex-grow w-full flex flex-row">
        <Main />
        <Detail />
      </div>
    </DefaultLayout>
  );
};

export default report;
