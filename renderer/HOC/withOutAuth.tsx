/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import Router from "next/router";
import { useAuth } from "../hooks/AuthContext";

const redirectTo = "/home";

export const withOutAuth = (WrappedComponent: any) => {
  const Wrapper = (props: any) => {
    const { token } = useAuth();

    useEffect(() => {
      if (token) {
        Router.replace(redirectTo, redirectTo, { shallow: true });
      }
    }, [token]);

    return <WrappedComponent {...props} />;
  };

  // Copy getInitial props so it will run as well
  if (WrappedComponent.getLayout) {
    Wrapper.getLayout = WrappedComponent.getLayout;
  }

  return Wrapper;
};
