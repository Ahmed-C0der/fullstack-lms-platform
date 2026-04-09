"use client"
import { createContext, useContext, useState } from "react";
// just provide the id of the lesson
interface LessonContextType {
    lessonId: string | null;
    setLessonId: (lessonId: string) => void;
}
const LessonContext = createContext< LessonContextType>({
    lessonId: null,
    setLessonId: () => {}
});

export const LessonProvider = ({ children }: { children: React.ReactNode }) => {
    const [lessonId, setLessonId] = useState<string | null>(null);
    return (
        <LessonContext.Provider value={{lessonId, setLessonId}}>
            {children}
        </LessonContext.Provider>
    );
};



export const useLessonId = () => useContext(LessonContext);