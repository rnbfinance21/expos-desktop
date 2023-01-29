import React, { Fragment } from "react";
import Head from "next/head";
import Link from "next/link";
import { withAuth } from "../HOC/withAuth";
import { useAuth } from "../hooks/AuthContext";
import DefaultLayout from "../layouts/DefaultLayout";
import { DynamicHeroIcon } from "../components/globals/icons";

function Home() {
  const { user } = useAuth();

  console.log(user);

  return (
    <DefaultLayout>
      <p>haii</p>
    </DefaultLayout>
  );
}

export default withAuth(Home);
