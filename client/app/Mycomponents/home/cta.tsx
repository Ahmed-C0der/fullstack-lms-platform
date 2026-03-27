"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white ">
      {/* Decorative background element */}
      <div className="container mx-auto py-20 px-6 sm:px-10 lg:px-20 relative overflow-hidden rounded-md my-10">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-20 w-96 h-96 bg-white rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Ready to Start Your Learning Journey?
        </h2>
        <p className="text-lg md:text-xl text-slate-100 max-w-2xl leading-relaxed">
          Join thousands of students and instructors. Master new skills or share your expertise with our high-performance LMS platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button size="lg" variant="secondary" className="text-indigo-600 font-semibold w-full sm:w-auto hover:bg-slate-100/90 transition-colors" asChild>
            <Link href="/courses">
              Explore Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" className="border border-white bg-transparent hover:bg-white text-white hover:text-indigo-600 shadow-none w-full sm:w-auto transition-colors" asChild>
            <Link href="/auth/signup">
              Become an Instructor
            </Link>
          </Button>
        </div>
      </div>
      </div>
    </section>
  )
}
