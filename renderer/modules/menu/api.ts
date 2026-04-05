import axios from "@/utils/axios";
import { BaseResponse } from "@/utils/types";
import {
  GetMenuOutletResponse,
  ChangeStockStateParams,
  ChangeVariantStateParams,
  GetVariantOutletResponse,
} from "@/modules/menu/type";

enum MenuUrl {
  MENU_LIST = "/api/menu/outlet",
  UPDATE_STOCK_STATE = "/api/menu/stock/change",
  VARIANT_LIST = "/api/menu/variant/outlet",
  UPDATE_VARIANT_STATE = "/api/menu/variant/change",
}

export const getMenuOutlet = async (
  token: string,
  outletCode: string
): Promise<GetMenuOutletResponse> => {
  try {
    const response = await axios.get(`${MenuUrl.MENU_LIST}/${outletCode}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("getMenuOutlet", error);
    throw error;
  }
};

export const changeStockState = async (
  token: string,
  params: ChangeStockStateParams
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(MenuUrl.UPDATE_STOCK_STATE, params, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("changeStockState", error);
    throw error;
  }
};

export const changeVariantState = async (
  token: string,
  params: ChangeVariantStateParams
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(MenuUrl.UPDATE_VARIANT_STATE, params, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("changeVariantState", error);
    throw error;
  }
};

export const getVariantOutlet = async (
  token: string,
  outletId: number
): Promise<GetVariantOutletResponse> => {
  try {
    const response = await axios.get(MenuUrl.VARIANT_LIST, {
      params: { outlet_id: outletId },
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log("getVariantOutlet", error);
    throw error;
  }
};
