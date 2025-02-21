import axios from "../utils/axios";
import { BaseResponse } from "./types";

enum AuthUrl {
    Login = "/api/auth/login-username",
    UserDetail = "/api/auth/detail",
    KAS = "/api/kas",
    PASSCODE = "/api/passcode",
    REGENERATE_CODE = "/api/regenerate-code",
}

export type LoginUsernameParams = {
    username: string;
    password: string;
    device_token?: string;
};

export type LoginUsernameResponse = {
    code: number;
    message: string;
    data: {
        access_token: string;
        shift_state: boolean;
    };
};

export type UserDetailResponse = {
    code: number;
    message: string;
    data: {
        id: number;
        name: string;
        email: string | null;
        username: string | null;
        photo: string;
        state: number;
        outlet: {
            id: number;
            name: string;
            address: string;
            code: string;
            open_state: number;
            kas_state: number;
            tax: number;
            instagram: string;
            contact: string;
        };
        access_code: null | string;
        table_count: null;
    };
};

export type UangKasParams = {
    kas: number;
    state?: number;
};

export type CheckPasscodeResponse = {
    code: number;
    message: string;
    status: boolean;
};

const loginUsername = async (
    params: LoginUsernameParams
): Promise<LoginUsernameResponse> => {
    try {
        const resp = await axios.post(AuthUrl.Login, params, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        return resp.data;
    } catch (error) {
        throw error;
    }
};

const userDetail = async (token: string): Promise<UserDetailResponse> => {
    try {
        const resp = await axios.get(AuthUrl.UserDetail, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return resp.data;
    } catch (error) {
        throw error;
    }
};

const uangKas = async (
    token: string,
    params: UangKasParams
): Promise<BaseResponse> => {
    try {
        const response = await axios.post(AuthUrl.KAS, params, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

const checkPasscode = async (
    token: string,
    passcode: string
): Promise<CheckPasscodeResponse> => {
    try {
        const response = await axios.post(
            AuthUrl.PASSCODE,
            {
                passcode,
            },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

const regenerateCode = async (token: string): Promise<BaseResponse> => {
    try {
        const response = await axios.post(
            AuthUrl.REGENERATE_CODE,
            {},
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

const AuthService = {
    loginUsername,
    userDetail,
    uangKas,
    checkPasscode,
    regenerateCode,
};

export default AuthService;
