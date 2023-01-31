/* eslint-disable no-console */

import axios from "../utils/axios";

enum MenuUrl {
  MENU_LIST = "/api/menu/outlet",
}

export type Menu = {
  id: number;
  kategori_outlet_id: number | null;
  kategori_brand_id: number | null;
  kategori_menu_id: number;
  kategori_menu_name: string;
  name: string;
  description: string | null;
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
  state: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  in_stock: number;
  state_stock: number;
};

export type GetMenuOutletResponse = {
  code: number;
  message: string;
  data: Menu[];
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

const MenuService = {
  getMenuOutlet,
};

export default MenuService;
