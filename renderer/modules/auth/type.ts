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