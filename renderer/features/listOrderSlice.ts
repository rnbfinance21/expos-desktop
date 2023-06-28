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
  openDetail: boolean;
}

const initialState: CounterState = {
  search: "",
  status: null,
  date: formatDate(new Date()),
  refetchOrder: true,
  selectedOrder: null,
  openDetail: false,
};

export const counterSlice = createSlice({
  name: "listORder",
  initialState,
  reducers: {
    setSearch: (state, actions: PayloadAction<string>) => {
      state.search = actions.payload;
      state.selectedOrder = null;
    },
    setStatus: (state, actions: PayloadAction<number | null>) => {
      state.status = actions.payload;
      state.selectedOrder = null;
    },
    setDate: (state, actions: PayloadAction<string>) => {
      state.date = actions.payload;
      state.selectedOrder = null;
    },
    setRefetchOrder: (state, actions: PayloadAction<boolean>) => {
      // state.selectedOrder = null;
      state.refetchOrder = actions.payload;
      state.selectedOrder = null;
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
      state.selectedOrder = null;
    },
    setSelectedOrder: (state, actions: PayloadAction<number | null>) => {
      // state.selectedOrder =
      //   actions.payload === state.selectedOrder ? null : actions.payload;
      state.selectedOrder = actions.payload;
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
