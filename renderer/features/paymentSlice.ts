import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../config/store";
import { Menu } from "../services/MenuService";
import { arraysEqual2 } from "../utils/array";

export interface Payment {
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
    id: number;
    name: string;
    data: {
      option_id: number;
      option_name: string;
      price: number;
    }[];
  }[];
  type_order: number;
  // variants: {
  //   option_id: number;
  //   price: number;
  //   category_id: number;
  //   category_name: string;
  //   option_name: string;
  // }[];
  menu: Menu;
}

export interface PaymentOrder {
  type: string;
  id: number | null;
  identity: {
    member_id: number | null;
    name: string;
    table: string;
    no_bill: string | null;
  };
  orders: Payment[];
}

export interface PaymentState extends PaymentOrder {
  orderType: null | number;
  paymentType: null | number;
  tax: number;
  diskon: number;
  potongan: number;
  bayar: number;
  keterangan: string;
  inputNumpad: number;
  focus: number;
  changeState: boolean;
  openModal: boolean;
  selectedItem: null | Payment;
}

const initialState: PaymentState = {
  type: "ADD",
  id: null,
  identity: {
    member_id: null,
    name: "",
    table: "",
    no_bill: null,
  },
  orders: [],
  // select attribute
  orderType: 1,
  paymentType: 1,
  tax: 0,
  diskon: 0,
  potongan: 0,
  bayar: 0,
  inputNumpad: 0,
  focus: 3,
  changeState: false,
  // update price
  openModal: false,
  selectedItem: null,
  keterangan: "",
};

export const findIndexSingleItem = (data: Payment[], value: any) =>
  data.findIndex((e) => e.id === value);

export const findIndexCustomItem = (data: Payment[], value: Payment) =>
  data.findIndex(
    (e) =>
      e.id === value.id &&
      e.notes === value.notes &&
      e.diskon === value.diskon &&
      arraysEqual2(e.variants, value.variants)
  );

export const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setPayment: (state, actions: PayloadAction<PaymentOrder>) => {
      state.type = actions.payload.type;
      state.id = actions.payload.id;
      state.identity = actions.payload.identity;
      state.orders = actions.payload.orders;
    },
    setOrderType: (state, actions: PayloadAction<number | null>) => {
      state.orderType = actions.payload;
    },
    setPaymentType: (state, actions: PayloadAction<number | null>) => {
      state.paymentType = actions.payload;
    },
    setTax: (state, actions: PayloadAction<number>) => {
      state.tax = actions.payload;
    },
    setCash: (state, actions: PayloadAction<number>) => {
      state.bayar = actions.payload;
      state.inputNumpad = actions.payload;
    },
    setDiskon: (state, actions: PayloadAction<number>) => {
      state.diskon = actions.payload;
      state.inputNumpad = actions.payload;
    },
    setPotongan: (state, actions: PayloadAction<number>) => {
      state.potongan = actions.payload;
      state.inputNumpad = actions.payload;
    },
    setBayar: (state, actions: PayloadAction<number>) => {
      state.bayar = actions.payload;
      state.inputNumpad = actions.payload;
    },
    setInputNumpad: (state, actions: PayloadAction<number>) => {
      switch (state.focus) {
        case 1:
          state.diskon = actions.payload;
          break;
        case 2:
          state.potongan = actions.payload;
          break;
        case 3:
          state.bayar = actions.payload;
          break;

        default:
          break;
      }
      state.inputNumpad = actions.payload;
    },
    setFocus: (state, actions: PayloadAction<number>) => {
      state.focus = actions.payload;

      switch (actions.payload) {
        case 1:
          state.inputNumpad = state.diskon;
          break;
        case 2:
          state.inputNumpad = state.potongan;
          break;
        case 3:
          state.inputNumpad = state.bayar;
          break;

        default:
          break;
      }
    },
    resetPayment: () => {
      return initialState;
    },
    setMargin: (
      state,
      action: PayloadAction<{
        margin: number;
        box: number;
      }>
    ) => {
      const { margin, box } = action.payload;
      const prevData = state.orders;

      prevData.map((item) => {
        item.margin = item.margin_stat ? margin : 0;
        item.box = item.margin_stat && item.pajak_stat ? box : 0;
        return item;
      });

      state.orders = prevData;
    },
    resetMargin: (state) => {
      const prevData = state.orders;

      prevData.map((item) => {
        item.margin = 0;
        item.box = 0;
        return item;
      });

      state.orders = prevData;
    },
    autoSetBayar: (state) => {
      const sumPaymentNoTax = state.orders.reduce((accumulator, item) => {
        if (item.pajak_stat === 1) {
          const priceMenu = item.price;
          const sum = priceMenu * item.qty;
          const box = item.qty * item.box;

          const margin = (sum * item.margin) / 100;
          const price = sum + margin + box;

          const diskon = (price * item.diskon) / 100;

          const result = price - diskon;

          return accumulator + result;
        }
        return accumulator;
      }, 0);

      const sumPayment = state.orders.reduce((accumulator, item) => {
        const priceMenu = item.price;

        const sum = priceMenu * item.qty;
        const box = item.qty * item.box;

        const margin = (sum * item.margin) / 100;
        const price = sum + margin + box;

        const diskon = (price * item.diskon) / 100;

        const result = price - diskon;

        return accumulator + result;
      }, 0);

      const pajak = (sumPaymentNoTax * (state.tax ?? 0)) / 100;
      const subtotal = sumPayment + pajak;

      const diskon = (subtotal * state.diskon) / 100;

      const total = subtotal - diskon - state.potongan;

      state.bayar = total;
    },
    setChangeState: (state, actions: PayloadAction<boolean>) => {
      state.changeState = actions.payload;
    },
    setOpenModal: (state, actions: PayloadAction<boolean>) => {
      state.openModal = actions.payload;
    },
    setSelectedItem: (state, actions: PayloadAction<Payment>) => {
      state.selectedItem = actions.payload;
    },
    updateItemCustom: (
      state,
      action: PayloadAction<{
        prev: Payment;
        new: {
          price: number;
        };
      }>
    ) => {
      let index = findIndexCustomItem(state.orders, action.payload.prev);

      let object = state.orders[index];
      object.price = action.payload.new.price;
      object.margin = 0;
      object.box = 0;

      state.orders[index] = object;
    },
    setKeterangan: (state, actions: PayloadAction<string>) => {
      state.keterangan = actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setPayment,
  resetPayment,
  setOrderType,
  setPaymentType,
  setTax,
  setDiskon,
  setPotongan,
  setBayar,
  setInputNumpad,
  setFocus,
  setCash,
  setMargin,
  resetMargin,
  autoSetBayar,
  setChangeState,
  setOpenModal,
  setSelectedItem,
  updateItemCustom,
  setKeterangan,
} = paymentSlice.actions;

