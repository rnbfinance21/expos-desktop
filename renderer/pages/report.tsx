import React from "react";
import Main from "../components/report/Main";
import DefaultLayout from "../layouts/DefaultLayout";

const report = () => {
  return (
    <DefaultLayout title="Report">
      <div className="flex-grow w-full flex flex-row">
        <Main />
        <div className="w-[450px] bg-blue-300">
          <p>haii</p>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default report;
