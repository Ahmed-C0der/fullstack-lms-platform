import React from 'react';
import { CoursesProvider } from '@/context/courseContext';
import { EnrollmentContextProvider } from '@/context/enrollmentContext';
import { LessonContextProvider } from '@/context/LessonContext';
export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="courses-container">
        <CoursesProvider>
          <EnrollmentContextProvider>
            <LessonContextProvider>

            {children}
            </LessonContextProvider>
          </EnrollmentContextProvider>
        </CoursesProvider>
    </section>
  );
}
