import React from "react";
import { useSelector } from "react-redux";
import { getPayment } from "../../../features/paymentSlice";
import { ucwords } from "../../../utils/string";
import { DynamicHeroIcon } from "../../globals/icons";

const ProfileSection = () => {
  const { identity } = useSelector(getPayment);

  return (
    <div className="flex flex-col sticky top-0 z-10 bg-white border-b">
      <div className="px-4 py-[7px] flex flex-row items-center">
        <DynamicHeroIcon icon="UserCircleIcon" className="h-10 w-10" />
        <div className="flex-1 flex flex-col ml-1">
          <p className="text-xs font-medium">
            {identity.name == "" ? "-" : ucwords(identity.name)}
          </p>
          <div className="flex flex-row gap-4">
            <div className="flex flex-row">
              <p className="text-xs font-thin">Table :</p>
              <p className="text-xs font-medium">
                {identity.table == "" ? "-" : ucwords(identity.table)}
              </p>
            </div>
            <div className="flex flex-row">
              <p className="text-xs font-thin">Bill :</p>
              <p className="text-xs font-medium">
                {identity.no_bill == "" || identity.no_bill == null
                  ? "-"
                  : ucwords(identity.no_bill)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
