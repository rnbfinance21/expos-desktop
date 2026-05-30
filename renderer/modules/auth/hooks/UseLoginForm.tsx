// useLoginForm.ts
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import electron from "electron";
import * as yup from "yup";
import { useAuth } from "../../../hooks/AuthContext";
import { LoginRequest } from "../type";
import AuthService from "../api";
import { AxiosError } from "axios";
import { BaseResponse } from "../../../services/types";
import Toast from "../../../utils/toast";

const schema = yup.object({
    username: yup.string().required("Masukkan kode staff"),
    password: yup.string().required("Masukkan pin atau kata sandi"),
}).required();

export function useLoginForm() {
    const ipcRenderer = electron.ipcRenderer || false;

    const { signIn } = useAuth();

    const [secureText, setSecureText] = useState(true);
    const [inputFocus, setInputFocus] = useState(1);
    const [inputNumpad, setInputNumpad] = useState("");

    const form = useForm({
        resolver: yupResolver(schema),
    });

    const { mutate, isLoading } = useMutation(
        (params: LoginRequest) => AuthService.login(params),
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
                } else {
                    Toast.fire("Error!", "Terjadi kesalahan pada sistem", "error");
                }
            },
        }
    );

    const onSubmit = (data) => {
        if (ipcRenderer) {
            let params = { ...data };
            mutate(params);
        }
    };

    const onFocus = (index) => {
        setInputFocus(index);
        setInputNumpad(form.getValues(index === 1 ? "username" : "password"));
    };

    useEffect(() => {
        if (inputFocus === 1) form.setValue("username", inputNumpad);
        if (inputFocus === 2) form.setValue("password", inputNumpad);
    }, [inputNumpad]);

    return {
        form,
        onSubmit,
        isLoading,
        secureText,
        setSecureText,
        inputFocus,
        onFocus,
        inputNumpad,
        setInputNumpad,
    };
}