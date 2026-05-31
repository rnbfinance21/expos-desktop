export type LoginFormData = {
    username: string;
    password: string;
};

export type UserDetail = {
    id: number | null;
    name: string;
    email: string;
    username: string;
    photo: string;
    state: boolean;
};

export type OutletDetail = {
    id: number | null;
    name: string;
    address: string;
    code: string;
    open_state: boolean;
    tax: number;
    instagram: string;
    contact: string;
    access_code: string | null;
    table_count: number;
    kas_state: boolean;
};


// Login
export type LoginRequest = {
    identifier: string;
    password: string;
};

export type LoginResponse = {
    user: UserDetail;
    access_token: string;
};

