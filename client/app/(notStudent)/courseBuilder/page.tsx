"use client"
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import { useAuth } from '@/context/AuthContext';
import { COURSE_FIELDS, type ICourse } from '@/lib/models';
import { CATEGORIES } from '@/lib/models';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Spinner } from '@/components/ui/spinner';
import { toast } from "sonner"
import { LEVELS } from '@/lib/models';
import { Checkbox } from '@/components/ui/checkbox';

export default function CourseBuilder() {
  const { user, isCheckingAuth } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [courses, setCourses] = useState<ICourse[] | null>(null);
  const [isLoad, setIsload] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<ICourse>>({
    title: "",
    description: "",
    price: 0,
    language: "English",
    level: "Beginner",
    category: [], 
    isPublished: false,
    isFeatured: false,
  });

  const getUrl = () => process.env.NEXT_PUBLIC_BACKEND_SERVER || "http://localhost:5000";

  // Handle Auth Routing safely avoiding setState within Render
  useEffect(() => {
    if (!isCheckingAuth) {
      if (!user) {
        router.replace("/login");
      } else if (user.role === "STUDENT") {
        router.replace("/courses");
      }
    }
  }, [isCheckingAuth, user, router]);

  // Fetch created courses
  const getCoursesForBuilder = async (): Promise<void> => {
    try {
      const url = getUrl()
      const response = await fetch(`${url}/api/courses/builder`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      if (response.ok) {
        const data: any = await response.json();
        // Extract array depending on the backend response format
        setCourses(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error: any) {
      console.error(error);
      setCourses(null);
    } finally {
      setIsload(false);
    }
  }

  useEffect(() => {
    if (user && user.role !== "STUDENT") {
      getCoursesForBuilder();
    }
  }, [user]);

  // Entrance Animations following DLS
  useGSAP(() => {
    if (!isCheckingAuth && user) {
      gsap.fromTo(
        ".builder-section",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [isCheckingAuth, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Fix: if category, make it an array
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: [value as any],
      }));
      return;
    }

    const finalValue = type === "number" ? parseFloat(value) : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = getUrl();
      const response = await fetch(`${url}/api/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create course");

      toast.success("Course Created Successfully!");
      getCoursesForBuilder();
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        price: 0,
        language: "English",
        level: "Beginner",
        category: [],
        isPublished: false,
        isFeatured: false,
      });

    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Error creating course. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Block rendering while authenticating or redirecting
  if (isCheckingAuth || !user || user.role === "STUDENT") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans relative">
      {/* Decorative Brand Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 z-10" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="builder-section space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            Welcome back, {user.userName}
          </h1>
          <p className="text-slate-500 text-lg">
            Manage your existing courses or build a new one.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Existing Courses Accordion */}
          <div className="lg:col-span-5 builder-section space-y-6">
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="bg-slate-100/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-xl font-bold text-slate-900">Your Courses</CardTitle>
                <CardDescription className="text-slate-500">
                  Select a course to manage its content.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isLoad ? (
                  <div className="flex justify-center p-8"><Spinner /></div>
                ) : courses && courses.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {courses.map((course) => (
                      <AccordionItem key={course.id} value={course.id} className="border-b-slate-100 px-6 last:border-0">
                        <AccordionTrigger className="hover:no-underline hover:text-indigo-600 transition-colors py-4 font-semibold text-slate-800">
                          {course.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 space-y-4 pb-4">
                          <p className="text-sm leading-relaxed">{course.description}</p>
                          <div className="flex flex-col gap-3 pt-2">
                            <Link href={`/courseBuilder/${course.id}/allLessons`} className="w-full">
                              <Button variant="secondary" className="w-full justify-start hover:bg-slate-200 text-slate-700 transition-colors">
                                View All Lessons
                              </Button>
                            </Link>
                            <Link href={`/courseBuilder/${course.id}/buildLesson`} className="w-full">
                              <Button className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
                                Build New Lesson
                              </Button>
                            </Link>
                            <Link href={`/courseBuilder/${course.id}/buildAttachment`} className="w-full">
                              <Button variant="outline" className="w-full justify-start text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                                Manage Attachments
                              </Button>
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <p className="text-slate-500">You haven&apos;t created any courses yet.</p>
                    <p className="text-sm font-medium text-indigo-600">Create your first course to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Course Creation Form */}
          <div className="lg:col-span-7 builder-section">
            <Card className="border-slate-200 shadow-sm bg-white transition-all duration-300 hover:shadow-md">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-2xl font-bold text-slate-900">Build New Course</CardTitle>
                <CardDescription className="text-slate-500">
                  Fill in the details below to initialize a new course container.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {COURSE_FIELDS.filter(field => !['id', 'createdAt', 'updatedAt', 'instructorId'].includes(field)).map((field) => (
                      <div key={field} className="flex flex-col gap-2">
                        <Label htmlFor={field} className="text-sm font-semibold text-slate-700 capitalize">
                          {field.replace(/([A-Z])/g, ' $1')}
                        </Label>
                        
                        {field === "category" ? (
                          <div className="relative">
                            <select 
                              name={field}
                              id={field}
                              onChange={handleChange}
                              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 appearance-none transition-colors"
                              value={formData.category as any || ""}
                            >
                              <option value="" disabled>Select a category</option>
                              {CATEGORIES.map((category) => (
                                category !== "all" && (
                                  <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                  </option>
                                )
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                          </div>
                        ) : field==="level" ? (
                          <div className="relative">
                            <select 
                              name={field}
                              id={field}
                              onChange={handleChange}
                              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 appearance-none transition-colors"
                              value={formData.level as any}
                            >
                              <option value="" disabled>Select a level</option>
                              {LEVELS.map((level) => (
                                
                                  <option key={level} value={level}>
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                  </option>
                                
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                          </div>
                        ) :field ==="isFeatured"||field==="isPublished" ?
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={field}
                            name={field}
                            checked={(formData as any)[field] || false}
                            onCheckedChange={(checked) => {
                              setFormData((prev) => ({
                                ...prev,
                                [field]: checked,
                              }));
                            }}
                            className="border-slate-300 focus-visible:ring-indigo-500"
                          />
                          <Label htmlFor={field} className="text-sm font-medium text-slate-700 capitalize">
                            {field.replace(/([A-Z])/g, ' $1')}
                          </Label>
                        </div>
                        :(
                          <Input
                            id={field}
                            name={field}
                            type={field === 'price' ? 'number' : 'text'}
                            placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
                            onChange={handleChange}
                            value={(formData as any)[field] || ''}
                            required={field === 'title' || field === 'price'}
                            className="border-slate-300 focus-visible:ring-indigo-500 text-slate-900 bg-slate-50 focus:bg-white transition-colors"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {isSubmitting ? "Initializing Course Container..." : "Create Course Context"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  )
}