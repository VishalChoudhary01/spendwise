import { HeroSection, CTA, Features, HowItWorks, Pricing, TrustProof, FAQ,ExpenseTracking } from "../components/sections";



// import ExpenseTracking from "../components/sections/ExpenseTracking/ExpenseTracking";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ExpenseTracking/>
      <Features />
      <HowItWorks />
      <TrustProof />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