export const getPayment = (state: RootState) => state.payment;

export const getPaymentSumPrice = (state: RootState) =>
  state.payment.orders.reduce((accumulator, item) => {
    const priceMenu = item.price;

    const sum = priceMenu * item.qty;
    const box = item.qty * item.box;

    const margin = (sum * item.margin) / 100;
    const price = sum + margin + box;

    const diskon = (price * item.diskon) / 100;

    const result = price - diskon;

    return accumulator + result;
  }, 0);

export const getPaymentSumPriceNoTax = (state: RootState) =>
  state.payment.orders.reduce((accumulator, item) => {
    if (item.pajak_stat === 1) {
      const priceMenu = item.price;
      const sum = priceMenu * item.qty;
      const box = item.qty * item.box;

      const margin = (sum * item.margin) / 100;
      const price = sum + margin + box;

      const diskon = (price * item.diskon) / 100;

      const result = price - diskon;

      return accumulator + result;
    }
    return accumulator;
  }, 0);

export const getPaymentAllSumPrice = (state: RootState) => {
  const sumPaymentNoTax = state.payment.orders.reduce((accumulator, item) => {
    if (item.pajak_stat === 1) {
      const priceMenu = item.price;
      const sum = priceMenu * item.qty;
      const box = item.qty * item.box;

      const margin = (sum * item.margin) / 100;
      const price = sum + margin + box;

      const diskon = (price * item.diskon) / 100;

      const result = price - diskon;

      return accumulator + result;
    }
    return accumulator;
  }, 0);

  const sumPayment = state.payment.orders.reduce((accumulator, item) => {
    const priceMenu = item.price;
    const sum = priceMenu * item.qty;
    const box = item.qty * item.box;

    const margin = (sum * item.margin) / 100;
    const price = sum + margin + box;

    const diskon = (price * item.diskon) / 100;

    const result = price - diskon;

    return accumulator + result;
  }, 0);

  const sumSubtotalPajak = state.payment.orders
    .filter((e) => e.pajak_stat === 1)
    .reduce((accumulator, item) => {
      const priceMenu = item.price;
      const sum = priceMenu * item.qty;
      const box = item.qty * item.box;

      const margin = (sum * item.margin) / 100;
      const price = sum + margin + box;

      const diskon = (price * item.diskon) / 100;

      const result = price - diskon;

      return accumulator + result;
    }, 0);

  const sumSubtotalBox = state.payment.orders
    .filter((e) => e.pajak_stat === 0)
    .reduce((accumulator, item) => {
      const priceMenu = item.price;
      const sum = priceMenu * item.qty;
      const box = item.qty * item.box;

      const margin = (sum * item.margin) / 100;
      const price = sum + margin + box;

      const diskon = (price * item.diskon) / 100;

      const result = price - diskon;

      return accumulator + result;
    }, 0);

  const pajak = (sumPaymentNoTax * (state.payment.tax ?? 0)) / 100;
  const subtotal = sumPayment + pajak;

  const diskon = (subtotal * state.payment.diskon) / 100;

  const total = subtotal - diskon - state.payment.potongan;

  const kembalian = state.payment.bayar - total;

  return {
    total,
    kembalian,
    subtotal,
    pajak_value: pajak,
    diskon_value: diskon,
    sumPayment,
    sumSubtotalPajak,
    sumSubtotalBox,
  };
};

export default paymentSlice.reducer;
