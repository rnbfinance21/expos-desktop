import Head from "next/head";
import React, { Fragment, ReactNode } from "react";
import { DynamicHeroIcon } from "../components/globals/icons";

interface DefaultLayoutProps {
  title?: string;
  children: ReactNode;
}

const DefaultLayout = ({ title, children }: DefaultLayoutProps) => {
  return (
    <Fragment>
      <Head>
        <title>EXPOS - {title === "" ? "" : `- ${title}`}</title>
      </Head>
      <div className="w-full h-screen">
        <div className="px-4 py-3 flex flex-row justify-between bg-white">
          <DynamicHeroIcon
            icon="Bars3BottomLeftIcon"
            className="h-[24px] w-[24px] text-gray-900"
          />
          <div className="flex flex-col">
            <p className="text-xs font-bold">Luthfi Pratama</p>
            <p className="text-[10px] font-thin">Sensei Ramen Ciwastra</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

DefaultLayout.defaultProps = {
  title: "",
};

export default DefaultLayout;
