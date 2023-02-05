import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../config/store";
import { formatDate } from "../utils/date";

export interface CounterState {
  search: string;
  status: number | null;
  date: string;
  refetchOrder: boolean;
  selectedOrder: number | null;
}

const initialState: CounterState = {
  search: "",
  status: null,
  date: formatDate(new Date()),
  refetchOrder: true,
  selectedOrder: null,
};

export const counterSlice = createSlice({
  name: "listORder",
  initialState,
  reducers: {
    setSearch: (state, actions: PayloadAction<string>) => {
      state.search = actions.payload;
    },
    setStatus: (state, actions: PayloadAction<number | null>) => {
      state.status = actions.payload;
    },
    setDate: (state, actions: PayloadAction<string>) => {
      state.date = actions.payload;
    },
    setRefetchOrder: (state, actions: PayloadAction<boolean>) => {
      // state.selectedOrder = null;
      state.refetchOrder = actions.payload;
    },
    setStatusAndDate: (
      state,
      actions: PayloadAction<{
        status: number;
        date: string;
      }>
    ) => {
      state.status = actions.payload.status;
      state.date = actions.payload.date;
    },
    setSelectedOrder: (state, actions: PayloadAction<number>) => {
      state.selectedOrder =
        actions.payload === state.selectedOrder ? null : actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSearch,
  setStatus,
  setDate,
  setRefetchOrder,
  setStatusAndDate,
  setSelectedOrder,
} = counterSlice.actions;

export const getListOrder = (state: RootState) => state.listOrder;

export default counterSlice.reducer;
