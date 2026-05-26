import {
    CheckPasscodeResponse as FeatureCheckPasscodeResponse,
    LoginPayload,
    LoginResponse,
    UangKasParams as FeatureUangKasParams,
    UserDetailResponse as FeatureUserDetailResponse,
} from "@/features/auth/types";

export type LoginUsernameParams = LoginPayload;

export type LoginUsernameResponse = LoginResponse;

export type UserDetailResponse = FeatureUserDetailResponse;

export type UangKasParams = FeatureUangKasParams;

export type CheckPasscodeResponse = FeatureCheckPasscodeResponse;