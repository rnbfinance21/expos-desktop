import React from "react";
import { withOutAuth } from "../HOC/withOutAuth";
import LoginContainer from "../modules/auth/components/login-container";

const LoginPage = () => {
  return <LoginContainer />;
};


export default withOutAuth(LoginPage);
