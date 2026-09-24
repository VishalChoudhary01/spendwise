import Eyebrow from "@/app/components/common/Eyebrow";
import PrimaryLinkButton from "../../common/button/PrimaryLinkButton";
import SecondaryLinkButton from "../../common/button/SecondaryLinkButton";

export default function HeroCopy() {
    return (
        <div className="max-w-xl">
            {/* Eyebrow */}
            <Eyebrow label="Spendwise companion" />

            {/* Heading */}
            <h1
                className="
                    mt-5
                    md:mt-8
                    text-[clamp(2.25rem,5vw+1rem,4.5rem)]
                    font-heading
                    font-bold
                    leading-[0.98]
                    tracking-[-0.035em]
                    text-foreground
                "
            >
                Shop{" "}
                <span className="text-accent dark:text-darkBrandTeal">
                    Smarter
                </span>
                <span
                    aria-hidden="true"
                    className="
                        mx-[0.055em]
                        inline-block
                        h-[0.12em]
                        w-[0.12em]
                        translate-y-[-0.04em]
                        rounded-full
                        bg-current
                        align-baseline
                    "
                />
                <br />
                Spend{" "}
                <span className="text-accent dark:text-darkBrandTeal">
                    Better
                </span>
                <span
                    aria-hidden="true"
                    className="
                        mx-[0.055em]
                        inline-block
                        h-[0.12em]
                        w-[0.12em]
                        translate-y-[-0.04em]
                        rounded-full
                        bg-current
                        align-baseline
                    "
                />
            </h1>

            {/* Description */}
            <p
                className="
                    mt-4
                    max-w-[28rem]
                    text-base
                    leading-6
                    text-foreground-secondary
                    md:mt-5
                    md:text-lg
                    md:leading-8
                "
            >
                Compare prices, find better deals, and see your savings
                before you buy.
            </p>

            {/* CTA */}
            <div
                className="
                    mt-6
                    flex
                    flex-wrap
                    items-center
                    gap-3
                    md:mt-8
                    md:gap-4
                "
            >
                <PrimaryLinkButton href="/dashboard">
                    Start Free
                </PrimaryLinkButton>

                <SecondaryLinkButton href="#howitswork">
                    See How It Works
                </SecondaryLinkButton>
            </div>
        </div>
    );
}