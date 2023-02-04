import React from "react";
import Detail from "../components/report/Detail";
import Main from "../components/report/Main";
import DefaultLayout from "../layouts/DefaultLayout";

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
