import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
            <span className="text-2xl font-black tracking-tighter text-indigo-600 dark:text-indigo-500">
              LMS<span className="text-slate-900 dark:text-white">Learn</span>
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering learners and creators with an intuitive, high-performance platform to master the future.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Platform</h4>
            <Link href="/courses" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">Browse Courses</Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">Pricing</Link>
            <Link href="/instructors" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">For Instructors</Link>
            <Link href="/enterprise" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">Enterprise</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Resources</h4>
            <Link href="/help" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">Help Center</Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">Blog</Link>
            <Link href="/tutorials" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">Video Tutorials</Link>
            <Link href="/community" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">Community</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Company</h4>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">About Us</Link>
            <Link href="/careers" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">Careers</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">Privacy Policy</Link>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LMSLearn Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">Twitter</Link>
            <Link href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">GitHub</Link>
            <Link href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
