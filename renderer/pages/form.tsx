import React from "react";
import { withAuth } from "@/HOC/withAuth";
import DefaultLayout from "@/layouts/DefaultLayout";
import Main from "@/modules/form/components/Main";
import Detail from "@/modules/form/components/Detail";

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
