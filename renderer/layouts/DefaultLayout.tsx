import Head from "next/head";
import React, { Fragment, ReactNode } from "react";
import Header from "./Header";

interface DefaultLayoutProps {
  title?: string;
  children: ReactNode;
  isBack?: boolean;
}

const DefaultLayout = ({ title = "", children, isBack = false }: DefaultLayoutProps) => {
  return (
    <Fragment>
      <Head>
        <title>EXPOS {title === "" ? "" : `- ${title}`}</title>
      </Head>
      <div className="w-full h-screen flex flex-col">
        <Header isBack={isBack} />
        {children}
        {/* <div className="bg-white flex justify-start py-1 border-t px-4">
          <span className="text-xs font-bold">
            &copy; CV. Ramen Nikmat Barokah
          </span>
        </div> */}
      </div>
    </Fragment>
  );
};

export default DefaultLayout;
