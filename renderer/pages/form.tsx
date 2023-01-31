import React from "react";
import Header from "../components/form/Header";
import Main from "../components/form/Main";
import { withAuth } from "../HOC/withAuth";
import DefaultLayout from "../layouts/DefaultLayout";

const form = () => {
  return (
    <DefaultLayout title="Form">
      <div className="flex-grow w-full flex flex-row">
        <Main />
        <div className="w-[500px] h-full bg-white border-l">
          <p>haii</p>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default withAuth(form);
