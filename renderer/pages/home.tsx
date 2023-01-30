import React from "react";
import Detail from "../components/home/Detail";
import Header from "../components/home/Header";
import Main from "../components/home/Main";
import OrderItem from "../components/home/OrderItem";
import { withAuth } from "../HOC/withAuth";
import { useAuth } from "../hooks/AuthContext";
import DefaultLayout from "../layouts/DefaultLayout";

function Home() {
  const { user } = useAuth();

  console.log(user);

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
