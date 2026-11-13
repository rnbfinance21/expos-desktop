export interface BaseResponse<T = any> {
    code: number;
    message: string;
    data?: T;
}

export interface ErrorResponse {
    code: number;
    message: string;
    errors?: any[];
}