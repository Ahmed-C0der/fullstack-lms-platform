"use client"

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useCourses } from '@/context/courseContext'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { type Enrollment, type ILessons } from '@/lib/models'
import { Spinner } from '@/components/ui/spinner'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { usePathname } from 'next/navigation'
import { useEnrollment } from '@/context/enrollmentContext'
import getLessons from "@/lib/getDataFromDB"
import interactWithDB from '@/lib/getDataFromDB'
import { useAuth } from '@/context/AuthContext'
import { BookOpen, Clock, Globe, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function CourseIdPage() {
    const pathName = usePathname()
    const router = useRouter();
    const { courseId } = useParams()
    const { courses } = useCourses()
    const { enrollments, editLocallEnrollemnts } = useEnrollment()
    const { user } = useAuth()

    const [check, setCheck] = useState<boolean>(true) 
    const [lessons, setLessons] = useState<ILessons[] | null>(null)

    const course = courses?.find((course) => course.id === courseId)

    const EnrollNow = async () => {
        if (user) {
            const { target } = await interactWithDB<Enrollment>(`/api/enrollments/${courseId}`, "POST")
            if (target) {
                editLocallEnrollemnts(target)
                router.replace(pathName + "/lessons")
            }
        } else {
            router.replace("/login")
        }
    }

    useEffect(() => {
        const fetchLessons = async () => {
            const { target, isFinished } = await getLessons<ILessons[]>(`/api/courses/${courseId}/lessons`);
            setLessons(target)
            setCheck(!isFinished)
        }
        fetchLessons()
    }, [courseId])

    useEffect(() => {
        const filterdEnrollment = enrollments?.filter((enrollment: Enrollment) => enrollment.courseId === courseId)
        if (filterdEnrollment && filterdEnrollment?.length > 0) {
            router.replace(pathName + "/lessons")
        } else {
            setCheck(false) // Only set to false once we know they aren't enrolled and redirected
        }
    }, [enrollments, courseId, pathName, router])

    if (check) {
        return (
            <div className='flex flex-col justify-center items-center h-screen space-y-4'>
                <Spinner className="size-10 text-primary" />
                <p className="text-muted-foreground animate-pulse font-medium">Loading course details...</p>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
                <BookOpen className="size-20 text-muted-foreground opacity-20" />
                <h1 className="text-3xl font-bold tracking-tight">Course Not Found</h1>
                <p className="text-muted-foreground max-w-sm text-center">We couldn't locate this course. It may have been removed or the URL is incorrect.</p>
                <Button onClick={() => router.push('/courses')}>Back to Catalog</Button>
            </div>
        )
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 animate-in fade-in duration-500">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/imgs/grid-pattern.svg')] opacity-10"></div>
                
                <div className="container mx-auto px-6 py-20 lg:px-8 relative z-10 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <div className="flex flex-wrap gap-2">
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 px-3 py-1 text-xs">
                                {course.level || "BEGINNER"}
                            </Badge>
                            {Array.isArray(course.category) ? course.category.map((cat, i) => (
                               <Badge key={i} variant="secondary" className="bg-white/10 hover:bg-white/20 text-indigo-100 border-0">
                                   {cat}
                               </Badge>
                            )) : (
                               <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-indigo-100 border-0">
                                   {course.category}
                               </Badge>
                            )}
                        </div>
                        
                        <h1 className="text-[30px] md:text-[40px] font-bold leading-tight tracking-tight">
                            {course.title}
                        </h1>
                        <p className="text-base md:text-lg text-indigo-100/80 leading-relaxed max-w-2xl">
                            {course.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-indigo-100/70 pt-4">
                            <div className="flex items-center gap-2">
                                <Globe className="size-4" />
                                <span>{course.language || 'English'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="size-4 text-emerald-400" />
                                <span>Verified Instructor</span>
                            </div>
                        </div>
                    </div>

                    {/* Floating Pricing Card */}
                    <Card className="w-full md:w-[380px] shrink-0 border-0 shadow-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden rounded-2xl transform md:-translate-y-4">
                        <div className="relative aspect-video w-full bg-slate-100">
                            <Image 
                                src={course.thumbnailUrl || "/imgs/course.png"} 
                                alt={course.title} 
                                fill 
                                className="object-cover" 
                                priority
                            />
                        </div>
                        <CardContent className="p-8 space-y-6">
                            <div className="text-[32px] font-bold">
                                {course.price === 0 ? "Free" : `$${course.price}`}
                            </div>
                            <Button 
                                size="lg" 
                                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-md py-6 text-lg"
                                onClick={EnrollNow}
                            >
                                Enroll Now
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Full lifetime access • Access on mobile and TV
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Course Content Structure */}
            <div className="container mx-auto px-6 py-16 lg:px-8 max-w-4xl max-md:max-w-none ml-0 md:ml-[10%]">
                <section className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[24px] font-semibold tracking-tight text-slate-900 dark:text-white">
                            Course Content
                        </h2>
                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
                            <BookOpen className="size-4" />
                            {lessons ? lessons.length : 0} Lessons
                        </span>
                    </div>

                    <Accordion type="single" collapsible className="w-full border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                        {lessons && lessons.length > 0 ? (
                            lessons.map((lesson: ILessons, index) => (
                                <AccordionItem 
                                  value={lesson.id} 
                                  key={lesson.id} 
                                  className="border-b last:border-0 border-slate-100 dark:border-slate-800 px-2"
                                >
                                    <AccordionTrigger className="hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50 px-4 py-5 rounded-xl transition-colors">
                                        <div className="flex items-center text-left gap-4 w-full pr-4">
                                            <span className="flex items-center justify-center size-8 rounded-full bg-secondary text-xs font-semibold text-muted-foreground shrink-0">
                                                {index + 1}
                                            </span>
                                            <span className="text-[16px] font-medium text-slate-800 dark:text-slate-200">
                                                {lesson.title}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-16 pb-6 text-muted-foreground text-sm leading-relaxed">
                                        {lesson.overview || "No overview provided for this lesson."}
                                    </AccordionContent>
                                </AccordionItem>
                            ))
                        ) : (
                            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                                <Clock className="size-10 mb-4 opacity-20" />
                                <p className="font-medium text-lg text-slate-700 dark:text-slate-300">Lessons are being prepared</p>
                                <p className="text-sm mt-1">This course is currently in progress. Check back soon!</p>
                            </div>
                        )}
                    </Accordion>
                </section>
            </div>
        </div>
    )
}
