export type BaseResponse = {
  code: number;
  message: string;
  errors?: {
    [key: string]: string[];
  };
};
