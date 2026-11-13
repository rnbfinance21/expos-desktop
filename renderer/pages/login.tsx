import React from "react";
import { withOutAuth } from "../HOC/withOutAuth";
import LoginContainer from "@/src/features/auth/component/login-container";

const LoginPage = () => {
  return <LoginContainer />;
};


export default withOutAuth(LoginPage);
