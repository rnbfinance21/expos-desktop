import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { formatDate } from "../utils/date";
import { RootState } from "../config/store";

export interface PurchaseState {
    search: string;
    date: string;
    refetchPurchase: boolean;
}

const initialState: PurchaseState = {
    search: "",
    date: formatDate(new Date()),
    refetchPurchase: true,
};

export const purchaseSlice = createSlice({
    name: "purchase",
    initialState,
    reducers: {
        setSearch: (state, actions: PayloadAction<string>) => {
            state.search = actions.payload;
        },
        setDate: (state, actions: PayloadAction<string>) => {
            state.date = actions.payload;
        },
        setRefetch: (state, actions: PayloadAction<boolean>) => {
            state.refetchPurchase = actions.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setSearch, setDate, setRefetch } = purchaseSlice.actions;

export const getPurchase = (state: RootState) => state.purchase;

export default purchaseSlice.reducer;
