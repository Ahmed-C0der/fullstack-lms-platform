"use client"
import React, { useEffect, useState } from 'react'
import { useLessons } from '../../../../../../context/LessonContext'
import { Lesson, IAttachment, INote } from '@/lib/models'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, BookOpen, Paperclip, CheckCircle, Download, Plus, Trash2, FileText } from 'lucide-react'
import interactWithDB from '@/lib/getDataFromDB'
import { toast } from 'sonner'

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams()
  const router = useRouter()

  const { lessons, isCheckingLessons } = useLessons()
  const [lessonData, setLessonData] = useState<Lesson | null>(null)
  const [attachments, setAttachments] = useState<IAttachment[]>([])
  const [notes, setNotes] = useState<INote[]>([])
  const [newNote, setNewNote] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [isLoadingExtras, setIsLoadingExtras] = useState(false)
  
  // Progress states
  const [isCompleted, setIsCompleted] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  // Fix: Added `lessonId` so this updates when navigating between lessons in sidebar
  useEffect(() => {
    if (lessons && lessons.length > 0) {
      const lesson = lessons.find((l: Lesson) => l.id === lessonId)
      setLessonData(lesson || null)
      setIsCompleted((lesson as any)?.lessonProgress?.[0]?.isCompleted || false)
      
      if (lesson) {
        fetchExtras(lesson.id)
      }
    }
  }, [lessons, lessonId])

  const fetchExtras = async (id: string) => {
    setIsLoadingExtras(true)
    try {
      // Fetch attachments
      const { target: atts } = await interactWithDB<IAttachment[]>(`/api/courses/${courseId}/lessons/${id}/attachment`)
      setAttachments(atts || [])

      // Fetch notes
      const { target: nts } = await interactWithDB<INote[]>(`/api/courses/${courseId}/lessons/${id}/notes`)
      setNotes(nts || [])
    } catch (error) {
      console.error("Failed to fetch extras:", error)
    } finally {
      setIsLoadingExtras(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setIsAddingNote(true)
    try {
      const { target: note } = await interactWithDB<INote>(`/api/courses/${courseId}/lessons/${lessonId}/notes`, "POST", {
        content: newNote,
        videoTimestamp: 0 // Could be enhanced to get current video time
      })
      if (note) {
        setNotes([note, ...notes])
        setNewNote("")
        toast.success("Note added successfully")
      }
    } catch (error) {
      toast.error("Failed to add note")
    } finally {
      setIsAddingNote(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { isFinished } = await interactWithDB(`/api/courses/${courseId}/lessons/${lessonId}/notes/${noteId}`, "DELETE")
      if (isFinished) {
        setNotes(notes.filter(n => n.id !== noteId))
        toast.success("Note deleted")
      }
    } catch (error) {
      toast.error("Failed to delete note")
    }
  }
  
  const handleToggleComplete = async () => {
    try {
      setIsToggling(true)
      const newStatus = !isCompleted;
      setIsCompleted(newStatus); // optimistic ui update
      
      const {target , isFinished}  = await interactWithDB<Lesson[]>(`/api/courses/${courseId}/lessons/${lessonId}/progress`,"POST",{isCompleted: newStatus})
      console.log(target , isFinished)
    } catch (err) {
      console.error("Failed to mark complete:", err)
      setIsCompleted(!isCompleted) // revert on fail
    } finally {
      setIsToggling(false)
    }
  }

  if (isCheckingLessons) {
    return (
      <div className='flex flex-col justify-center items-center h-[70vh] space-y-4'>
        <Spinner className="size-10 text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading lesson...</p>
      </div>
    )
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <h1 className="text-2xl font-bold">No Lessons Available</h1>
        <Button onClick={() => router.push(`/courses/${courseId}`)}>Back to Course</Button>
      </div>
    )
  }

  if (!lessonData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Lesson Not Found</h1>
        <p className="text-muted-foreground">The lesson you are looking for does not exist in this course.</p>
        <Button onClick={() => router.push(`/courses/${courseId}/lessons`)}>
           <ArrowLeft className="size-4 mr-2" />
           Back to Curriculum
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full animate-in fade-in duration-500 pb-20">
      
      {/* Primary Video / Content Column */}
      <div className="flex-1 space-y-6">
        {/* Video Wrapper */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
          {lessonData.videoUrl ? (
            <iframe 
              src={lessonData.videoUrl} 
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          ) : (
             <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                <p>No video available for this lesson</p>
             </div>
          )}
        </div>

        {/* Lesson Metadata */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {lessonData.title}
            </h1>
            <Button 
                variant={isCompleted ? "default" : "outline"}
                className={`shrink-0 gap-2 font-medium ${isCompleted ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-transparent' : ''}`}
                onClick={handleToggleComplete}
                disabled={isToggling}
            >
                {isCompleted ? "Completed" : "Mark as Complete"}
                <CheckCircle className={`size-4 ${isCompleted ? 'text-white' : ''}`} />
            </Button>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            {lessonData.overview || "This lesson does not have a detailed overview."}
          </p>
        </div>
      </div>

      {/* Secondary Tools Column (Notes, Files) */}
      <div className="w-full xl:w-[350px] shrink-0 space-y-6">
        
        {/* Notes Module */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[400px]">
           <div className="flex items-center gap-2 mb-4 shrink-0">
             <BookOpen className="size-5 text-indigo-500" />
             <h3 className="font-semibold text-lg">My Notes</h3>
           </div>
           
           <div className="space-y-3 mb-4 shrink-0">
              <Textarea 
                placeholder="Type a new note..." 
                className="min-h-[80px] resize-none text-sm"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <Button 
                className="w-full gap-2 h-9 text-sm" 
                size="sm"
                onClick={handleAddNote}
                disabled={isAddingNote || !newNote.trim()}
              >
                <Plus className="size-4" />
                Add Note
              </Button>
           </div>

           <ScrollArea className="flex-1 -mr-2 pr-2">
              <div className="space-y-3">
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <div key={note.id} className="group p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative">
                       <p className="text-sm text-slate-700 dark:text-slate-300 pr-6">
                         {note.content}
                       </p>
                       <span className="text-[10px] text-muted-foreground mt-2 block">
                         {new Date(note.createdAt).toLocaleDateString()}
                       </span>
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                        onClick={() => handleDeleteNote(note.id)}
                       >
                         <Trash2 className="size-3" />
                       </Button>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-8 text-sm text-muted-foreground border border-dashed border-slate-200 dark:border-slate-800 text-center">
                    No notes yet. Start writing!
                  </div>
                )}
              </div>
           </ScrollArea>
        </div>

        {/* Attachments Module */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
           <div className="flex items-center gap-2 mb-4">
             <Paperclip className="size-5 text-indigo-500" />
             <h3 className="font-semibold text-lg">Attachments</h3>
           </div>
           
           <div className="space-y-3">
             {isLoadingExtras ? (
               <div className="flex justify-center py-4"><Spinner className="size-5 text-indigo-500" /></div>
             ) : attachments.length > 0 ? (
                attachments.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <FileText className="size-4 text-indigo-500" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium truncate">{file.fileName}</span>
                        <span className="text-[10px] uppercase text-muted-foreground font-semibold">{file.fileType}</span>
                      </div>
                    </div>
                    <Button asChild size="icon" variant="ghost" className="shrink-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30">
                       <a href={file.fileUrl} download={file.fileName} target="_blank" rel="noopener noreferrer">
                         <Download className="size-4" />
                       </a>
                    </Button>
                  </div>
                ))
             ) : (
               <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-8 text-sm text-muted-foreground border border-dashed border-slate-200 dark:border-slate-800 text-center">
                  No files attached
               </div>
             )}
           </div>
        </div>

      </div>

    </div>
  )
}
