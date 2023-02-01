import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Menu } from "../services/MenuService";
import { Orders } from "./orderSlice";
import { RootState } from "../config/store";

export interface CustomState {
  type: string;
  selectedMenuCustom: Menu | null;
  selectedOrder: Orders | null;
  openModalCustom: boolean;
}

const initialState: CustomState = {
  type: "ADD",
  selectedMenuCustom: null,
  selectedOrder: null,
  openModalCustom: false,
};

export const customSlice = createSlice({
  name: "custom",
  initialState,
  reducers: {
    setSelectedMenuCustom: (state, actions: PayloadAction<Menu>) => {
      state.selectedMenuCustom = actions.payload;
    },
    setSelectedOrder: (state, actions: PayloadAction<Orders | null>) => {
      state.selectedOrder = actions.payload;
    },
    setType: (state, actions: PayloadAction<string>) => {
      state.type = actions.payload;
    },
    setModalCustom: (state, actions: PayloadAction<boolean>) => {
      if (!actions.payload) {
        state.selectedMenuCustom = null;
        state.selectedOrder = null;
      }
      state.openModalCustom = actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSelectedMenuCustom,
  setSelectedOrder,
  setType,
  setModalCustom,
} = customSlice.actions;

export const getCustom = (state: RootState) => {
  return state.custom;
};

export const getSelectedMenuCustom = (state: RootState) => {
  return state.custom.selectedMenuCustom;
};

export const getSelectedOrder = (state: RootState) => {
  return state.custom.selectedOrder;
};

export const getOpenModalCustom = (state: RootState) => {
  return state.custom.openModalCustom;
};

export const getCustomType = (state: RootState) => {
  return state.custom.type;
};

export default customSlice.reducer;
