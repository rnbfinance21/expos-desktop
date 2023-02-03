import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../config/store";
import { Menu } from "../services/MenuService";

export interface MenuState {
  menu: Menu[];
  search: string;
  type: string;
  refetchMenu: boolean;
  selectedCategory: number | null;
}

const initialState: MenuState = {
  menu: [],
  search: "",
  type: "images",
  refetchMenu: true,
  selectedCategory: null,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setSearch: (state, actions: PayloadAction<string>) => {
      state.search = actions.payload;
    },
    setType: (state, actions: PayloadAction<string>) => {
      state.type = actions.payload;
    },
    setMenu: (state, actions: PayloadAction<Menu[]>) => {
      state.menu = actions.payload;
    },
    setRefetchMenu: (state, actions: PayloadAction<boolean>) => {
      state.search = "";
      state.selectedCategory = null;
      state.refetchMenu = actions.payload;
    },
    setSelectedCategory: (state, actions: PayloadAction<number | null>) => {
      state.search = "";
      state.selectedCategory = actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setMenu,
  setRefetchMenu,
  setSelectedCategory,
  setSearch,
  setType,
} = menuSlice.actions;

export const getMenu = (state: RootState) => state.menu;

export const getMenuData = (state: RootState) => {
  let selectedCategory = state.menu.selectedCategory;
  let search = state.menu.search;

  if (search !== "") {
    return state.menu.menu.filter(
      (e) => e.name.toLowerCase().search(search.toLowerCase()) !== -1
    );
  } else {
    if (selectedCategory !== null) {
      return state.menu.menu.filter(
        (e) => e.kategori_menu_id === selectedCategory
      );
    }
  }

  return state.menu.menu;
};

export const getKategoriMenu = (state: RootState) => {
  let result: {
    id: number;
    name: string;
  }[] = [];

  state.menu.menu.forEach((element) => {
    let find = result.findIndex((e) => e.id === element.kategori_menu_id);
    if (find === -1) {
      result.push({
        id: element.kategori_menu_id,
        name: element.kategori_menu_name,
      });
    }
  });

  return result;
};

export default menuSlice.reducer;
