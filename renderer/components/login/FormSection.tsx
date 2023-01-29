import React, { ReactElement } from "react";
import AuthForm from "./AuthForm";

const FormSection = () => {
  return (
    <div className="w-[450px] flex flex-col">
      <div className="flex-1 flex flex-col p-4 justify-center">
        <div className="mb-4">
          <p className="text-2xl font-semibold">Selamat Datang Kembali</p>
          <p className="text-sm font-light text-gray-500">
            Silahkan masuk dengan akun Anda
          </p>
        </div>
        <AuthForm />
      </div>
      <div className="flex flex-row justify-center items-center p-4">
        <span className="text-sm font-bold">
          &copy; CV. Ramen Nikmat Barokah
        </span>
      </div>
    </div>
  );
};

export default FormSection;
