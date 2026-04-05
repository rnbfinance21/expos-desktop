import axios from "@/utils/axios";
import { BaseResponse } from "@/utils/types";
import { CheckPasscodeResponse, LoginUsernameParams, LoginUsernameResponse, UangKasParams, UserDetailResponse } from "@/modules/auth/type";

enum AuthUrl {
  Login = "/api/auth/login-username",
  UserDetail = "/api/auth/detail",
  KAS = "/api/kas",
  PASSCODE = "/api/passcode",
  REGENERATE_CODE = "/api/regenerate-code",
}

export const loginUsername = async (
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

export const userDetail = async (
  token: string
): Promise<UserDetailResponse> => {
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

export const uangKas = async (
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

export const checkPasscode = async (
  token: string,
  passcode: string
): Promise<CheckPasscodeResponse> => {
  try {
    const response = await axios.post(
      AuthUrl.PASSCODE,
      { passcode },
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

export const regenerateCode = async (
  token: string
): Promise<BaseResponse> => {
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
