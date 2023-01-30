import React from "react";
import { withAuth } from "../HOC/withAuth";
import { useAuth } from "../hooks/AuthContext";
import DefaultLayout from "../layouts/DefaultLayout";

function Home() {
  const { user } = useAuth();

  console.log(user);

  return (
    <DefaultLayout title="Home">
      <p>haii</p>
    </DefaultLayout>
  );
}

export default withAuth(Home);
