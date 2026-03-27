export interface ICourse {
    id: string;
    title: string;
    category: string[];
    description: string;
    thumbnailUrl: string | null ;
    level:string;
    price: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt?: Date;
    language:string;
    instructorId: string;
    isFeatured: boolean;
}

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