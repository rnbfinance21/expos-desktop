import { BaseResponse } from "@/utils/types";
import {
  checkPasscode as checkPasscodeFeature,
  loginUsername as loginUsernameFeature,
  regenerateCode as regenerateCodeFeature,
  uangKas as uangKasFeature,
  userDetail as userDetailFeature,
} from "@/features/auth/api";
import {
  CheckPasscodeResponse,
  LoginUsernameParams,
  LoginUsernameResponse,
  UangKasParams,
  UserDetailResponse,
} from "@/modules/auth/type";

export const loginUsername = async (
  params: LoginUsernameParams
): Promise<LoginUsernameResponse> => {
  return loginUsernameFeature(params);
};

export const userDetail = async (
  _token: string
): Promise<UserDetailResponse> => {
  return userDetailFeature();
};

export const uangKas = async (
  _token: string,
  params: UangKasParams
): Promise<BaseResponse> => {
  return uangKasFeature(params);
};

export const checkPasscode = async (
  _token: string,
  passcode: string
): Promise<CheckPasscodeResponse> => {
  return checkPasscodeFeature(passcode);
};

export const regenerateCode = async (
  _token: string
): Promise<BaseResponse> => {
  return regenerateCodeFeature();
};
