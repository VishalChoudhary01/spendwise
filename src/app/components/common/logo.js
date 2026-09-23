"use client";

import Image from "next/image";
import { motion } from "motion/react";

const Logo = () => {
    return (
        <div className="flex items-center gap-0.5">
            <Image
                src="/logo/logo.png"
                alt="Spendwise"
                width={45}
                height={45}
                className="h-10 w-10 object-contain md:h-11 md:w-12"
                loading="eager"
            />


            <span aria-label="Spendwise" className=" font-brand md:text-xl text-[1.05rem] font-light text-textPrimary dark:text-darkTextPrimary transition-colors " >
                <span>S</span>
                <span>p</span>
                <span>e</span>
                <span>n</span>
                <span>d</span>
                <span className="font-semibold md:tracking-wider text-brand-emerald dark:text-brand-teal ">
                    <span>w</span>

                    {/* ! Animated i */}
                    <span className="relative inline-block">
                        <span>ı</span>

                        {/* ! Orange bouncing dot */}
                        <motion.span className=" absolute left-1/2 top-[0.18em] size-[0.16em] -translate-x-1/2 rounded-full bg-brand-orange "

                            initial={{
                                y: 0,
                                scale: 0.8,
                            }}
                            animate={{
                                y: [0, -2, 0],
                                scale: [0.8, 1.7, 1],
                            }}
                            transition={{
                                duration: 0.7,
                                repeat: Infinity,
                                repeatDelay: 0.6,
                                ease: [0.34, 1.56, 0.64, 1],
                            }}
                        />
                    </span>

                    <span>s</span>
                    <span>e</span>
                </span>
            </span>
        </div>
    );
};

export default Logo;