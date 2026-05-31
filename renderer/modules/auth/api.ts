import { BaseResponse } from "@core/types";
import { LoginRequest, LoginResponse, OutletDetail, UserDetail } from "@modules/auth/type";
import api from "@utils/api";

const AuthService = {
    login: async (params: LoginRequest): Promise<BaseResponse<LoginResponse>> => {
        try {
            const response = await api.post<BaseResponse<LoginResponse>>("/api/cashier/v1/login", params);

            return response.data;
        } catch (error) {
            throw error;
        }
    },
    profile: async (): Promise<BaseResponse<UserDetail>> => {
        try {
            const response = await api.get<BaseResponse<UserDetail>>("/api/cashier/v1/profile");

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    profileOutlet: async (): Promise<BaseResponse<OutletDetail>> => {
        try {
            const response = await api.get<BaseResponse<OutletDetail>>("/api/cashier/v1/profile/outlet");

            return response.data;
        } catch (error) {
            throw error;
        }
    },
    logout: async (): Promise<BaseResponse<null>> => {
        try {
            const response = await api.post<BaseResponse<null>>("/api/cashier/v1/logout");

            return response.data;
        } catch (error) {
            throw error;
        }
    },
}

export default AuthService;