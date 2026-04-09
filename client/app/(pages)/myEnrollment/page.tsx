"use client"
import CourseCard from '@/app/Mycomponents/Course/CourseCard'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { EnrollmentContextProvider, useEnrollment } from '@/context/enrollmentContext'
import { Enrollment } from '@/lib/models'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function MyEnrollment() {
  const { enrollments, isCheck } = useEnrollment()
  const { user, isCheckingAuth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isCheckingAuth && !user) {
      router.replace("/login")
    }
  }, [isCheckingAuth, user, router])

  if (isCheckingAuth) return null

  return (
    <>
    <div className="container mx-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold tracking-tight">My Active Enrollments</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Pick up where you left off and keep expanding your knowledge.
        </p>
      </div>

      {isCheck ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <Spinner className="size-8 text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading your learning path...</p>
        </div>
      ) : enrollments && enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {enrollments.map((enrollment: Enrollment) => (
            <CourseCard 
              key={enrollment.id}
              description={enrollment.course.description} 
              id={enrollment.course.id} 
              thumbnailUrl={enrollment.course.thumbnailUrl || "/imgs/course.png"}
              title={enrollment.course.title}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/30 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-6 opacity-40" />
          <h2 className="text-2xl font-semibold mb-2">No active enrollments found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            You haven't enrolled in any courses yet. Browse our extensive catalog and kickstart your learning journey today!
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-md">
            <Link href="/courses">Explore Courses</Link>
          </Button>
        </div>
      )}
    </div>

    </>
  )
}
