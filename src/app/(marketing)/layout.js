import { Footer, Header } from "../components/layout";
import LenisProvider from "../components/provider/lenisProvider";
import SpendwiseLoader from "../components/common/loader/SpendwiseLoader";
import PageTransition from "../transition/page/pageTransition";
export default function MarketingLayout({ children }) {
  return (
    <LenisProvider>
      <SpendwiseLoader />
      <Header />
      <main className="flex-1 overflow-clip">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </LenisProvider>
  );
}
