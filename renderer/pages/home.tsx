import React from "react";
import { withAuth } from "@/HOC/withAuth";
import DefaultLayout from "@/layouts/DefaultLayout";
import HomeScreen from "@/features/home/components/screen";

function Home() {
  return (
    <DefaultLayout title="Home">
      <HomeScreen />
    </DefaultLayout>
  );
}

export default withAuth(Home);
