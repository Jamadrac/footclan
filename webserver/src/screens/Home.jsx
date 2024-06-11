import React from "react";
import Metrics from "./Homex/Metrics";
import C_T_A_section from "./Homex/C_T_A_section";
import Hero from "./Homex/Hero";
import Trusted_companies from "./Homex/Trusted_companies";
import Pricing from "./Homex/Pricingh";

const LoginScreen = () => {
  return (
    <div>
      <>
        <Hero />
        <Metrics />
        <C_T_A_section />
        <Trusted_companies />
        <Pricing />
      </>
    </div>
  );
};

export default Home;
