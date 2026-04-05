import React from "react";
import { withAuth } from "@/HOC/withAuth";
import DefaultLayout from "@/layouts/DefaultLayout";
import Main from "@/modules/home/components/Main";
import Detail from "@/modules/home/components/Detail";

function Home() {
  return (
    <DefaultLayout title="Home">
      <div className="flex-grow w-full flex flex-row">
        <Main />
        <Detail />
      </div>
    </DefaultLayout>
  );
}

export default withAuth(Home);
