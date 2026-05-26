import React from "react";
import Main from "@/features/home/components/main";
import Detail from "@/features/home/components/detail";

const HomeScreen = () => {
  return (
    <div className="flex-grow w-full flex flex-row">
      <Main />
      <Detail />
    </div>
  );
};

export default HomeScreen;
