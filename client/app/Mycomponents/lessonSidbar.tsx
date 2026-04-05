"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { Lesson } from "@/lib/models";
import { PlayCircle, CheckCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from 'react'
import { cn } from "@/lib/utils";

export default function LessonSidbar({lessons, isLoading}: {lessons: Lesson[] | null, isLoading: boolean}) {
    const { courseId, lessonId } = useParams()

    if (isLoading) {
       return (
         <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-slate-800">
             <div className="flex flex-col items-center justify-center pt-20 space-y-4">
                 <Spinner className="size-6 text-primary" />
             </div>
         </Sidebar>
       )
    }

    return (
        <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
           <SidebarHeader className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
               <div className="flex items-center gap-3">
                   <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
                       <BookOpen className="size-5 text-indigo-600 dark:text-indigo-400" />
                   </div>
                   <h2 className="font-semibold text-slate-900 dark:text-slate-100 truncate">Course Materials</h2>
               </div>
           </SidebarHeader>

           <SidebarContent className="p-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                        Lessons
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {!lessons || lessons.length === 0 ? (
                                <div className="text-sm text-muted-foreground p-2 text-center mt-4">No lessons published</div>
                            ) : (
                                lessons.map((lesson: Lesson, index: number) => {
                                    const isActive = lessonId === lesson.id;
                                    // Read actual DB LessonProgress sent via getAllLessonsforEnrolled
                                    const isCompleted = (lesson as any).lessonProgress?.[0]?.isCompleted || false;

                                    return (
                                        <SidebarMenuItem key={lesson.id}>
                                            <SidebarMenuButton 
                                                asChild 
                                                isActive={isActive}
                                                className={cn(
                                                    "transition-all duration-200 h-auto py-3 px-3 rounded-xl mb-1 mt-1",
                                                    isActive 
                                                        ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-800/50" 
                                                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent"
                                                )}
                                            >
                                                <Link href={`/courses/${courseId}/lessons/${lesson.id}`} className="flex items-start gap-3 w-full">
                                                    <div className="shrink-0 mt-0.5">
                                                        {isCompleted ? (
                                                            <CheckCircle className="size-5 text-emerald-500" />
                                                        ) : isActive ? (
                                                            <PlayCircle className="size-5 text-indigo-600 dark:text-indigo-400" />
                                                        ) : (
                                                            <div className="size-5 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold">
                                                                {index + 1}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col flex-1 overflow-hidden">
                                                        <span className="font-medium text-sm leading-tight line-clamp-2">
                                                            {lesson.title}
                                                        </span>
                                                        {isActive && (
                                                            <span className="text-[11px] uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mt-1.5 font-bold">
                                                                Playing Now
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
           </SidebarContent>
        </Sidebar>
    )
}
