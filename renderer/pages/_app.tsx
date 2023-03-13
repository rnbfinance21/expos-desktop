import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { store } from "../config/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthContextProvider } from "../hooks/AuthContext";
import electron from "electron";

// import "../firebase";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const ipcRenderer = electron.ipcRenderer || false;

  useEffect(() => {
    if (ipcRenderer) {
      // // Listen for service successfully started

      ipcRenderer.on(
        `PUSH_RECEIVER:::NOTIFICATION_SERVICE_STARTED`,
        (_, token) => {
          console.log("service successfully started", token);
        }
      );
      // // Handle notification errors
      ipcRenderer.on(
        `PUSH_RECEIVER:::NOTIFICATION_SERVICE_ERROR`,
        (_, error) => {
          console.log("notification error", error);
        }
      );
      // Send FCM token to backend
      ipcRenderer.on(`PUSH_RECEIVER:::TOKEN_UPDATED`, (_, token) => {
        console.log("token updated", token);
      });
      // Display notification
      ipcRenderer.on(
        `PUSH_RECEIVER:::NOTIFICATION_RECEIVED`,
        (_, serverNotificationPayload) => {
          // check to see if payload contains a body string, if it doesn't consider it a silent push
          if (serverNotificationPayload.notification.body) {
            // payload has a body, so show it to the user
            console.log("display notification", serverNotificationPayload);
            let myNotification = new Notification(
              serverNotificationPayload.notification.title,
              {
                body: serverNotificationPayload.notification.body,
                silent: false,
              }
            );

            myNotification.onclick = () => {
              console.log("Notification clicked");
            };
          } else {
            // payload has no body, so consider it silent (and just consider the data portion)
            console.log(
              "do something with the key/value pairs in the data",
              serverNotificationPayload.data
            );
          }
        }
      );
      // Start service
      const senderId = "35251212791"; // <-- replace with FCM sender ID from FCM web admin under Settings->Cloud Messaging
      console.log("starting service and registering a client");
      ipcRenderer.send(`PUSH_RECEIVER:::START_NOTIFICATION_SERVICE`, senderId);
    }
  }, [ipcRenderer]);
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthContextProvider>
          <Component {...pageProps} />
        </AuthContextProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default MyApp;
