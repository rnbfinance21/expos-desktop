import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { OrderType, PaymentType } from "../services/MasterService";
import { RootState } from "../config/store";

export interface PaymentState {
  order: OrderType[];
  payment: PaymentType[];
  tax: number[];
  cash: number[];
}

const initialState: PaymentState = {
  order: [],
  payment: [],
  tax: [],
  cash: [],
};

export const paymentAttributeSlice = createSlice({
  name: "payment_attributes",
  initialState,
  reducers: {
    setOrder: (state, actions: PayloadAction<OrderType[]>) => {
      state.order = actions.payload;
    },
    setPayment: (state, actions: PayloadAction<PaymentType[]>) => {
      state.payment = actions.payload;
    },
    setTax: (state, actions: PayloadAction<number[]>) => {
      state.tax = actions.payload;
    },
    setCash: (state, actions: PayloadAction<number[]>) => {
      state.cash = actions.payload;
    },
    resetPayment: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOrder, setPayment, setTax, setCash, resetPayment } =
  paymentAttributeSlice.actions;

export const getOrderType = (state: RootState) => state.paymentAttribute.order;

export const getPaymentType = (state: RootState) =>
  state.paymentAttribute.payment;

export const getListTax = (state: RootState) => state.paymentAttribute.tax;

export const getListCash = (state: RootState) => state.paymentAttribute.cash;

export default paymentAttributeSlice.reducer;
