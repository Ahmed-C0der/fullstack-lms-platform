"use client"
import type { ILessons } from '@/lib/models';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useLessonId } from '../lessonContext';
import { DeleteIcon, Edit, Save, TrashIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import LessonCard from './lessonCard';
/*
this page will show all the lessons that the user has created in courese he choiced from courseBuilder page
*/
export default function AllLessons() {
  const { setLessonId } = useLessonId();
  const { courseId } = useParams();
  const [lessons, setLessons] = useState<ILessons[] | null>(null);
  const [isLoad, setIsload] = useState<boolean>(true);
  const useLessonss = async (): Promise<void> => {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_SERVER || "http://localhost:5000"
      const response: Response = await fetch(`${url}/api/courses/${courseId}/lessons/admin`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      if (response.ok) {
        const lessons: ILessons[] = await response.json();
        // Extract array depending on the backend response format
        setLessons(lessons);
      }
    } catch (error: any) {
      console.error(error);
      setLessons(null);
    } finally {
      setIsload(false);
    }
  }
  useEffect(() => {
    useLessonss();
  }, [courseId])
  return (
    <div className='container'>
      <h1>All Lessons</h1>
      {/* <p>Course ID: {courseId}</p> */}
      {isLoad ? (
        <Spinner />
      ) : lessons && lessons.length > 0 ? (
        <div className=" grid-cols-auto-fit gap-6">
          {lessons.map((lesson) => (
            <LessonCard category={lesson.category}durationSeconds={lesson.durationSeconds}id={lesson.id}isPublished={lesson.isPublished} 
              overview={lesson.overview} title={lesson.overview}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center p-8">
          <p className="text-slate-500">No lessons found</p>
          <Link href={`/courseBuilder/${courseId}/buildLesson`}>
            <Button>Create Lesson</Button>
          </Link>
        </div>
      )}



    </div>
  )
}



