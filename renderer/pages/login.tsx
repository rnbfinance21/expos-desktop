import React from "react";
import { withOutAuth } from "@/HOC/withOutAuth";
import LoginContainer from "@/modules/auth/components/LoginContainer";
import HeroSection from "@/modules/auth/components/HeroSection";
import FormSection from "@/modules/auth/components/FormSection";

const login = () => {
  return (
    <LoginContainer>
      <HeroSection />
      <FormSection />
    </LoginContainer>
  );
};

export default withOutAuth(login);
