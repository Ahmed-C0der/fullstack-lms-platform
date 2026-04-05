import React from 'react';
import { CoursesProvider } from '@/context/courseContext';
import { EnrollmentContextProvider } from '@/context/enrollmentContext';
export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="courses-container">
        <CoursesProvider>
          <EnrollmentContextProvider>

            {children}
          </EnrollmentContextProvider>
        </CoursesProvider>
    </section>
  );
}
