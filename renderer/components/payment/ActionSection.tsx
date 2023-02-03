import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPayment, setInputNumpad } from "../../features/paymentSlice";
import { Button } from "../globals/buttons";
import { Numpad } from "../globals/keyboard";

const ActionSection = () => {
  const dispatch = useDispatch();
  const { type, inputNumpad } = useSelector(getPayment);

  const _onChange = (val: string) => {
    dispatch(setInputNumpad(parseInt(val, 0)));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Numpad value={inputNumpad.toString()} onChange={_onChange} />
      </div>
      <div className="flex flex-col space-y-2">
        <Button
          type="button"
          className="flex-1 bg-red-500 text-sm  text-white border border-red-300 rounded-lg"
        >
          CETAK STRUK
        </Button>
        {type !== "VOID" ? (
          <Button
            type="button"
            className="flex-1 bg-red-500 text-sm text-white border border-red-300 rounded-lg"
            // isLoading={
            //   updatePaymentMutation.isLoading ||
            //   savePaymentMutation.isLoading
            // }
            // disabled={
            //   updatePaymentMutation.isLoading ||
            //   savePaymentMutation.isLoading
            // }
            // onClick={onPayment}
          >
            BAYAR
          </Button>
        ) : (
          <Button
            type="button"
            className="flex-1 bg-red-500 text-sm text-white border border-red-300 rounded-lg"
            // isLoading={voidMutation.isLoading}
            // disabled={voidMutation.isLoading}
            // onClick={onVoid}
          >
            SIMPAN VOID
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActionSection;
