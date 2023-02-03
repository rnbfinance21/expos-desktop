import { configureStore } from "@reduxjs/toolkit";
import listOrderReducer from "../features/listOrderSlice";
import menuReducer from "../features/menuSlice";
import orderReducer from "../features/orderSlice";
import customReducer from "../features/customSlice";
import paymentReducer from "../features/paymentSlice";
import paymentAttributeReducer from "../features/paymentAttributeSlice";

export const store = configureStore({
  reducer: {
    listOrder: listOrderReducer,
    menu: menuReducer,
    order: orderReducer,
    custom: customReducer,
    payment: paymentReducer,
    paymentAttribute: paymentAttributeReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
