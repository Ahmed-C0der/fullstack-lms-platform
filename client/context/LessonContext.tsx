"use client";
import { Children, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { ICourse, ICourseWithInstructor, Lesson } from "@/lib/models";
import { useParams } from "next/navigation";
import useLessonsEnrolled from "@/lib/getDataFromDB"
///api/courses/${courseId}/lessons/enrolled

// the purpose is to provide all lesson after one fetch not fetch in each trasnform between lessons
interface ILessonContext {
    lessons : Lesson[] | null
    isCheckingLessons : boolean
}
const lessonContext = createContext<ILessonContext>({
    lessons:null,
    isCheckingLessons:false
})

export const LessonContextProvider :React.FC<{ children: ReactNode }> =({children})=>{
        const {courseId} = useParams()
    
    const [lessons , setLessons]= useState<Lesson[]|null>(null)
    const [isCheckingLessons, setIsCheckingLessons] = useState<boolean>(true)
    



    useEffect(()=>{
        const Gett = async ()=>{

            const {target , isFinished}  = await useLessonsEnrolled<Lesson[]>(`/api/courses/${courseId}/lessons/enrolled`)
            setLessons(target)
            setIsCheckingLessons(!isFinished)
        }
        Gett()
    },[])
    return(
        <lessonContext.Provider value={{lessons,isCheckingLessons}}>
            {children}
        </lessonContext.Provider>
    )
}
// wil contain Enrollment

export const useLessons = ()=>useContext(lessonContext)