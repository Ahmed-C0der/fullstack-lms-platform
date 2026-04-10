"use client"
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import interactWithDB from '@/lib/getDataFromDB'
import { Enrollment } from '@/lib/models'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { BookOpen, Trophy, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Dashboard() {
  const { user, isCheckingAuth } = useAuth()
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!user) {
        router.replace("/login")
      } else {
        fetchEnrollments()
      }
    }
  }, [isCheckingAuth, user, router])

  const fetchEnrollments = async () => {
    setIsLoading(true)
    const { target } = await interactWithDB<Enrollment[]|any>('/api/enrollments/me')
    if (target) {
      setEnrollments(Array.isArray(target) ? target : [])
    }
    setIsLoading(false)
  }

  if (isCheckingAuth || isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>
  }

  const totalCourses = enrollments.length
  const completedCourses = enrollments.filter(e => e.progressPercent === 100).length
  const inProgressCourses = totalCourses - completedCourses

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 bg-secondary/10 p-4 sm:p-6 rounded-2xl border text-center sm:text-left">
        <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-primary shadow-sm">
          <AvatarImage src={user?.avatarUrl || ""} alt={user?.userName} />
          <AvatarFallback className="text-xl sm:text-2xl">{user?.userName?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {user?.userName}!</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Ready to continue your learning journey today?</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">Courses you have joined</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCourses}</div>
            <p className="text-xs text-muted-foreground">Keep up the good work</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCourses}</div>
            <p className="text-xs text-muted-foreground">Fully finished courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Enrollments Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 tracking-tight">My Learning</h2>
        {enrollments.length === 0 ? (
          <div className="text-center py-12 bg-secondary/10 rounded-2xl border border-dashed">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-foreground">No courses yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">Start exploring courses and enroll to see them here.</p>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {enrollments.map((enrolled) => (
              <Card key={enrolled.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                <div className="relative h-48 w-full bg-secondary/20">
                  {enrolled.course?.thumbnailUrl ? (
                    <Image 
                      src={enrolled.course.thumbnailUrl} 
                      alt={enrolled.course.title || "Course thumbnail"} 
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-3 border-t">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-secondary rounded-full">
                      {enrolled.course?.level || "BEGINNER"}
                    </span>
                    <span className="text-xs text-muted-foreground">{enrolled.progressPercent.toFixed(0)}%</span>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    {enrolled.course?.title || "Untitled Course"}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="mt-auto pt-2">
                  <div className="w-full bg-secondary mb-4 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                      style={{ width: `${Math.min(Math.max(enrolled.progressPercent, 0), 100)}%` }}
                    ></div>
                  </div>
                  <Button asChild className="w-full relative overflow-hidden group/btn">
                    <Link href={`/courses/${enrolled.courseId}${enrolled.lastLesson && enrolled.lastLesson !== "not found" ? `/lessons/${enrolled.lastLesson}` : ''}`}>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                       {enrolled.progressPercent === 0 ? "Start Learning" : enrolled.progressPercent === 100 ? "Review Course" : "Continue Learning"}
                      </span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}