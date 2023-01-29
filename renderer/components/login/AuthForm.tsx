import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { TextInput } from "../globals/forms";
import { ErrorLabel } from "../globals/labels";
import { DynamicHeroIcon } from "../globals/icons";
import { Button } from "../globals/buttons";
import { useMutation } from "react-query";
import AuthService, { LoginUsernameParams } from "../../services/AuthService";
import { AxiosError } from "axios";
import { BaseResponse } from "../../services/types";
import Toast from "../../utils/toast";
import { useAuth } from "../../hooks/AuthContext";
import { Numpad } from "../globals/keyboard";

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
  const { signIn } = useAuth();

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

  const { mutate, isLoading } = useMutation(
    (params: LoginUsernameParams) => AuthService.loginUsername(params),
    {
      onSuccess: (res) => {
        signIn(res.data.access_token);
      },
      onError: (err: AxiosError<BaseResponse>) => {
        if (err.isAxiosError && err.response) {
          const statusCode = err.response.status;
          const { message } = err.response.data;

          switch (statusCode) {
            case 422:
              Toast.fire("Pemberitahuan!", message, "warning");
              break;

            default:
              Toast.fire("Error!", message, "error");
              break;
          }
        }
      },
    }
  );

  const _onSubmit = async (data: FormType) => {
    mutate({
      username: data.username,
      password: data.password,
    });
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
          className="text-left js-kioskboard-input"
          data-kioskboard-type="numpad"
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
            className="text-left js-kioskboard-input"
            data-kioskboard-type="numpad"
            onClick={() => onFocus(2)}
            {...register("password")}
          />
          {errors.password ? (
            <ErrorLabel text={errors.password.message} />
          ) : null}
          <div
            className="absolute right-3 top-3 cursor-pointer"
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
