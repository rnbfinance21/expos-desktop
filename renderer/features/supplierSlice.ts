import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { formatDate } from "../utils/date";
import { RootState } from "../config/store";

export interface ReportState {
  search: string;
  date: string;
  refetchSupplier: boolean;
}

const initialState: ReportState = {
  search: "",
  date: formatDate(new Date()),
  refetchSupplier: true,
};

export const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    setSearch: (state, actions: PayloadAction<string>) => {
      state.search = actions.payload;
    },
    setDate: (state, actions: PayloadAction<string>) => {
      state.date = actions.payload;
    },
    setRefetch: (state, actions: PayloadAction<boolean>) => {
      state.refetchSupplier = actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSearch, setDate, setRefetch } = supplierSlice.actions;

export const getSupplier = (state: RootState) => state.supplier;

export default supplierSlice.reducer;
