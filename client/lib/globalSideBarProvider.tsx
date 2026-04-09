"use client"
import { useAuth } from '@/context/AuthContext'
import { usePathname, useParams } from 'next/navigation'
import { AppSidebar } from '@/app/Mycomponents/sidebar'
import LessonSidbar from '@/app/Mycomponents/lessonSidbar'
import CourseBuilderSidebar from '@/app/Mycomponents/app-sidebar'
import Nav from '@/app/Mycomponents/Mynav'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useLessons} from '@/context/LessonContext'

export default function SideBarProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { lessonId, courseId } = useParams()
  const { user, isCheckingAuth } = useAuth()

  // ✅ بس استخدم الـ context مباشرة
  const { lessons, isCheckingLessons } = useLessons()
  console.log(lessons)
  const isLessonPage = !!(lessonId && pathname.includes("/lessons/"))
  const isCourseBuilder = pathname.includes("/courseBuilder/")

  const renderSidebar = () => {
    if (isLessonPage) {
      return <LessonSidbar lessons={lessons} isLoading={isCheckingLessons} />
    }
    if (isCourseBuilder) {
      return <CourseBuilderSidebar />
    }
    return <AppSidebar />
  }

  // لو لسه بيتحقق من الـ auth — مش بيعرض حاجة
  if (isCheckingAuth) return null

  // مش logged in — nav بس
  if (!user) {
    return (
      <>
        <Nav />
        {children}
      </>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {renderSidebar()}
        <main className="w-full">
          <Nav />
          <div className="px-4">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}