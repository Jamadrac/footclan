import Metrics from "../components/Metrics";
import C_T_A_section from "../components/C_T_A_section";
import Hero from "../components/Hero";
import Trusted_companies from "../components/Trusted_companies";
import Pricing from "./Pricing";

const Home_page = () => {
  return (
    <>
      <Hero />
      <Metrics />
      <C_T_A_section />
      <Trusted_companies />
      <Pricing />
    </>
  );
};

export default Home_page;
