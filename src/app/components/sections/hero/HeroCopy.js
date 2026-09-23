import { FiArrowRight } from "react-icons/fi";
import Eyebrow from "@/app/components/common/Eyebrow";
import Link from "next/link";

export default function HeroCopy() {
    return (
        <div className="max-w-xl">
            {/* Eyebrow */}
            <Eyebrow label={"Smart shopping companion"} />
            <h1 className="mt-5 md:mt-8 text-[clamp(2.25rem,5vw+1rem,4.5rem)] font-heading font-bold leading-[0.98] tracking-[-0.035em] text-foreground">
                Shop{" "}
                <span  className="text-accent dark:text-darkBrandTeal [text-shadow:0_1px_2px_rgba(15,118,110,0.25),0_6px_18px_rgba(15,118,110,0.18)]"  >
                    Smarter
                </span>

                <span className="font-basic">.</span>
                
                <br />
                Spend{" "}
                <span  className="text-accent dark:text-darkBrandTeal [text-shadow:0_1px_2px_rgba(15,118,110,0.25),0_6px_18px_rgba(15,118,110,0.18)]" >
                    Better
                </span>
                <span className="font-basic">.</span>
            </h1>

            <p className="mt-4 md:mt-5 max-w-[28rem] text-base md:text-lg leading-6 md:leading-8 text-foreground-secondary">
                Add what you need, compare supported prices, and see what
                you&rsquo;d save before you buy.
            </p>

            {/* CTAs  */}
            <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <Link
                    href="/dashboard"
                    className="group inline-flex h-10 md:h-12 font-jakarta items-center gap-2 rounded-full bg-action px-5 md:px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-action-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"  >
                    Start Free
                    <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                    href="#how-it-works"
                    className="group inline-flex h-10 md:h-12 font-jakarta items-center gap-2 rounded-full border border-accent/50 bg-transparent px-4 md:px-5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-accent hover:bg-accent/8 hover:text-brand-deep-forest dark:hover:text-accent active:bg-accent/14 active:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"   >
                    See How It Works
                    <FiArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>
        </div>
    );
}
