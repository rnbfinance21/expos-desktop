import Head from "next/head";
import React, { Fragment, ReactNode } from "react";
import { DynamicHeroIcon } from "../components/globals/icons";
import Header from "./Header";

interface DefaultLayoutProps {
  title?: string;
  children: ReactNode;
}

const DefaultLayout = ({ title, children }: DefaultLayoutProps) => {
  return (
    <Fragment>
      <Head>
        <title>EXPOS {title === "" ? "" : `- ${title}`}</title>
      </Head>
      <div className="w-full h-screen flex flex-col">
        <Header />
        {children}
        <div className="bg-white flex justify-center py-1 border-t">
          <span className="text-xs font-bold">
            &copy; CV. Ramen Nikmat Barokah
          </span>
        </div>
      </div>
    </Fragment>
  );
};

DefaultLayout.defaultProps = {
  title: "",
};

export default DefaultLayout;
