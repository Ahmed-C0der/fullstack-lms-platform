import catchError from "../catchError.js";
import { prisma } from "../lib/prisma.ts";
import success from "../successufull.js";
const getUserId =(req)=> req.user.id
const getLessonId =(req)=> req.params.lessonId
const getNotesId =(req)=> req.params.noteId
const getAttachmentId =(req)=> req.params.attachmentId

export const getAllLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await prisma.lesson.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      orderBy: { orderIndex: "asc" },
      select: {
        id: true,
        title: true,
        durationSeconds: true,
        orderIndex: true,
        category: true,
      },
    });
    if (lessons.length === 0) {
      return res.status(404).json({ message: "no lessons found" });
    }

    success(res,200,lessons)
  } catch (error) {
    catchError(res, error);
  }
};

export const getLesson = async (req, res) => {
  const { courseId, lessonId } = req.params;
  try {
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
        include: {
          attachments: true,
        },
      },
    });
    if (!lesson || lesson.courseId !== courseId) {
      return res.status(404).json({ message: "lessons not found" });
    }

    res.status(200).json(lesson);
  } catch (error) {
    catchError(res, error);
  }
};

export const postLesson = async (req ,res)=>{
    const {courseId} = req.params

    try {
      const lesson = await prisma.lesson.create({
        data:{...req.body,courseId }
      })

      success(res,201,lesson)
    } catch (error) {
    catchError(res,error)
      
    }
}
export const putLesson = async (req ,res)=>{
    const lessonId = getLessonId(req)
    const {courseId} = req.params

    try {
      const lesson = await prisma.lesson.update({
        where:{
          id:lessonId,
          courseId
        },
        data:{ ...req.body }
      })

      success(res,200,lesson)
    } catch (error) {
    catchError(res,error)
      
    }
}
export const deletLesson = async (req ,res)=>{
    const lessonId = getLessonId(req)
    const {courseId} = req.params

  try {

    const lesson = await prisma.lesson.delete({
      where:{
        id:lessonId,
        courseId
      }
    })
      success(res,200,lesson)
    
  } catch (error) {
    catchError(res,error)
    
  }
}

// progress

export const getProgress = async (req ,res)=>{
  const id = getUserId(req)
  const {lessonId} = req.params
  try {
    const progress = await prisma.lessonProgress.findUnique({
      where:{
        userId_lessonId:[id , lessonId]
      }
    })
    if(!progress|| progress==null){
      res.status(404).json({message:"this lesson not found"})
      return
    }
    success(res,200,progress)
  } catch (error) {
    catchError(res,error)
  }
}

export const postOrPatch = async (req ,res)=>{
  const id = getUserId(req)
  const {lessonId} = req.params
  try {
    const progress = await prisma.lessonProgress.findUnique({
      where:{
        userId_lessonId:[id , lessonId]
      }
    })
    if(!progress|| progress==null){
      // make new
      const progress = await prisma.lessonProgress.create({
        where:{
          userId:id,
          lessonId:lessonId
        }
      })
      res.status(201).json(progress)

      return
    }
    // he already exsit so updat
    const {watchedSeconds} =req.body || 0
    const {lastWatchedAt} = req.body|| null
    const updateProgress = await prisma.lessonProgress.update({
      where:{
        id:progress.id
      },
      data:{
        watchedSeconds,
        lastWatchedAt
      }
    })

    res.status(200).json(updateProgress)
  } catch (error) {
    catchError(res,error)
    
  }
}







// notes
export const getAllNotes =async (req ,res)=>{
  const id = getUserId(req)
  const lessonId = getLessonId(req)

  try {
    const notes = await prisma.note.findMany({
      where:{
        userId:id,
        lessonId
      }

    })
    if(notes.length ==0){

      res.status(404).json({message:"there aren't lessons yet"})
      return
    }
    res.status(200).json(notes)
  } catch (error) {
    catchError(res, error);
  }
}
export const getNote =async (req ,res)=>{
  const id = getUserId(req)
  const lessonId = getLessonId(req)
  const noteId = getNotesId(req)


  try {
    const notes = await prisma.note.findUnique({
      where:{
        id:noteId,
        lessonId,
        userId:id
      }
    })
    res.status(200).json(notes)
  } catch (error) {
    catchError(res, error);
  }
}

export const addNotes = async (req ,res)=>{
  const id = getUserId(req)
  const lessonId = getLessonId(req)
  const {content , videoTimestamp} = req.body

  try {
    const note = await prisma.note.create({
      data:{
        userId:id,
        lessonId,
        content,
        videoTimestamp
      }
    })
  } catch (error) {
    catchError(res, error);
    
  }
}

export const updateNotes = async (req ,res)=>{
  const id = getUserId(req)
  const lessonId = getLessonId(req)
  const {content , videoTimestamp} = req.body
  const noteId = getNotesId(req)
  
  try {
    const note =await prisma.note.update({
      where:{
        id:noteId,
        lessonId,
        userId:id
      },
      data:{
        content
      }
    })

    success(res,200,note)
  } catch (error) {
    catchError(res, error);
    
  }
}

export const deleteNote = async (req , res)=>{
  const id = getUserId(req)
  const lessonId = getLessonId(req)
  const noteId = getNotesId(req)

  try {
    const note = await prisma.note.delete({
      where:{
        id:noteId,
        lessonId,
        userId:id
      }
    })
    success(res,200,note)
    
  } catch (error) {
    catchError(res, error);
    
  }
}


// attachment

export const getAllAttachment = async(req , res)=>{
  const lessonId = getLessonId(req)
  try {
    const attachments = await prisma.attachment.findMany({
      where:{
        lessonId
      }
    })
    if(attachments.length ===0){
      success(res,404,{message:"there aren't Attachment"})
    }
  } catch (error) {
    catchError(res, error);
    
  }
}
export const postAttachment = async (req ,res)=>{
  const lessonId = getLessonId(req)
  const id = getAttachmentId(req)
  const {fileName,fileUrl,fileType} = req.body
  try {
    const note = await prisma.note.create({
      data:{
        lessonId,
        fileName,
        fileUrl,
        fileType
      }
    })
  } catch (error) {
    catchError(res, error);
    
  }
}
export const updateAttachment = async (req, res)=>{
    const lessonId = getLessonId(req)
  const id = getAttachmentId(req)
  const {fileName,fileUrl,fileType} = req.body
  try {
    const note = await prisma.note.update({
      where:{
        id,
        lessonId
      },
      data:{
        lessonId,
        fileName,
        fileUrl,
        fileType
      }
    })

    success(res,201,note)
  } catch (error) {
    catchError(res, error);
    
  }
}
export const deletAttachment = async (req, res)=>{
    const lessonId = getLessonId(req)
  const id = getAttachmentId(req)
  try {
    const note = await prisma.note.delete({
      where:{
        id,
        lessonId
      }
    })
    success(res,200,note)
    
  } catch (error) {
    catchError(res, error);
  }
}