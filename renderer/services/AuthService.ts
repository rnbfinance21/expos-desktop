import axios from "../utils/axios";

enum AuthUrl {
  Login = "/api/auth/login-username",
  UserDetail = "/api/auth/detail",
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
      code: string;
      open_state: number;
    };
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

const AuthService = {
  loginUsername,
  userDetail,
};

export default AuthService;
