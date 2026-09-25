import { HeroSection, CTA, Features, HowItWorks, Pricing, TrustProof, FAQ,ExpenseTracking } from "../components/sections";




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
