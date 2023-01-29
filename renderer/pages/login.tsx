import React from "react";
import Container from "../components/login/Container";
import AuthForm from "../components/login/AuthForm";
import { withOutAuth } from "../HOC/withOutAuth";

const login = () => {
  return (
    <Container>
      <AuthForm />
    </Container>
  );
};

export default withOutAuth(login);
