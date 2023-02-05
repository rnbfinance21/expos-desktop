import React, { useEffect, useState } from "react";
import {
  autoSetBayar,
  Payment,
  setOpenModal,
  setSelectedItem,
  updateItemCustom,
} from "../../features/paymentSlice";
import { useAuth } from "../../hooks/AuthContext";
import { Button } from "../globals/buttons";
import { Numpad } from "../globals/keyboard";
import MyModal from "../globals/modal/MyModal";
import CurrencyInput from "react-currency-input-field";
import { useDispatch } from "react-redux";

type ChangePriceModalProps = {
  visible: boolean;
  onClose: () => void;
  data: Payment;
};

const ChangePriceModal = ({
  visible,
  onClose,
  data,
}: ChangePriceModalProps) => {
  const dispatch = useDispatch();
  const [inputPrice, setInputPrice] = useState("0");

  const onSubmit = () => {
    dispatch(
      updateItemCustom({
        prev: data,
        new: {
          price: parseInt(inputPrice, 10),
        },
      })
    );
    dispatch(setOpenModal(false));
    dispatch(setSelectedItem(null));
    dispatch(autoSetBayar());
  };

  useEffect(() => {
    setInputPrice("");
    if (visible && data) {
      const priceItem =
        data.price + (data.price * data.margin) / 100 + data.box;

      setInputPrice(priceItem.toString());
    }
  }, [visible]);

  return (
    <MyModal show={visible} onClose={onClose} title="Ubah Harga">
      <>
        <div className="flex flex-col my-4">
          <CurrencyInput
            allowDecimals={false}
            defaultValue={0}
            decimalSeparator=","
            groupSeparator="."
            onValueChange={(value) => {
              if (value) {
                setInputPrice(value);
              } else {
                setInputPrice("0");
              }
            }}
            value={inputPrice}
            className="flex-1 block w-full text-center focus:ring-red-500 focus:border-red-500 min-w-0 rounded-md sm:text-base border-gray-200"
          />
          <div className="mt-4">
            <Numpad value={inputPrice} onChange={setInputPrice} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button type="button" className="text-xs" blok onClick={onSubmit}>
            Simpan
          </Button>
          <Button type="button" className="text-xs" blok onClick={onClose}>
            Batal
          </Button>
        </div>
      </>
    </MyModal>
  );
};

export default ChangePriceModal;
