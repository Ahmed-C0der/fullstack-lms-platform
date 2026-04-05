"use client"
import React, { useEffect, useState } from 'react'
import { Enrollment, type ICourse } from "@/lib/models"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import interactWithDB from '@/lib/getDataFromDB'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, Globe, Maximize, Clock, FileBadge } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

export default function CourseActive(props: ICourse) {
  const { id, title, description, thumbnailUrl } = props
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [link, setLink] = useState<string | undefined>(undefined)
  const [isLoad, setIsload] = useState<boolean>(true)
  const pathName = usePathname()

  useEffect(() => {
    const fetchEnrollment = async () => {
      const { target, isFinished } = await interactWithDB<Enrollment>(`/api/enrollments/${id}`)
      setEnrollment(target)
      if (target) {
        setLink(target.lastLesson)
      }
      setIsload(!isFinished)
    }
    fetchEnrollment()
  }, [id])

  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md overflow-hidden sticky top-24">
      {/* Course Thumbnail Container */}
      <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <Image 
          src={thumbnailUrl || "/imgs/course.png"} 
          alt={title + " Thumbnail"} 
          fill
          className="object-cover"
          priority
        />
        {/* Overlay dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
        
        {/* Level Badge overlaid on image */}
        <Badge className="absolute top-3 left-3 bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-sm">
          {props.level || "BEGINNER"}
        </Badge>
        
        {/* Play Action Float */}
        <div className="absolute bottom-4 left-4 right-4">
          {isLoad ? (
            <Button disabled className="w-full bg-primary/80 text-white h-12 shadow-lg backdrop-blur-sm">
               <Spinner className="size-5 mr-2" /> Loading Progress...
            </Button>
          ) : (
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white h-12 shadow-lg font-semibold text-base transition-transform hover:scale-[1.02]">
              <Link href={`${pathName}/${link || ''}`}>
                <PlayCircle className="size-5 mr-2" />
                {link ? "Resume Course" : "Start Course"}
              </Link>
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        <div>
           <div className="flex flex-wrap gap-2 mb-3">
              {Array.isArray(props.category) ? props.category.map((cat, i) => (
                <Badge key={i} variant="secondary" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                  {cat}
                </Badge>
              )) : (
                <Badge variant="secondary" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                  {props.category}
                </Badge>
              )}
           </div>
           <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight mb-2">
             {title}
           </h1>
           <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
             {description}
           </p>
        </div>

        {/* Progress Bar Display */}
        {enrollment && enrollment.progressPercent !== undefined && (
          <div className="space-y-2">
             <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-slate-700 dark:text-slate-300">Overall Progress</span>
                <span className="text-primary">{enrollment.progressPercent}%</span>
             </div>
             <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-in-out" 
                  style={{ width: `${enrollment.progressPercent}%` }}
                ></div>
             </div>
          </div>
        )}

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Course Metadata */}
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
           <div className="flex items-center gap-3">
             <Globe className="size-4 text-emerald-500" />
             <span>Language: <strong>{props.language || "English"}</strong></span>
           </div>
           <div className="flex items-center gap-3">
             <FileBadge className="size-4 text-indigo-500" />
             <span>Certificate of completion</span>
           </div>
           <div className="flex items-center gap-3">
             <Maximize className="size-4 text-purple-500" />
             <span>100% Online & Self-Paced</span>
           </div>
        </div>
      </CardContent>
    </Card>
  )
}
