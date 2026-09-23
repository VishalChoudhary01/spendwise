import {
  Plus_Jakarta_Sans,
  Sora,
  Bricolage_Grotesque,
  Basic,
} from "next/font/google";

import "./globals.css";

import ReduxProvider from "@/app/components/provider/reduxProvider";
import ThemeProviderWrapper from "@/app/components/provider/ThemeProviderWrapper";
import Hydration from "@/app/components/provider/Hydration";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-brand",
  subsets: ["latin"],
  display: "swap",
});

const basic = Basic({
  variable: "--font-basic",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata = {
  title: "Spendwise",
  description: "Spend smarter. Buy better.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${sora.variable} ${bricolage.variable} ${basic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-jakarta">
        <ReduxProvider>
          <ThemeProviderWrapper>
            <Hydration>{children}</Hydration>
          </ThemeProviderWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}