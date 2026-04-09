import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Testimonials() {
    interface ITestimonials {
        name: string;
        img: string;
        id: number;
        job: string;
        description: string;
    }
    const Testimonials: ITestimonials[] = [
    {
        id: 1,
        name: "Alex Rivera",
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        job: "Full-Stack Developer",
        description: "The deep dive into Node.js and Express was exactly what I needed. The project-based approach helped me build my first scalable API from scratch."
    },
    {
        id: 2,
        name: "Sarah Jenkins",
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        job: "UI/UX Designer",
        description: "I finally understood how to bridge the gap between design and code. The lessons on GSAP animations brought my static Figma frames to life!"
    },
    {
        id: 3,
        name: "Marcus Chen",
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        job: "Frontend Engineer",
        description: "The Shadcn/ui and Next.js workflow taught here is a game changer. My development speed has doubled since I started following these patterns."
    },
    {
        id: 4,
        name: "Elena Rodriguez",
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
        job: "Software Architect",
        description: "High-quality content that focuses on best practices and clean code. It’s rare to find courses that cover advanced React patterns so clearly."
    },
];
    return (
        <section className='w-full bg-slate-50/50 dark:bg-slate-900  border-t border-slate-100 dark:border-slate-800'>
            <div className="container mx-auto py-20 px-6 sm:px-10 lg:px-20 overflow-hidden">
            <div className='max-w-7xl mx-auto flex flex-col gap-12'>
                <div className='text-center max-w-2xl mx-auto flex flex-col gap-3'>
                    <h2 className='text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white'>Testimonials</h2>
                    <p className='text-lg text-muted-foreground'>What our students say about us</p>
                </div>
                <div className='w-full flex justify-center items-center px-4 md:px-12'>
                    <Carousel className="w-full max-w-5xl">
                        <CarouselContent className='-ml-4'>
                            {Testimonials.map((testimonial: ITestimonials) => (
                                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                                    <Card className="h-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                            <Avatar className="h-12 w-12 border-2 border-indigo-100 dark:border-indigo-900">
                                                <AvatarImage src={testimonial.img} />
                                                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold">{testimonial.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">{testimonial.name}</CardTitle>
                                                <CardDescription className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{testimonial.job}</CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-2 italic">
                                                "{testimonial.description}"
                                            </p>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-12 border-slate-200 hover:bg-slate-100 hover:text-indigo-600" />
                        <CarouselNext className="hidden md:flex -right-12 border-slate-200 hover:bg-slate-100 hover:text-indigo-600" />
                    </Carousel>
                </div>
            </div>
            </div>
        </section>
    )
}
