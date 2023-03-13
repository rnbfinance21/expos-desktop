import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_x7dUR5jtnL-28Xvmzq6cUoE77qzzSpM",
  authDomain: "expos-32b21.firebaseapp.com",
  projectId: "expos-32b21",
  storageBucket: "expos-32b21.appspot.com",
  messagingSenderId: "35251212791",
  appId: "1:35251212791:web:699146ef4f12f7160b9ef2",
  measurementId: "G-RJ3GXLJ5XG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const message = getMessaging(app);

// function requestPermission() {
//   Notification.requestPermission().then((permission) => {
//     if (permission === "granted") {
//       console.log("notification permission granted");
//       getToken(message, {
//         vapidKey:
//           "BHNPcu8s0el0NcOAPGJlzxyNr2TWGZhDUkzUagu4mVkL9LW2xiRLZ9Og3cO3v35N3uli4dJPCpHk5bAujHnHzSs",
//       }).then((currentToken) => {
//         if (currentToken) {
//           console.log("currentToken: ", currentToken);
//         } else {
//           console.log("Can not get token");
//         }
//       });
//     } else {
//       console.log("Do not have permission");
//     }
//   });
// }

// requestPermission();
