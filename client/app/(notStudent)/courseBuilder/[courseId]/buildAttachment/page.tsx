"use client";
import React, { useEffect, useState } from "react";
import type { IAttachment } from "@/lib/models";
import { Download, Workflow, Paperclip, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useLessonId } from "../lessonContext";
import { Spinner } from "@/components/ui/spinner";

export default function BuildAttachment() {
  const { courseId } = useParams();
  const { lessonId } = useLessonId();
  
  const [attachment, setAttachments] = useState<IAttachment[] | null>(null);
  const [allattachment, setAllAttachments] = useState<IAttachment[] | null>(null);
  const [isDownload, setIsDownload] = useState<boolean>(true);

  useEffect(() => {
    const getAllAttachments = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_BACKEND_SERVER || "http://localhost:5000";
        
        // Fetch All Attachments for the course
        const responseAll = await fetch(
          `${url}/api/courses/${courseId}/lessons/attachment`,
          { credentials: "include" }
        );
        if (responseAll.ok) {
          const attachmentAll = await responseAll.json();
          setAllAttachments(attachmentAll);
        }

        // Fetch Current Lesson Attachments
        if (lessonId) {
          const responseONE = await fetch(
            `${url}/api/courses/${courseId}/lessons/${lessonId}/attachment`,
            { credentials: "include" }
          );
          if (responseONE.ok) {
            const attachmentOne = await responseONE.json();
            setAttachments(attachmentOne);
          }
        }
      } catch (error) {
        console.error("Failed to fetch attachments:", error);
      } finally {
        setIsDownload(false);
      }
    };

    getAllAttachments();
  }, [courseId, lessonId]);

  return (
    <div className="flex-1 p-6 lg:p-10 bg-slate-50/50 min-h-screen animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="relative p-8 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Paperclip className="h-6 w-6 text-indigo-600" />
              </div>
              Attachment Manager
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              Upload resources, PDFs, code snippets, or ZIP files associated with your lessons.
            </p>
          </div>
        </div>

        {!lessonId && (
          <div className="rounded-xl border p-4 bg-amber-50 border-amber-200 text-amber-800 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <h3 className="font-bold text-amber-800">No Active Lesson Selected</h3>
            </div>
            <p className="text-sm text-amber-700/90 pl-7">
              You haven't selected or created a lesson yet. Linking attachments below requires an active lesson context. 
              Please go back to "All Lessons" or "Build Lesson" to target one.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Uploader Column */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <CardTitle className="text-base font-semibold">Upload Resource</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 text-center">
                <div className="space-y-2">
                  <Label htmlFor="attachment-link" className="text-sm font-semibold flex items-center justify-center gap-2 text-slate-700">
                    Enter Attachment Link
                  </Label>
                  <Input id="attachment-link" placeholder="https://..." className="h-11" />
                </div>
                <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700">Save Attachment</Button>
              </CardContent>
            </Card>
          </div>

          {/* Directory Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Active Lesson Directory */}
            {lessonId && (
              <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                  <CardTitle className="text-base font-semibold">Current Lesson Files</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {isDownload ? (
                    <div className="flex justify-center p-8"><Spinner className="size-6 text-indigo-500"/></div>
                  ) : attachment && attachment.length > 0 ? (
                    <ScrollArea className="h-48 w-full pr-4">
                      <div className="space-y-3">
                        {attachment.map((el: IAttachment) => (
                          <div key={el.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <Workflow className="size-5 text-indigo-500 shrink-0" />
                              <div className="flex flex-col overflow-hidden">
                                <span className="font-semibold text-sm truncate">{el.fileName || "Unnamed File"}</span>
                                <span className="text-xs text-muted-foreground uppercase">{el.fileType || "LINK"}</span>
                              </div>
                            </div>
                            <Button asChild size="icon" variant="ghost" className="shrink-0 text-slate-500 hover:text-indigo-600">
                              <Link href={el.fileUrl} download>
                                <Download className="size-4" />
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center p-8 border border-dashed rounded-xl border-slate-200 bg-slate-50 text-slate-500">
                       No attachments linked to this specific lesson yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Global Course Directory */}
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <CardTitle className="text-base font-semibold">All Course Attachments</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isDownload ? (
                  <div className="flex justify-center p-8"><Spinner className="size-6 text-indigo-500"/></div>
                ) : allattachment && allattachment.length > 0 ? (
                  <ScrollArea className="h-64 w-full pr-4">
                    <div className="space-y-3">
                      {allattachment.map((el: IAttachment) => (
                        <div key={el.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <Workflow className="size-5 text-slate-400 shrink-0" />
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-semibold text-sm truncate">{el.fileName || "File"}</span>
                              <span className="text-xs text-muted-foreground uppercase">{el.fileType || "LINK"}</span>
                            </div>
                          </div>
                          <Button asChild size="icon" variant="ghost" className="shrink-0 text-slate-500 hover:text-indigo-600">
                            <Link href={el.fileUrl} download>
                              <Download className="size-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center p-8 text-slate-500">
                     No attachments found in this course.
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
