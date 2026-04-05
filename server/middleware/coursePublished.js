import catchError from "../catchError.js"
import { prisma } from "../lib/prisma.ts"

export const oneIsPublished = async (req , res , next)=>{
    const {courseId} = req.params
    try {
        const course =await prisma.course.findUnique({
            where:{
                id:courseId
            }
        })
        if(!course){
            return res.status(404).json({message:"not found this coures"})
        }
        if(course.isPublished == false){
           return res.status(403).json({message:"you don't have access to this course , it's not published yet"})
        }

        req.course = course
        next()
    } catch (error) {
        catchError(res ,error)
    }
}
export const manyIsPublished = async (req , res , next)=>{

    try {
        const courses =await prisma.course.findMany({
            where:{
                isPublished:true
            },
            orderBy:[
                {
                    isFeatured:true
                }
            ]
            
        })
        if(courses.length==0){
            res.status(404).json({message:"these courses not found"})
        next()
            return 
        }

        req.courses = courses
        next()
    } catch (error) {
        catchError(res ,error)
    }
}
