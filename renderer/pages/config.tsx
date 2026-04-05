import React from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import ConfigPage from "@/modules/config/components/ConfigPage";

const config = () => {
  return (
    <DefaultLayout title="Pengaturan">
      <ConfigPage />
    </DefaultLayout>
  );
};

export default config;
