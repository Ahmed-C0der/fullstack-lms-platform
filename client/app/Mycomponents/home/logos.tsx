"use client"
import Image from 'next/image';
import React, { useRef, useState } from 'react'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
export default function Logos() {
    const tweenRef = useRef<gsap.core.Tween | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sectionRef = useRef<HTMLDivElement | null>(null);
    interface Logo {
        name: string;
        img: string;
        id: number;
    }
    const Logos: Logo[] = [
        {
            name: "Coursera",
            img: "https://cdn.simpleicons.org/coursera/6366F1", // Indigo color
            id: 1
        },
        {
            name: "Udemy",
            img: "https://cdn.simpleicons.org/udemy/6366F1",
            id: 2
        },
        {
            name: "edX",
            img: "https://cdn.simpleicons.org/edx/6366F1",
            id: 3
        },
        {
            name: "Skillshare",
            img: "https://cdn.simpleicons.org/skillshare/6366F1",
            id: 4
        },
        {
            name: "Udacity",
            img: "https://cdn.simpleicons.org/udacity/6366F1",
            id: 5
        },
        {
            name: "Khan Academy",
            img: "https://cdn.simpleicons.org/khanacademy/6366F1",
            id: 6
        },
        {
            name: "Codecademy",
            img: "https://cdn.simpleicons.org/codecademy/6366F1",
            id: 7
        },
        {
            name: "Pluralsight",
            img: "https://cdn.simpleicons.org/pluralsight/6366F1",
            id: 8
        },
    ];
    const mdWidth = ((Logos.length * 80) + ((Logos.length - 1) * 48)) / 2;
    const width = ((Logos.length * 60) + ((Logos.length - 1) * 32)) / 2;

    useGSAP(() => {
        tweenRef.current = gsap.to(".logosParent", { xPercent: -50, duration: 10, repeat: -1, ease: "none", });
        gsap.set(containerRef?.current, {
            width: mdWidth,
        });
        let matchMedia = gsap.matchMedia()

            matchMedia.add({
                isMobile: "(max-width: 768px)",
                isDesktop: "(min-width: 769px)",
            }, (context) => {
                switch (context.conditions) {
                    case "isMobile":
                        gsap.set(containerRef?.current, {
                            width: width+"px",
                        });
                        break;
                    case "isDesktop":
                        gsap.set(containerRef?.current, {
                            width: mdWidth+"px",
                        });
                        break;
                }
            })
    }, { scope: sectionRef });
    const handleMouseEnter = () => tweenRef.current?.pause();
    const handleMouseLeave = () => tweenRef.current?.play();
    return (
        <div className={`flex justify-center flex-col items-center w-full overflow-x-hidden logosContainer py-12 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800`} ref={sectionRef}>
            <h2 className='text-center text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-8 px-4'>
                Trusted by leading organizations worldwide
            </h2>
            {/* Window should its width be half of logos width with gap */}
            <div className='flex justify-start w-[480px] md:w-[640px] items-center  flex-nowrap gap-8 md:gap-12  pl-4 md:pl-12' ref={containerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {/* tabe */}

                <div className="logosParent">
                    {Logos.map((logo: Logo) => (
                        <div key={logo.id} className={`w-[60px] md:w-[80px] shrink-0 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0`}>
                            <Image src={logo.img} alt={logo.name} width={80} height={80} objectFit='contain' />
                        </div>
                    ))}
                    {Logos.map((logo: Logo) => (
                        <div key={logo.id + "clone"} className={`w-[60px] md:w-[80px] shrink-0 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0`}>
                            <Image src={logo.img} alt={logo.name} width={80} height={80} objectFit='contain' />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}