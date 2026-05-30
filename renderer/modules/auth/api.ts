import api from "../../utils/axios";
import { LoginRequest, LoginResponse } from "./type";

const AuthService = {
    login: async (params: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await api.post<LoginResponse>("/api/auth/login-username", params);

            return response.data;
        } catch (error) {
            throw error;
        }
    },
}

export default AuthService;