import React from "react";
import { Numpad } from "@/components/globals/keyboard";
import ActionSectionSubmitButton from "@/modules/payment/components/ActionSectionSubmitButton";
import { useActionSection } from "@/modules/payment/components/hooks/useActionSection";

const ActionSection = () => {
    const {
        type,
        inputNumpad,
        onNumpadChange,
        onPayment,
        onVoid,
        isSubmitting,
        isVoiding,
    } = useActionSection();

    return (
        <div className="grid grid-cols-1 gap-4 mt-2">
            <div>
                <Numpad value={inputNumpad.toString()} onChange={onNumpadChange} />
            </div>
            <div className="flex flex-col space-y-2">
                {/* <Button
                    onClick={onSimulatePrint}
                    type="button"
                    className="flex-1 bg-red-500 text-sm  text-white border border-red-300 rounded-lg"
                >
                    CETAK STRUK
                </Button> */}
                <ActionSectionSubmitButton
                    type={type}
                    isSubmitting={isSubmitting}
                    isVoiding={isVoiding}
                    onPayment={onPayment}
                    onVoid={onVoid}
                />
            </div>
        </div>
    );
};

export default ActionSection;
