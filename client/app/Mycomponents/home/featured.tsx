"use client"
import React from 'react'
import type { ICourse } from '@/lib/models'
import { Spinner } from "@/components/ui/spinner"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import CourseCard from '../Course/CourseCard'
export default function Featured() {
    const [courses, setCourses] = React.useState<ICourse[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | null>(null)
    React.useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true)
            setError(null)
            try {
                const url = process.env.NEXT_PUBLIC_BACKEND_SERVER || "http://localhost:5000"
                const response = await fetch(`${url}/api/courses/featured`)
                const courses = await response.json()
                if (!response.ok) {
                    throw new Error(courses.message)
                }
                setCourses(courses)
                console.log(courses.length)
            } catch (error) {
                if (error instanceof Error) {
                    console.log("Auth check failed:", error.message);
                } else {
                    console.log("An unexpected error occurred:", error);
                }
            }
            finally {
                setLoading(false)
            }
        }
        fetchCourses()
    }, [])
    return (
        <section className='w-full  bg-slate-50 dark:bg-slate-900/50'>
            <div className="container py-16 px-6 sm:px-10 lg:px-20 flex justify-center items-center flex-col gap-10 mx-auto">
            <div className='text-center max-w-2xl flex flex-col gap-3'>
                <h2 className='text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white'>Featured Courses</h2>
                <p className='text-lg text-muted-foreground'>Check out our hand-picked selection of top-rated courses to accelerate your career.</p>
            </div>
            <div className='w-full max-w-7xl grid grid-cols-auto-fit justify-center items-stretch gap-8'>
                {loading && <div className="col-span-full flex justify-center py-12"><Spinner /></div>}
                {error && <p className="col-span-full text-center text-red-500">{error}</p>}
                {courses?.map((course: ICourse) => (
                    <CourseCard description={course.description} key={course.id}
                    id={course.id} thumbnailUrl={course.thumbnailUrl||"/img/course.png"} title={course.title}/>
                ))}
                </div>
            </div>
        </section>
    )
}
