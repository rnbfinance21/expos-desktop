import React from "react";
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
        {/* <div className="w-[400px] h-full bg-white border-l">
        <p>haii</p>
      </div> */}
      </div>
    </DefaultLayout>
  );
}

export default withAuth(Home);
