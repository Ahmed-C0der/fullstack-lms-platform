import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Trophy, Award, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 opacity-50 block"></div>
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <Badge className="mb-6 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 border-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest shadow-sm">
            Our Mission
          </Badge>
          
          <h1 className="text-[40px] md:text-[56px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
            Empowering the world to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">learn without limits</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            We are building the absolute best infrastructure for the next generation of online learning to deliver high-quality, interactive, and accessible education for everyone, everywhere.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="h-14 px-8 text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-primary text-primary-foreground w-full sm:w-auto">
              <Link href="/courses">Start Learning Today</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base font-semibold w-full sm:w-auto">
              <Link href="/login">Create an Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Values / Stats */}
      <section className="py-24 container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Users, title: "10,000+", desc: "Active Learners", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
            { icon: BookOpen, title: "1,200+", desc: "Premium Courses", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
            { icon: Trophy, title: "Elite", desc: "Expert Instructors", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
            { icon: Award, title: "100%", desc: "Verified Certificates", color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-100 dark:bg-pink-900/30" },
          ].map((stat, i) => (
            <Card key={i} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className={`size-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${stat.bg} ${stat.color}`}>
                  <stat.icon className="size-8" />
                </div>
                <h3 className="text-[30px] font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{stat.title}</h3>
                <p className="font-medium text-muted-foreground">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/imgs/grid-pattern.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 text-center relative z-10 max-w-3xl">
          <h2 className="text-[32px] md:text-[48px] font-bold tracking-tight mb-6 leading-tight">
            Ready to jumpstart your career?
          </h2>
          <p className="text-lg md:text-xl text-indigo-100/80 mb-10 max-w-2xl mx-auto">
            Join thousands of students spanning the globe who are already advancing their skills securely and achieving their ultimate goals.
          </p>
          <Button asChild size="lg" variant="secondary" className="h-14 px-8 text-base bg-white text-indigo-900 hover:bg-slate-100 hover:scale-105 flex items-center mx-auto gap-3 group w-fit transition-all shadow-xl">
            <Link href="/courses">
               Explore the Catalog
               <ArrowRight className="size-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
      
    </div>
  )
}
