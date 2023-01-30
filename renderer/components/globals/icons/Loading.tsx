import Image from "next/image";
import React from "react";
import LoadingSvg from "../../../../resources/loading.svg";

const Loading = () => {
  return <Image src={LoadingSvg} width={80} height={80} />;
};

export default Loading;
