import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { TextInput } from "@/components/globals/forms";
import { ErrorLabel } from "@/components/globals/labels";
import { DynamicHeroIcon } from "@/components/globals/icons";
import { Button } from "@/components/globals/buttons";
import { Numpad } from "@/components/globals/keyboard";
import { useLogin } from "@/modules/auth/hook";

type FormType = {
  username: string;
  password: string;
};

const schema = yup
  .object({
    username: yup.string().required("Masukkan kode staff"),
    password: yup.string().required("Masukkan pin atau kata sandi"),
  })
  .required();

const AuthForm = () => {
  const { login, isLoading } = useLogin();

  const [secureText, setSecureText] = useState(true);
  const [inputFocus, setInputFocus] = useState(1); // 1 = username, 2 = password
  const [inputNumpad, setInputNumpad] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormType>({
    resolver: yupResolver(schema),
  });

  const _onSubmit = (data: FormType) => {
    login(data.username, data.password);
  };

  const onFocus = (index: number) => {
    setInputFocus(index);

    switch (index) {
      case 1:
        setInputNumpad(getValues("username"));
        break;
      case 2:
        setInputNumpad(getValues("password"));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (inputFocus) {
      case 1:
        setValue("username", inputNumpad);
        break;
      case 2:
        setValue("password", inputNumpad);
        break;
      default:
        break;
    }
  }, [inputNumpad]);

  return (
    <form onSubmit={handleSubmit(_onSubmit)} className="mb-4">
      <div className="mb-4">
        <TextInput
          type="text"
          placeholder="Kode Staff"
          className="text-left"
          onClick={() => onFocus(1)}
          {...register("username")}
        />
        {errors.username ? <ErrorLabel text={errors.username.message} /> : null}
      </div>
      <div className="mb-4">
        <div className="relative">
          <TextInput
            type={secureText ? "password" : "text"}
            placeholder="Pin / Kata Sandi"
            className="text-left"
            onClick={() => onFocus(2)}
            {...register("password")}
          />
          {errors.password ? (
            <ErrorLabel text={errors.password.message} />
          ) : null}
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
        <Button type="submit" blok isLoading={isLoading}>
          Masuk
        </Button>
      </div>
      <div className="mt-4">
        <Numpad value={inputNumpad} onChange={setInputNumpad} isNullable />
      </div>
    </form>
  );
};

export default AuthForm;
