"use client"
import React, { useEffect, useState } from 'react'
import { useLessons } from '../../../../../../context/LessonContext'
import { Lesson } from '@/lib/models'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Paperclip, CheckCircle } from 'lucide-react'

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams()
  const router = useRouter()

  const { lessons, isCheckingLessons } = useLessons()
  const [lessonData, setLessonData] = useState<Lesson | null>(null)
  
  // Progress states
  const [isCompleted, setIsCompleted] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  // Fix: Added `lessonId` so this updates when navigating between lessons in sidebar
  useEffect(() => {
    if (lessons && lessons.length > 0) {
      const lesson = lessons.find((l: Lesson) => l.id === lessonId)
      setLessonData(lesson || null)
      setIsCompleted((lesson as any)?.lessonProgress?.[0]?.isCompleted || false)
    }
  }, [lessons, lessonId])
  
  const handleToggleComplete = async () => {
    try {
      setIsToggling(true)
      const newStatus = !isCompleted;
      setIsCompleted(newStatus); // optimistic ui update
      
      await fetch(`http://localhost:5000/api/courses/${courseId}/lessons/${lessonId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "login" === "login" ? "include" : "omit",
        body: JSON.stringify({ isCompleted: newStatus })
      })
    } catch (err) {
      console.error("Failed to mark complete:", err)
      setIsCompleted(!isCompleted) // revert on fail
    } finally {
      setIsToggling(false)
    }
  }

  if (isCheckingLessons) {
    return (
      <div className='flex flex-col justify-center items-center h-[70vh] space-y-4'>
        <Spinner className="size-10 text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading lesson...</p>
      </div>
    )
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <h1 className="text-2xl font-bold">No Lessons Available</h1>
        <Button onClick={() => router.push(`/courses/${courseId}`)}>Back to Course</Button>
      </div>
    )
  }

  if (!lessonData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Lesson Not Found</h1>
        <p className="text-muted-foreground">The lesson you are looking for does not exist in this course.</p>
        <Button onClick={() => router.push(`/courses/${courseId}/lessons`)}>
           <ArrowLeft className="size-4 mr-2" />
           Back to Curriculum
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full animate-in fade-in duration-500 pb-20">
      
      {/* Primary Video / Content Column */}
      <div className="flex-1 space-y-6">
        {/* Video Wrapper */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
          {lessonData.videoUrl ? (
            <iframe 
              src={lessonData.videoUrl} 
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          ) : (
             <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                <p>No video available for this lesson</p>
             </div>
          )}
        </div>

        {/* Lesson Metadata */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {lessonData.title}
            </h1>
            <Button 
                variant={isCompleted ? "default" : "outline"}
                className={`shrink-0 gap-2 font-medium ${isCompleted ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-transparent' : ''}`}
                onClick={handleToggleComplete}
                disabled={isToggling}
            >
                {isCompleted ? "Completed" : "Mark as Complete"}
                <CheckCircle className={`size-4 ${isCompleted ? 'text-white' : ''}`} />
            </Button>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            {lessonData.overview || "This lesson does not have a detailed overview."}
          </p>
        </div>
      </div>

      {/* Secondary Tools Column (Notes, Files) */}
      <div className="w-full xl:w-[350px] shrink-0 space-y-6">
        
        {/* Notes Module placeholder */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
           <div className="flex items-center gap-2 mb-4">
             <BookOpen className="size-5 text-indigo-500" />
             <h3 className="font-semibold text-lg">My Notes</h3>
           </div>
           <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm text-muted-foreground border border-dashed border-slate-200 dark:border-slate-800 text-center">
              Personal note-taking <br/> (Coming Soon)
           </div>
        </div>

        {/* Attachments Module placeholder */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
           <div className="flex items-center gap-2 mb-4">
             <Paperclip className="size-5 text-indigo-500" />
             <h3 className="font-semibold text-lg">Attachments</h3>
           </div>
           <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm text-muted-foreground border border-dashed border-slate-200 dark:border-slate-800 text-center">
              No files attached to this lesson
           </div>
        </div>

      </div>

    </div>
  )
}
