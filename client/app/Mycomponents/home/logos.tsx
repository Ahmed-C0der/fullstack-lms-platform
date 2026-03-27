"use client"
import Image from 'next/image';
import React, { useRef } from 'react'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Logo {
    name: string;
    img: string;
    id: number;
}

const logos: Logo[] = [
    { name: "Coursera",     img: "https://cdn.simpleicons.org/coursera/6366F1",    id: 1 },
    { name: "Udemy",        img: "https://cdn.simpleicons.org/udemy/6366F1",       id: 2 },
    { name: "edX",          img: "https://cdn.simpleicons.org/edx/6366F1",         id: 3 },
    { name: "Skillshare",   img: "https://cdn.simpleicons.org/skillshare/6366F1",  id: 4 },
    { name: "Udacity",      img: "https://cdn.simpleicons.org/udacity/6366F1",     id: 5 },
    { name: "Khan Academy", img: "https://cdn.simpleicons.org/khanacademy/6366F1", id: 6 },
    { name: "Codecademy",   img: "https://cdn.simpleicons.org/codecademy/6366F1",  id: 7 },
    { name: "Pluralsight",  img: "https://cdn.simpleicons.org/pluralsight/6366F1", id: 8 },
];

export default function Logos() {
    const tweenRef = useRef<gsap.core.Tween | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sectionRef = useRef<HTMLDivElement | null>(null);

    // FIX 1: Divide by 2 — the window shows half the strip (one set of logos),
    // while the full logosParent contains 2× (original + clone) for seamless looping.
    const mdWidth = ((logos.length * 80) + ((logos.length - 1) * 48)) / 2;
    const width   = ((logos.length * 60) + ((logos.length - 1) * 32)) / 2;

    useGSAP(() => {
        tweenRef.current = gsap.to(".logosParent", {
            xPercent: -50,
            duration: 10,
            repeat: -1,
            ease: "none",
        });

        // FIX 2: Use containerRef directly instead of the ".window" class selector,
        // which is unreliable when scoped and could match unintended elements.
        const mm = gsap.matchMedia();

        mm.add("(min-width: 800px)", () => {
            gsap.set(containerRef.current, { width: mdWidth });
        });

        mm.add("(max-width: 799px)", () => {
            gsap.set(containerRef.current, { width: width });
        });

    }, { scope: sectionRef });

    const handleMouseEnter = () => tweenRef.current?.pause();
    const handleMouseLeave = () => tweenRef.current?.play();

    return (
        <div
            className="flex justify-center flex-col items-center w-full overflow-x-hidden logosContainer py-12 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800"
            ref={sectionRef}
        >
            <h2 className="text-center text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-8 px-4">
                Trusted by leading organizations worldwide
            </h2>

            <div
                className="flex justify-start items-center overflow-hidden"
                ref={containerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* FIX 3: logosParent must be wider than the window (2× logos) for xPercent: -50 to work */}
                <div className="logosParent flex justify-start items-center flex-nowrap gap-8 md:gap-12">
                    {logos.map((logo) => (
                        <div key={logo.id} className="w-[60px] md:w-[80px] shrink-0 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                            {/* FIX 4: objectFit is not a valid prop in Next.js 13+ Image — use className */}
                            <Image src={logo.img} alt={logo.name} width={80} height={80} className="object-contain" />
                        </div>
                    ))}
                    {logos.map((logo) => (
                        <div key={logo.id + "clone"} className="w-[60px] md:w-[80px] shrink-0 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                            <Image src={logo.img} alt={logo.name} width={80} height={80} className="object-contain" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}