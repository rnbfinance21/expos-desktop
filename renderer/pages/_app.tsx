import React, { useEffect } from "react";
import type { AppProps } from "next/app";
// import KioskBoard from "kioskboard";

import "../styles/globals.css";
import { Provider } from "react-redux";
import { store } from "../config/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthContextProvider } from "../hooks/AuthContext";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  // useEffect(() => {
  //   KioskBoard.run(".js-kioskboard-input", {
  //     keysArrayOfObjects: [
  //       {
  //         "0": "Q",
  //         "1": "W",
  //         "2": "E",
  //         "3": "R",
  //         "4": "T",
  //         "5": "Y",
  //         "6": "U",
  //         "7": "I",
  //         "8": "O",
  //         "9": "P",
  //       },
  //       {
  //         "0": "A",
  //         "1": "S",
  //         "2": "D",
  //         "3": "F",
  //         "4": "G",
  //         "5": "H",
  //         "6": "J",
  //         "7": "K",
  //         "8": "L",
  //       },
  //       {
  //         "0": "Z",
  //         "1": "X",
  //         "2": "C",
  //         "3": "V",
  //         "4": "B",
  //         "5": "N",
  //         "6": "M",
  //       },
  //     ],
  //     theme: "dark",
  //     // Allow or prevent mobile keyboard usage. Prevented when "false"
  //     allowMobileKeyboard: false,
  //   });
  // }, []);

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
