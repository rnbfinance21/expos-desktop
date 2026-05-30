import * as yup from "yup";

export const LoginSchema = yup
    .object({
        username: yup.string().required("Masukkan kode staff"),
        password: yup.string().required("Masukkan pin atau kata sandi"),
    })
    .required();