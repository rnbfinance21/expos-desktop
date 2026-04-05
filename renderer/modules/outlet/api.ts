import axios from "@/utils/axios";
import { BaseResponse } from "@/utils/types";
import { OpenOutletParams } from "@/modules/outlet/type";

export const openOutlet = async (
  token: string,
  params: OpenOutletParams
): Promise<BaseResponse> => {
  try {
    const response = await axios.post("/api/open", params, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
