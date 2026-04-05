"use client";
import { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { ICourse, ICourseWithInstructor } from "@/lib/models";
import { useAuth } from "./AuthContext";
/*
the porpuse is get courses public data and provide it but not globally just in course page and its sub pages 

*/
interface ICoursesContext {
  courses: ICourse[] | null;
  isCheckingCourses: boolean;
  editLocallCourses: (course: ICourse) => void;
}
const coursesContext = createContext<ICoursesContext>({
  courses: null,
  isCheckingCourses: true,
  editLocallCourses(course) {},
});

export const CoursesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [courses, setCourses] = useState<ICourse[] | null>(null);
  const [isCheckingCourses, setIsCheckingCourses] = useState<boolean>(true);
  const { user } = useAuth();
  const getCourses = async (): Promise<void> => {
    try {
      const url = process.env.BACKEND_SERVER || "http://localhost:5000";

      const result = await fetch(`${url}/api/courses`);
      const courses = await result.json();
      setCourses(courses);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log(err);
      }
    } finally {
      setIsCheckingCourses(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);
  const editLocallCourses = (course: ICourse): void => {
    if (user?.role === "STUDENT") {
      console.log("this user don't have access to do this action");
      return;
    }
    setCourses((previous) => [...(previous || []), course]);
  };
  return (
    <>
      <coursesContext.Provider
        value={{ courses, isCheckingCourses, editLocallCourses }}
      >
        {children}
      </coursesContext.Provider>
    </>
  );
};

export const useCourses = () => useContext(coursesContext);
