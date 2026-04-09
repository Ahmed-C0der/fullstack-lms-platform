"use client";
import React from "react";
import { useCourses } from "@/context/courseContext";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import type { CategoryValue } from "@/lib/models";
import { Spinner } from "@/components/ui/spinner";
import { ArrowRight, BookOpen } from "lucide-react";

const category: { name: string; id: number; type: CategoryValue }[] = [
  { name: "All", id: 0, type: "all" },
  { name: "Development", id: 1, type: "development" },
  { name: "AI", id: 2, type: "ai" },
  { name: "Design", id: 3, type: "design" },
  { name: "Business", id: 4, type: "business" },
  { name: "Photography", id: 5, type: "photography" },
  { name: "Frontend", id: 6, type: "Frontend" },
  { name: "Backend", id: 7, type: "Backend" },
  { name: "Fullstack", id: 8, type: "Fullstack" },
];

export default function CoursesPage() {
  const { courses, isCheckingCourses } = useCourses();
  const query = useSearchParams();
  const categoryQuery = query.get("category") ?? "all";
  const router = useRouter();

  const changeCategory = (cats: string) => {
    const params = new URLSearchParams(query.toString());
    params.set("category", cats);
    router.push(`/courses?${params.toString()}`);
  };

  const filteredCourses =
    categoryQuery === "all"
      ? courses
      : courses?.filter((course) =>
          course.category.some(
            (c) => c.toLowerCase() === categoryQuery.toLowerCase()
          )
        );

  return (
    <section className="bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="container mx-auto px-6 py-12 md:py-20 lg:px-8 space-y-12 animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col space-y-4 max-w-3xl">
          <h1 className="text-[48px] tracking-tighter font-black text-slate-900 dark:text-slate-100 leading-tight">
            Course Catalog
          </h1>
          <p className="text-[16px] text-muted-foreground leading-relaxed max-w-2xl">
            Explore carefully curated specialized learning tracks created by masters. Master the skills you need and power up your career.
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-2 lg:gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          {category.map((el) => (
            <Button
              key={el.id}
              variant={el.type === categoryQuery ? "default" : "secondary"}
              onClick={() => changeCategory(el.type)}
              className={`rounded-full px-5 font-medium transition-colors ${
                el.type === categoryQuery
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {el.name}
            </Button>
          ))}
        </div>

        {/* Courses Section */}
        {isCheckingCourses ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <Spinner className="size-8 text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">Loading catalog...</p>
          </div>
        ) : filteredCourses && filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="group flex flex-col overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-secondary">
                  <div className="absolute inset-0 z-10 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                  <Image
                    src={course.thumbnailUrl || "/imgs/course.png"}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {course.level && (
                    <Badge className="absolute top-3 right-3 z-20 bg-slate-900/80 hover:bg-slate-900 text-white border-none rounded-full px-3 py-1 text-xs">
                      {course.level}
                    </Badge>
                  )}
                </div>
                
                <CardHeader className="flex-1 pb-4">
                  <CardTitle className="text-[20px] font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-sm font-medium text-primary mt-2">
                    {Array.isArray(course.category) ? course.category.join(", ") : course.category}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-3 leading-relaxed">
                    {course.description || "A deep dive into this topic, giving you the skills to excel."}
                  </p>
                </CardHeader>

                <CardFooter className="pt-0 pb-6 px-6 mt-auto">
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all group-hover:gap-3">
                    <Link href={`/courses/${course.id}`} className="flex items-center justify-center gap-2">
                      View Course
                      <ArrowRight className="size-4 transition-all" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center">
             <BookOpen className="h-16 w-16 text-muted-foreground mb-6 opacity-40" />
             <h2 className="text-[24px] font-semibold text-slate-900 dark:text-slate-100 mb-2">No courses found</h2>
             <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
               We couldn't find any courses matching your selected category. Check back later or try clearing your filters.
             </p>
             <Button 
                variant="outline" 
                className="mt-6 rounded-full"
                onClick={() => changeCategory("all")}
             >
               View All Courses
             </Button>
          </div>
        )}
      </div>
    </section>
  );
}
