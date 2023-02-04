import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { formatDate } from "../utils/date";
import { RootState } from "../config/store";

export interface ReportState {
  search: string;
  date: string;
  refetchReport: boolean;
}

const initialState: ReportState = {
  search: "",
  date: formatDate(new Date()),
  refetchReport: true,
};

export const reportSlice = createSlice({
  name: "listORder",
  initialState,
  reducers: {
    setSearch: (state, actions: PayloadAction<string>) => {
      state.search = actions.payload;
    },
    setDate: (state, actions: PayloadAction<string>) => {
      state.date = actions.payload;
    },
    setRefetch: (state, actions: PayloadAction<boolean>) => {
      state.refetchReport = actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSearch, setDate, setRefetch } = reportSlice.actions;

export const getReport = (state: RootState) => state.report;

export default reportSlice.reducer;
