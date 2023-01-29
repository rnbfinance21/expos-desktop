import axios from "../utils/axios";

enum AuthUrl {
  Login = "/api/auth/login-username",
}

export type LoginUsernameParams = {
  username: string;
  password: string;
};

export type LoginUsernameResponse = {
  code: number;
  message: string;
  data: {
    access_token: string;
    shift_state: boolean;
  };
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

const AuthService = {
  loginUsername,
};

export default AuthService;
