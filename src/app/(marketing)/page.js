import { HeroSection, ProductComparisonSection, ShoppingListsShowcaseSection,CTA,Features,HowItWorks,Pricing,TrustProof ,FAQ} from "../components/sections";


export default function Home() {
  return (
    <>
      <HeroSection />
      <ProductComparisonSection />
      <ShoppingListsShowcaseSection />
      <Features/>
      <HowItWorks/>
      <TrustProof/>
      <Pricing/>
      <FAQ/>
      <CTA/>
    </>
  );
}