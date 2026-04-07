import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Hero() {
  return (
    <section className="w-full ">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 md:py-24 px-6 sm:px-10 lg:px-20 ">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">
            The Intellectual Atelier
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
            Elevate Your Skills with Our <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500">
              Expert-Led Courses
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            Unlock your potential with our premium courses taught by industry leaders. Flexible, affordable, and designed for real-world impact.
          </p>
          <div className="pt-4">
            <Link href="/courses">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-semibold text-base px-8 h-12">
              Explore Courses
              <ArrowRight />
            </Button>
            </Link>
          </div>
        </div>
        <div className="relative aspect-square md:aspect-4/3 w-full max-w-lg mx-auto md:max-w-none">
          {/* Decorative background blur */}
          <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl -z-10 transform translate-x-4 translate-y-4" />
          <Image 
            src="/imgs/hero.png" 
            alt="Hero" 
            fill 
            className="object-cover rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800" 
            priority
          />
        </div>
      </div>
    </section>
  )
}
