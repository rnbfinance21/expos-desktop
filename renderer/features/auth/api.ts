import api from "@/lib/api";
import { BaseResponse } from "@/utils/types";
import {
  CheckPasscodeResponse,
  LoginPayload,
  LoginResponse,
  UangKasParams,
  UserDetailResponse,
} from "@/features/auth/types";

enum AuthUrl {
  Login = "/api/auth/login-username",
  UserDetail = "/api/auth/detail",
  KAS = "/api/kas",
  PASSCODE = "/api/passcode",
  REGENERATE_CODE = "/api/regenerate-code",
}

export const loginUsername = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const resp = await api.post(AuthUrl.Login, payload);
  return resp.data;
};

export const userDetail = async (): Promise<UserDetailResponse> => {
  const resp = await api.get(AuthUrl.UserDetail);
  return resp.data;
};

export const uangKas = async (params: UangKasParams): Promise<BaseResponse> => {
  const resp = await api.post(AuthUrl.KAS, params);
  return resp.data;
};

export const checkPasscode = async (
  passcode: string
): Promise<CheckPasscodeResponse> => {
  const resp = await api.post(AuthUrl.PASSCODE, { passcode });
  return resp.data;
};

export const regenerateCode = async (): Promise<BaseResponse> => {
  const resp = await api.post(AuthUrl.REGENERATE_CODE, {});
  return resp.data;
};
