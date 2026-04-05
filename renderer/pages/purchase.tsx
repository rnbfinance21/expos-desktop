import React from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import Main from "@/modules/purchase/components/Main";

const PurchasePage = () => {
    return (
        <DefaultLayout title="Purchase">
            <div className="flex-grow w-full flex flex-row">
                <div className="flex-1 flex flex-col overflow-auto bg-white">
                    <Main />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default PurchasePage;
