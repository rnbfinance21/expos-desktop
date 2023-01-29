import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { TextInput } from "../globals/forms";
import { ErrorLabel } from "../globals/labels";
import { DynamicHeroIcon } from "../globals/icons";
import { Button } from "../globals/buttons";
import Card from "../globals/cards/Card";
import { useMutation } from "react-query";
import AuthService, { LoginUsernameParams } from "../../services/AuthService";
import { AxiosError } from "axios";
import { BaseResponse } from "../../services/types";
import Toast from "../../utils/toast";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/AuthContext";

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

const Header = () => {
  return (
    <div className="text-center mb-4">
      <p className="text-4xl font-bold text-red-500 tracking-wide">EXPOS</p>
      <span className="text-xs font-light">
        Silahkan masuk untuk memulai transaksi
      </span>
    </div>
  );
};

const AuthForm = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const [secureText, setSecureText] = useState(true);

  const {
    register,
    handleSubmit,
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

  return (
    <Card>
      <Header />
      <form onSubmit={handleSubmit(_onSubmit)} className="mb-4">
        <div className="mb-4">
          <TextInput
            type="text"
            placeholder="Kode Staff"
            className="text-left js-kioskboard-input"
            data-kioskboard-type="numpad"
            {...register("username")}
          />
          {errors.username ? (
            <ErrorLabel text={errors.username.message} />
          ) : null}
        </div>
        <div className="mb-4">
          <div className="relative">
            <TextInput
              type={secureText ? "password" : "text"}
              placeholder="Pin / Kata Sandi"
              className="text-left js-kioskboard-input"
              data-kioskboard-type="numpad"
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
      </form>
    </Card>
  );
};

export default AuthForm;
