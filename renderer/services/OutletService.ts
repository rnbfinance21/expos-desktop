/* eslint-disable no-console */

import axios from "../utils/axios";
import { BaseResponse } from "./types";

enum OutletUrl {
  OPEN_OUTLET = "/api/open",
}

export type OpenOutletParams = {
  outlet_id: number;
  state: number;
};

const openOutlet = async (
  token: string,
  params: OpenOutletParams
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(`${OutletUrl.OPEN_OUTLET}`, params, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const OutletService = {
  openOutlet,
};

export default OutletService;
