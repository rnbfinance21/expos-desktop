import React, { memo } from "react";
import { Button } from "@/components/globals/buttons";

type ActionSectionSubmitButtonProps = {
    type: string;
    isSubmitting: boolean;
    isVoiding: boolean;
    onPayment: () => void;
    onVoid: () => void;
};

const ActionSectionSubmitButton = ({
    type,
    isSubmitting,
    isVoiding,
    onPayment,
    onVoid,
}: ActionSectionSubmitButtonProps) => {
    if (type !== "VOID") {
        return (
            <Button
                type="button"
                className="flex-1 bg-red-500 text-xl text-white border border-red-300 rounded-lg"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                onClick={onPayment}
            >
                BAYAR
            </Button>
        );
    }

    return (
        <Button
            type="button"
            className="flex-1 bg-red-500 text-sm text-white border border-red-300 rounded-lg"
            isLoading={isVoiding}
            disabled={isVoiding}
            onClick={onVoid}
        >
            SIMPAN VOID
        </Button>
    );
};

export default memo(ActionSectionSubmitButton);
