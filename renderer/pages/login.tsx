import React from "react";
import { withOutAuth } from "@/HOC/withOutAuth";
import LoginShell from "@/features/auth/components/login-shell";

const login = () => {
  return <LoginShell />;
};

export default withOutAuth(login);
