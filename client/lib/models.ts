

export interface IUser {
    id: string;
    email: string;
    role: string;
    userName: string;
    avatarUrl: string | null;
}


export interface AuthData {
    user:IUser|null,
    isCheckingAuth:boolean
    setUser?:(user:IUser|null)=>void
    logout?:()=>void
}


export type LEVELS = "Beginner" | "Intermediate" | "Advanced" 

export const LEVELS: LEVELS[] = ["Beginner", "Intermediate", "Advanced"];


export interface Lesson { // wil used in lessons page to get privat data not public
    id: string;
    title: string;
    category: string;
    overview: string;
    videoUrl: string;
    durationSeconds: number;
    orderIndex: number;
    isPublished?: boolean;
    courseId: string;
    createdAt: string;
    updatedAt: string;
    _count?:{
      lessonProgress:number,
      notes:number,
      attachments:number
    }
}
export const LESSON_FIELD = [
  "id",
  "title",
  "videoUrl",
  "isPublished",
  "overview",
  "category",
  "orderIndex",
  "durationSeconds",
  
] as const
export interface ILessons { // wil used in allLessons page to get public data not private
    id: string;
    title: string;
    durationSeconds: number;
    overview: string;
    category: CategoryValue[]|CategoryValue;
    isPublished:boolean
}


export interface Enrollment {
    id: string;
    userId: string;
    courseId: string;
    lastLesson: string;
    progressPercent: number;
    enrolledAt: string;
    completedAt: string | null;
    lastAccessedAt: string | null;
    course:ICourse
}



// 1. Define the keys as a constant array
export const COURSE_FIELDS = [
  "id",
  "title",
  "category",
  "description",
  "thumbnailUrl",
  "level",
  "price",
  "isPublished",
  "createdAt",
  "updatedAt",
  "language",
  "instructorId",
  "isFeatured"
] as const;

// 2. Define the Interface using those keys for strictness
export interface ICourse {
  id: string;
  title: string;
  category: CategoryValue[];
  description: string;
  thumbnailUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  level: string;
  price: number;
  instructorId: string;
  createdAt: Date;
  language: string;
  updatedAt?: Date;
}

// 3. Use in React (e.g., for Table Headers or Debugging)

export interface ICourseWithInstructor extends ICourse {
    instructor: {
        id: string;
        userName: string;
        email: string;
        avatarUrl: string | null;
    };
    _count: {
        enrollments: number;
        lessons: number;
    };
}


export const CATEGORIES = [
  "all", 
  "development", 
  "Fullstack", 
  "Backend", 
  "Frontend", 
  "photography", 
  "business", 
  "design", 
  "ai"
] as const;

// 2. Derive the type from the array
export type CategoryValue = (typeof CATEGORIES)[number];

export interface IAttachment {
  id: string;
  lessonId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
}
