
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import  CourseBuilderSidebar  from '../../../Mycomponents/app-sidebar';
import { cookies } from 'next/headers';

import { LessonProvider } from './lessonContext';

/*
I will use layout to provide sidbar and may be i will need it to offer global data
*/ 
export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <section className="courses-container" >
      <LessonProvider>
          {/* AppSidebar component */}
          <CourseBuilderSidebar />
          <SidebarTrigger />
          {children}
      </LessonProvider>
    </section>
  );
}
