import React from "react";
import Container from "../components/login/Container";
import { withOutAuth } from "../HOC/withOutAuth";
import HeroSection from "../components/login/HeroSection";
import FormSection from "../components/login/FormSection";

const login = () => {
  return (
    <Container>
      <HeroSection />
      <FormSection />
    </Container>
  );
};

export default withOutAuth(login);
