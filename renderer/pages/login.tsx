import React, { useState } from "react";
import { Button } from "../components/globals/buttons";
import { TextInput } from "../components/globals/forms";
import { DynamicHeroIcon } from "../components/globals/icons";

const login = () => {
  const [secureText, setSecureText] = useState(true);

  const _onSubmit = async () => {};

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="px-4 py-6 rounded-md bg-white w-96">
        <div className="text-center mb-4">
          <p className="text-4xl font-bold text-red-500 tracking-wide">EXPOS</p>
          <span className="text-xs font-light">
            Silahkan masuk untuk memulai transaksi
          </span>
        </div>
        <form className="mb-4">
          <div className="mb-4">
            <TextInput
              type="text"
              placeholder="Kode Staff"
              className="text-left js-kioskboard-input"
              data-kioskboard-type="numpad"
            />
          </div>
          <div className="mb-4">
            <div className="relative">
              <TextInput
                type={secureText ? "password" : "text"}
                placeholder="Pin / Kata Sandi"
                className="text-left js-kioskboard-input"
                data-kioskboard-type="numpad"
              />
              <div
                className="absolute right-3 top-2 cursor-pointer"
                onClick={() => setSecureText(!secureText)}
              >
                <DynamicHeroIcon
                  icon={secureText ? "EyeIcon" : "EyeSlashIcon"}
                  className="h-6 w-6 text-gray-500"
                />
              </div>
            </div>
          </div>
          <div>
            <Button onClick={_onSubmit} type="button" blok>
              Masuk
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default login;
