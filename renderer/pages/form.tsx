import React from "react";
import Detail from "../components/form/Detail";
import Header from "../components/form/Header";
import Main from "../components/form/Main";
import { withAuth } from "../HOC/withAuth";
import DefaultLayout from "../layouts/DefaultLayout";

const form = () => {
  return (
    <DefaultLayout title="Form" isBack>
      <div className="flex-grow w-full flex flex-row">
        <Main />
        <Detail />
      </div>
    </DefaultLayout>
  );
};

export default withAuth(form);
