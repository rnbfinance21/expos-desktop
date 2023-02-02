import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useAuth } from "../../hooks/AuthContext";
import AuthService from "../../services/AuthService";
import { handleErrorAxios } from "../../utils/errors";
import Toast from "../../utils/toast";
import { Button } from "../globals/buttons";
import { TextInput } from "../globals/forms";
import { Numpad } from "../globals/keyboard";
import MyModal from "../globals/modal/MyModal";

type PasscodeModalProps = {
  visible: boolean;
  onClose: () => void;
  onError?: (error: string) => void;
  onSuccess: () => void;
};

const PasscodeModal = ({
  visible,
  onClose,
  onError,
  onSuccess,
}: PasscodeModalProps) => {
  const { token } = useAuth();
  const [inputPinCode, setInputPinCode] = useState("");

  const checkPasscodeMutation = useMutation(
    (passcode: string) => AuthService.checkPasscode(token, passcode),
    {
      onSuccess: (res) => {
        if (res.status) {
          onSuccess();
        } else {
          Toast.fire("Pemberitahuan", res.message, "warning");
        }
      },
      onError: handleErrorAxios,
    }
  );

  const onSubmit = () => {
    checkPasscodeMutation.mutate(inputPinCode);
  };

  useEffect(() => {
    setInputPinCode("");
  }, [visible]);

  return (
    <MyModal show={visible} onClose={onClose} title="Kode Pin">
      <>
        <div className="flex flex-col my-4">
          <TextInput
            type="password"
            maxLength={6}
            minLength={6}
            onChange={(e) => setInputPinCode(e.currentTarget.value)}
            value={inputPinCode}
            placeholder="_ _ _ _ _ _"
            className="text-center"
          />
          <div className="mt-4">
            <Numpad
              value={inputPinCode}
              onChange={setInputPinCode}
              isNullable
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            className="text-xs"
            blok
            onClick={onSubmit}
            isLoading={checkPasscodeMutation.isLoading}
            disabled={checkPasscodeMutation.isLoading}
          >
            Simpan
          </Button>
          <Button
            type="button"
            className="text-xs"
            blok
            onClick={onClose}
            isLoading={checkPasscodeMutation.isLoading}
            disabled={checkPasscodeMutation.isLoading}
          >
            Batal
          </Button>
        </div>
      </>
    </MyModal>
  );
};

export default PasscodeModal;
