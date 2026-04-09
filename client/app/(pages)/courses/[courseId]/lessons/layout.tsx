"use client"
import { LessonContextProvider } from "@/context/LessonContext";

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LessonContextProvider>
      {children}
    </LessonContextProvider>
  );
}
