/* eslint-disable no-console */

import axios from "../utils/axios";
import { BaseResponse } from "./types";

enum MenuUrl {
  MENU_LIST = "/api/menu/outlet",
  UPDATE_STOCK_STATE = "/api/menu/stock/change",
  VARIANT_LIST = "/api/menu/variant/outlet",
}

export interface VariantOption {
  id: number;
  variant_id: number;
  name: string;
  price: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  outlet_state: number;
}

export interface Variant {
  id: number;
  name: string;
  type: number;
  state: number;
  required_state: number;
  required_select: number;
  max_state: number;
  max_select: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  options: VariantOption[];
}

export interface Menu {
  id: number;
  kategori_outlet_id: number | null;
  kategori_brand_id: number | null;
  kategori_menu_id: number;
  name: string;
  description: string;
  price: number;
  photo: string;
  published_at: string | null;
  published_end: string | null;
  type: number;
  tax_state: number;
  box_state: number;
  consignment_state: number;
  kuah_state: number;
  level_state: number;
  show_state: number;
  state: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  kategori_menu_name: string;
  in_stock: number;
  state_stock: number;
  variants: Variant[];
}

export interface VariantOptionData {
  id: number;
  id_option_outlet: number;
  name: string;
  outlet_id: number;
  state: number;
}

export interface VariantData {
  id: number;
  name: string;
  options: VariantOptionData[];
}

export type GetMenuOutletResponse = {
  code: number;
  message: string;
  data: Menu[];
};

export type ChangeStockStateParams = {
  outlet_id: number;
  menu_id: number;
  state: number;
};

export type GetVariantOutletResponse = {
  code: number;
  message: string;
  data: VariantData[];
};

const getMenuOutlet = async (
  token: string,
  outletCode: string
): Promise<GetMenuOutletResponse> => {
  try {
    const response = await axios.get(`${MenuUrl.MENU_LIST}/${outletCode}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("getMenuOutlet", error);
    throw error;
  }
};

const changeStockState = async (
  token: string,
  params: ChangeStockStateParams
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(`${MenuUrl.UPDATE_STOCK_STATE}`, params, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("changeStockState", error);
    throw error;
  }
};

const getVariantOutlet = async (
  token: string,
  outletId: number
): Promise<GetVariantOutletResponse> => {
  try {
    const response = await axios.get(MenuUrl.VARIANT_LIST, {
      params: {
        outlet_id: outletId,
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("getVariantOutlet", error);
    throw error;
  }
};

const MenuService = {
  getMenuOutlet,
  changeStockState,
  getVariantOutlet,
};

export default MenuService;
