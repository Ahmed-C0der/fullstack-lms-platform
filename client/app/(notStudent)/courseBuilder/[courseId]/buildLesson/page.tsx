"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Library, 
  Plus, 
  Video, 
  Clock, 
  Tag, 
  Type, 
  AlignLeft, 
  Hash, 
  Eye, 
  Save, 
  Loader2,
  FileVideo,
  Globe
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLessonId } from "../lessonContext";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  category: z.string().min(2, "Category is required."),
  overview: z.string().min(10, "Overview must be at least 10 characters."),
  videoUrl: z.string().url("Must be a valid URL."),
  durationSeconds: z.number().min(1, "Duration must be at least 1 second."),
  orderIndex: z.number().min(0, "Order index must be 0 or greater."),
  isPublished: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function BuildLesson() {
  const { courseId } = useParams();
  const router = useRouter();
  const { setLessonId } = useLessonId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      overview: "",
      videoUrl: "",
      durationSeconds: 0,
      orderIndex: 0,
      isPublished: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_SERVER || "http://localhost:5000";
      const response = await fetch(`${url}/api/courses/${courseId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const lessonId = data.id || data.lesson?.id;
        if (lessonId) {
          setLessonId(lessonId);
          toast.success("Lesson created successfully!");
          router.push(`/courseBuilder/${courseId}/allLessons`);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create lesson");
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const videoUrl = watch("videoUrl");

  return (
    <div className="flex-1 p-6 lg:p-10 bg-slate-50/50 min-h-screen animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section with Gradient Accent */}
        <div className="relative p-8 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-indigo-500 via-purple-500 to-pink-500" />
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Plus className="h-6 w-6 text-indigo-600" />
              </div>
              Build New Lesson
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              Design an engaging lesson by adding content, video, and organizing its place in your course.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Preview & Content (7/12) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Video Preview Card */}
            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white transition-all hover:shadow-md">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 py-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-100 rounded-md">
                    <Eye className="h-4 w-4 text-indigo-700" />
                  </div>
                  <CardTitle className="text-base font-semibold">Video Preview</CardTitle>
                </div>
                {videoUrl && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Link
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video bg-slate-900 flex items-center justify-center relative group">
                  {videoUrl && videoUrl.includes("http") ? (
                    <iframe
                      src={videoUrl.replace("watch?v=", "embed/")}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-slate-400 group-hover:text-slate-300 transition-all duration-300 transform group-hover:scale-105">
                      <div className="p-6 bg-slate-800/50 rounded-full border border-slate-700">
                        <FileVideo className="h-12 w-12 stroke-[1.5]" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-300">No active video link</p>
                        <p className="text-xs text-slate-500 mt-1">Enter a URL in the sidebar to preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Content Details Card */}
            <Card className="border-slate-200 shadow-sm bg-white transition-all hover:shadow-md">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-100 rounded-md">
                    <AlignLeft className="h-4 w-4 text-indigo-700" />
                  </div>
                  <CardTitle className="text-base font-semibold">Lesson Narrative</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                    <Type className="h-4 w-4 text-slate-400" />
                    Title
                  </Label>
                  <Input 
                    id="title"
                    placeholder="e.g., Intro to Advanced Architecture" 
                    {...register("title")}
                    className={`h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all ${errors.title ? "border-red-500 bg-red-50/50" : ""}`} 
                  />
                  {errors.title && <p className="text-xs font-semibold text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overview" className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                    <AlignLeft className="h-4 w-4 text-slate-400" />
                    Overview
                  </Label>
                  <Textarea 
                    id="overview"
                    placeholder="Provide a detailed description of the lesson content, objectives, and key takeaways..." 
                    className={`min-h-[220px] resize-none border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all ${errors.overview ? "border-red-500 bg-red-50/50" : ""}`}
                    {...register("overview")} 
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Recommended: 200+ characters</p>
                    {errors.overview && <p className="text-xs font-semibold text-red-500">{errors.overview.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Settings & Metadata (5/12) */}
          <div className="lg:col-span-5 space-y-8">
            <Card className="border-slate-200 shadow-sm bg-white sticky top-24 transition-all hover:shadow-md">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-100 rounded-md">
                    <Library className="h-4 w-4 text-indigo-700" />
                  </div>
                  <CardTitle className="text-base font-semibold">Discovery & Meta</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                    <Tag className="h-4 w-4 text-slate-400" />
                    Category
                  </Label>
                  <Input 
                    id="category"
                    placeholder="e.g. Fundamental, Case Study" 
                    {...register("category")}
                    className={`h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all ${errors.category ? "border-red-500 bg-red-50/50" : ""}`} 
                  />
                  {errors.category && <p className="text-xs font-semibold text-red-500 mt-1">{errors.category.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                    <Video className="h-4 w-4 text-slate-400" />
                    Video Source URL
                  </Label>
                  <div className="relative">
                    <Input 
                      id="videoUrl"
                      placeholder="https://youtube.com/watch?v=..." 
                      {...register("videoUrl")}
                      className={`h-11 pr-10 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all ${errors.videoUrl ? "border-red-500 bg-red-50/50" : ""}`} 
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Globe className="h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                  {errors.videoUrl && <p className="text-xs font-semibold text-red-500 mt-1">{errors.videoUrl.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="durationSeconds" className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                      <Clock className="h-4 w-4 text-slate-400" />
                      Duration (s)
                    </Label>
                    <Input 
                      id="durationSeconds"
                      type="number" 
                      {...register("durationSeconds", { valueAsNumber: true })}
                      className="h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orderIndex" className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                      <Hash className="h-4 w-4 text-slate-400" />
                      Sequence Pos.
                    </Label>
                    <Input 
                      id="orderIndex"
                      type="number" 
                      {...register("orderIndex", { valueAsNumber: true })}
                      className="h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20" 
                    />
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between rounded-xl border p-4 border-slate-200 bg-slate-50/30 transition-all hover:bg-slate-50/50">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-slate-800">Publish Immediately</Label>
                    <p className="text-[11px] text-slate-500 font-medium">Makes the lesson live for enrolled students</p>
                  </div>
                  <Controller
                    name="isPublished"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-indigo-600"
                      />
                    )}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-13 text-base font-bold transition-all duration-300 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_0_rgba(79,70,229,0.23)] active:scale-[0.98]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Synchronizing Data...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        <span>Finalize & Save Lesson</span>
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}