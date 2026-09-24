import { MotionConfig } from "motion/react";
import { Footer, Header } from "../components/layout";
import LenisProvider from "../components/provider/lenisProvider";
import SpendwiseLoader from "../components/common/loader/SpendwiseLoader";
import ScrollProgress from "../components/common/ScrollProgress";
import PageTransition from "../transition/page/pageTransition";

export default function MarketingLayout({ children }) {
  return (
    /*
     * Centralized reduced-motion handling (spec §8): every transform-based
     * animation on the landing page degrades to static for users who
     * prefer reduced motion, while opacity keeps content readable.
     */
    <MotionConfig reducedMotion="user">
      <LenisProvider>
        {/* Subtle scroll orientation (spec §27) — thin, accent, no glow. */}
        <ScrollProgress />
        <SpendwiseLoader />
        <Header />
        <main className="flex-1 overflow-clip">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </LenisProvider>
    </MotionConfig>
  );
}
