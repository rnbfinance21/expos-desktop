import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../config/store";
import { Menu } from "../services/MenuService";
import { arraysEqual2 } from "../utils/array";

export interface Orders {
  id: number;
  price: number;
  qty: number;
  notes: string | null;
  margin: number;
  box: number;
  diskon: number;
  margin_stat: number;
  pajak_stat: number;
  variants: {
    option_id: number;
    price: number;
    category_id: number;
    category_name: string;
    option_name: string;
  }[];
  menu: Menu;
}

export interface OrderState {
  type: string;
  id: number | null;
  identity: {
    member_id: number | null;
    name: string;
    table: string;
    no_bill: string | null;
  };
  orders: Orders[];
}

const initialState: OrderState = {
  type: "ADD",
  id: null,
  identity: {
    member_id: null,
    name: "",
    table: "",
    no_bill: null,
  },
  orders: [],
};

export const findIndexSingleItem = (data: Orders[], value: any) =>
  data.findIndex((e) => e.id === value);

export const findIndexCustomItem = (data: Orders[], value: Orders) =>
  data.findIndex(
    (e) =>
      e.id === value.id &&
      e.notes === value.notes &&
      e.diskon === value.diskon &&
      arraysEqual2(e.variants, value.variants)
  );

export const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setType: (state, actions: PayloadAction<string>) => {
      state.type = actions.payload;
    },
    setId: (state, actions: PayloadAction<number>) => {
      state.id = actions.payload;
    },
    setIdentity: (
      state,
      actions: PayloadAction<{
        memberId: number | null;
        name: string;
        table: string;
        no_bill: string | null;
      }>
    ) => {
      const { memberId, name, table, no_bill } = actions.payload;

      state.identity = {
        member_id: memberId,
        name,
        table,
        no_bill,
      };
    },
    setOrders: (state, actions: PayloadAction<Orders[]>) => {
      state.orders = actions.payload;
    },
    addItem: (state, action: PayloadAction<Orders>) => {
      let index = findIndexSingleItem(state.orders, action.payload.id);

      if (index === -1) {
        state.orders = [...state.orders, action.payload];
      } else {
        let object = state.orders[index];
        object.qty = object.qty + 1;

        state.orders[index] = object;
      }
    },
    incrementItem: (state, action: PayloadAction<number>) => {
      let index = findIndexSingleItem(state.orders, action.payload);

      let object = state.orders[index];
      object.qty = object.qty + 1;

      state.orders[index] = object;
    },
    decrementItem: (state, action: PayloadAction<number>) => {
      let index = findIndexSingleItem(state.orders, action.payload);

      let object = state.orders[index];
      object.qty = object.qty - 1;

      if (object.qty === 0) {
        state.orders.splice(index, 1);
      } else {
        state.orders[index] = object;
      }
    },
    addItemCustom: (state, action: PayloadAction<Orders>) => {
      let index = findIndexCustomItem(state.orders, action.payload);

      if (index === -1) {
        state.orders = [...state.orders, action.payload];
      } else {
        let object = state.orders[index];
        object.qty = object.qty + 1;

        state.orders[index] = object;
      }
    },
    updateItemCustom: (
      state,
      action: PayloadAction<{
        prev: Orders;
        new: Orders;
      }>
    ) => {
      let index = findIndexCustomItem(state.orders, action.payload.prev);

      let object = state.orders[index];
      object.qty = action.payload.new.qty;
      object.notes = action.payload.new.notes;
      object.price = action.payload.new.price;
      object.variants = action.payload.new.variants;
      object.diskon = action.payload.new.diskon;

      state.orders[index] = object;
    },
    incrementItemCustom: (state, action: PayloadAction<Orders>) => {
      let index = findIndexCustomItem(state.orders, action.payload);

      let object = state.orders[index];
      object.qty = object.qty + 1;

      state.orders[index] = object;
    },
    decrementItemCustom: (state, action: PayloadAction<Orders>) => {
      let index = findIndexCustomItem(state.orders, action.payload);

      if (index !== -1) {
        let object = state.orders[index];
        object.qty = object.qty - 1;

        if (object.qty === 0) {
          state.orders.splice(index, 1);
        } else {
          state.orders[index] = object;
        }
      }
    },
    resetOrder: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setIdentity,
  addItem,
  incrementItem,
  decrementItem,
  addItemCustom,
  updateItemCustom,
  incrementItemCustom,
  decrementItemCustom,
  resetOrder,
  setType,
  setOrders,
  setId,
} = orderSlice.actions;

export const getOrder = (state: RootState) => state.order;

export const getSumOrder = (state: RootState) => {
  const sum = state.order.orders.reduce((acc, item) => {
    return acc + item.price * item.qty;
  }, 0);

  return sum;
};

export const getCountOrder = (state: RootState) => {
  const sum = state.order.orders.reduce((acc, item) => {
    return acc + item.qty;
  }, 0);

  return sum;
};

export default orderSlice.reducer;
