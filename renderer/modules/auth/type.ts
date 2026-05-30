export type LoginFormData = {
    username: string;
    password: string;
};

export type LoginRequest = {
    username: string;
    password: string;
    device_token?: string;
};

export type LoginResponse = {
    code: number;
    message: string;
    data: {
        access_token: string;
        shift_state: boolean;
    };
};