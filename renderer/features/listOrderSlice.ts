import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../config/store";
import { formatDate } from "../utils/date";

export interface CounterState {
  search: string;
  status: number | null;
  date: string;
  refetchOrder: boolean;
}

const initialState: CounterState = {
  search: "",
  status: null,
  date: formatDate(new Date()),
  refetchOrder: true,
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
    setDate: (state, actions: PayloadAction<Date>) => {
      state.date = formatDate(actions.payload);
    },
    setRefetchOrder: (state, actions: PayloadAction<boolean>) => {
      state.refetchOrder = actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSearch, setStatus, setDate, setRefetchOrder } =
  counterSlice.actions;

export const getListOrder = (state: RootState) => state.listOrder;

export default counterSlice.reducer;
