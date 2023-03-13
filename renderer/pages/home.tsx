import React, { useEffect } from "react";
import Detail from "../components/home/Detail";
import Main from "../components/home/Main";
import { withAuth } from "../HOC/withAuth";
import DefaultLayout from "../layouts/DefaultLayout";

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
