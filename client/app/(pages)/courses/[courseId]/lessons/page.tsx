"use client"
import React, { useEffect } from 'react'
import { useLessons } from '../../../../../context/LessonContext'
import { Spinner } from '@/components/ui/spinner'
import ActiveCourse from '@/app/Mycomponents/Course/CourseActive'
import { useEnrollment } from '@/context/enrollmentContext'
import { Enrollment, ICourse, Lesson } from '@/lib/models'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useCourses } from '@/context/courseContext'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlayCircle, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function Lessons() {
  const { courseId } = useParams()
  const pathName = usePathname()
  const router = useRouter()
  
  const { enrollments, isCheck } = useEnrollment()
  const { lessons, isCheckingLessons } = useLessons()
  const { courses, isCheckingCourses } = useCourses()
  
  const course = courses?.find((course: ICourse) => course.id === courseId)

  // Wait for enrollment check to complete before routing logic
  useEffect(() => {
    if (!isCheck) {
      const filteredEnrollment = enrollments?.filter((enrollment: Enrollment) => enrollment.courseId === courseId)
      if (!filteredEnrollment || filteredEnrollment.length === 0) {
        // Not enrolled -> Redirect back to course public page
        router.replace(`/courses/${courseId}`)
      }
    }
  }, [enrollments, isCheck, courseId, router])

  if (isCheck || isCheckingCourses) {
    return (
      <div className='flex flex-col justify-center items-center h-[70vh] space-y-4'>
        <Spinner className="size-10 text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading course data...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
        <p className="text-muted-foreground text-center">We couldn't locate this course or your enrollment.</p>
        <Button onClick={() => router.push('/courses')}>Back to Catalog</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Course Overview */}
        <div className="lg:col-span-1 space-y-8">
          <ActiveCourse {...course} />
        </div>
        
        {/* Right Column: Lessons List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-[30px] font-bold tracking-tight text-slate-900 dark:text-white">Curriculum</h2>
            <p className="text-muted-foreground">Select a lesson to begin or continue your journey.</p>
          </div>

          {isCheckingLessons ? (
            <div className="flex flex-col justify-center items-center py-20 space-y-4">
              <Spinner className="size-8 text-primary" />
              <p className="text-muted-foreground">Loading curriculum...</p>
            </div>
          ) : !lessons || lessons.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center border border-dashed rounded-2xl bg-secondary/20">
              <Clock className="size-10 mb-4 opacity-30" />
              <p className="font-medium text-lg">No lessons published yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson: Lesson, index: number) => (
                <Card key={lesson.id} className="group hover:border-primary/50 transition-colors duration-300">
                  <CardContent className="p-0">
                    <Link href={`${pathName}/${lesson.id}`} className="flex items-center p-6 gap-6">
                      <div className="flex items-center justify-center size-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                        <PlayCircle className="size-6" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
                          {index + 1}. {lesson.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {lesson.overview || "Click to view lesson"}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0 group-hover:translate-x-2 transition-transform">
                         <span className="sr-only">Play</span>
                         <ArrowRightIcon className="size-5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ArrowRightIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
