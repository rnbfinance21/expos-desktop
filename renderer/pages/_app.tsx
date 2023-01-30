import React from "react";
import type { AppProps } from "next/app";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { store } from "../config/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthContextProvider } from "../hooks/AuthContext";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <Component {...pageProps} />
        </AuthContextProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;
