what i want to build --> LMS
what is the advantages is want to add

calc how many course user have --> add courses ID into User tabel -->User_Course
cacl certificat user have --> add Certificates ID into User tabel -->Certificates
cacl hours user have --> add Certificates ID into User tabel -->hours

## User Schema V1

User {
id unique
gmail unique
password
userName
User_Course Courses[]
Certificates_id :[]
Hours ???? // i don't know yet how to do it
role --> use Enum here
}

each course have lessons in it so imagin that the Course is a big bag and lessons are the book so it's a must to know lessons first course

each lessons should have a one Course_id and it's many-to-one from lessons to course
each lessons should have an overView text or files , notes the userCan add , links to the video , might contain files to download, calc time the user have wathced to more bitter UX and Category or one title to collect all related video with each other

## Lessons Schema V1

Lessons {
id
Course_id // > each lessons contain one Course_id
title --> i think use enums will help us here very much to defin titles we can use or categories
overView
notes
Video_Link
Files? : []
img? text --> one url for thumbnail
User_Houres?:
}

## Course Schema V1

Course {
id
Lessons_ID : [],
Title
Category,

}

i think it will be better to make another tabel to save progress , courses between user and course because relation between User , Course is Many-to-Many so it's a must to make a tabel between User , Course to be the relation One-to-Many

## enrollMent Schema V1

Enrollment{
id
User_Id :
Cou
}

<!-- another features we need --->

# Schema V2

## the role is any data maybe change after create the data and change from user to other put it in a different tabels

User {
// basic info
id
userName
email
password
createdAt
role : --> use enum ["Student","Instructor","Admin"]
// tebels needed for variable data
enrollments : Enrollment[] // each course user have enroll has own enrollment tabel it's like ticket that contain info about what course he enroll by id and when and it's completed or not and the enrollments like bage to save all tickets

    notes : Notes[]
    lessonsProgress : LessonsProgress[]
    certificates :Certificates[]
    courses         Course?[]         // courses this user created (instructor)

}

<!-- Lessons Schema -->

Lessons {
// basic info
id
title
overView
duration
createdAt
category string // to collect related lessons with each other like chapter 1
// featrued info
isPublished
videoUrl
img_thumbnail?
orderIndex // to order it when present it
// related Tabel
Course_id
// var data need separte tabels
attachment : Attachment[] // each lessons have its own attachment so it's different from lesson to other
notes : Notes?[]
lessonProgress LessonProgress[]
}

<!-- the container of Lessons -->

Course {
// basic info
id
title
category
level
description
price
thumbnailUrl
isPublished
createdAt
instructorId String

    // related Tabels
    certificates Certificate[]
    lessons : Lessons[]
    enrollment : EnrollMent[]

}

#### Secondary Tabels for var data

<!-- i need to add Notes , Attachment , lessonProgress , Certificate , Enrollment tabels -->

Enrollment {
// basic info
id
Course_Id
User_Id
enrolledAt
//featured info
// i don't know how to make it with code
progressPercent
completedAt
lastAccessedAt
// make sure that a user can only enroll once per course
@@unique([userId, courseId])
}

lessonProgress{
// basic info
id
userId
lesson_id
duration
watchedSeconds Int @default(0)
isCompleted Boolean @default(false)
lastWatchedAt DateTime?
}
Certificate{
id
userId
CourseId
certificateUrl
issuedAt
@@unique([CourseId,userId]) // يعني المستخدم الواحد في الكورس الواحد عنده شهادة اتمام واحدة
}
Attachment{
id
lessonsId
file_url
file_type
fileName
}
Notes{
id
user_Id
lesson_Id
content

    videoTimestamp Int      @default(0)  // seconds into video when note was written
    createdAt      DateTime

}

<!-- End Tabels -->

# start routes and controller V1

<!-- User -->
first user go to <h1>"/courses"<h1>' to see all courses in site
user go to <h1>/user/courses/</h1> to see his courses with get token then get jwt.verify
user go to <h1>/user/courses/:id/ </h1>--> first check if he have this course or not then give him data about this course then present thumbnail title category description thumbnailUrl level instructorId lessons
<h1>courses/user/:course_id/:lesson_id </h1>
<h1>"/user"</h1> // present Dashboard --> present totla hours by calc hours from lessonsProgress by select with userId and i same way get all user courses and present it and Certificate , ....








<!-- Admin -->



we have 9 elements to handle with 

## User

First Check him if he have token or not then get jwt.verify
if he have token mean he is logged in if not he can see just public data like course overView and featured course 
### check if he have token or not
```js
if(he-Have-Token){
    get it from header then get jwt.verify
   const decoded = JWT.verify( , proccess.env.JWT_SECTER_KEY)
   with it compare it with user in db 
   if(user){
    req.user = user
    next()
   }
}
else{
    return res.status(401).json({message:"not token exist"})
}
```
if he doesn't have token mean he is not logged in so direct him to login page
```js
// register
try{
    const {userName , email , password , email} = req.body
    const user = await User.findUnique({where:{email:email}})
    if(user){
        return res.status(400).json({message:"user already exist"})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({data:{userName , email , password:hashedPassword}})
    const token = JWT.sign({id:newUser.id} , proccess.env.JWT_SECTER_KEY,{expiresIn:"1h"})
    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:60*60*1000
        })
    res.status(201).json({message:"user created successfully" })
}
catch(err){
    console.log(err.message)
    res.status(500).json({message:"there is an err with serer",err:err.message})
}
```

```js
// login
try{
    const {email , password} = req.body
    const user = await User.findUnique({where:{email:email}})
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    const isPasswordValid = await bcrypt.compare(password , user.password)
    if(!isPasswordValid){
        return res.status(401).json({message:"invalid password"})
    }
    const token = JWT.sign({id:user.id} , proccess.env.JWT_SECTER_KEY,{expiresIn:"1h"})
    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:60*60*1000
        })
    res.status(200).json({message:"user logged in successfully" })
}
catch(err){
    console.log(err.message)
    res.status(500).json({message:"there is an err with serer",err:err.message})
}
```
so here we ensure that we have an user with token and he can handle with any fetures
```js
// me --> route that provide user data to front end because he can't access to token in cookies so he send req to this route to get his data 
try{
    const token = req.cookies.token;
    const decoded = JWT.verify(token , proccess.env.JWT_SECTER_KEY)
    const user = await User.findUnique({where:{id:decoded.id},select:{"--pasword"}})
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    req.user = user
    next()
}
catch(err){
    console.log(err.message)
    res.status(500).json({message:"there is an err with serer",err:err.message})
}

```
after that we have get data of the User so suppose that he going to enrollment new Course or complete new Course or add notes 
### enroll to New Course
means that we will get in req obj course id and we already have user data form me middleware so we can enroll user to course

```js
try{
    const {courseId} = req.params
    const user = req.user
    // here we have user and we still need to get course
    const course = await prisma.course.findUnique({where:{id:courseId}})
    if(!course){
        return res.status(404).json({message:"course not found"})
    }
    // here we have user and course so we can enroll user to course
    // first check if user is already enrolled to this course
    const enrollment = await prisma.enrollment.findUnique({where:{userId:user.id,courseId:course.id}})
    if(enrollment){
        // instead of return err just direct him to course page
        return res.redirect(`/courses/${courseId}`)
    }
    const enrollment = await prisma.enrollment.create({data:{userId:user.id,courseId:course.id}})
    res.status(201).json({message:"user enrolled successfully",enrollment   })
}
catch(err){
    console.log(err.message)
    res.status(500).json({message:"there is an err with serer",err:err.message})
}
```
here we have ensure user have enroll to course so now he can handle with course so we must provide other features like .....
and for instructor we have create enrollment with courseId so we can search with all enrollment that containt his coureId in CourseId row in enrollments tabel

---
after user enroll to course he go to course page and see all lessons in course and he can handle with it
## Course
### GET ---> any client can get all courses and featured courses
normal user can get just overview of course and featured course
STUDENT can get his courses and go to course page to enroll or see public data or his progress and thumbnails and can go to Course-Detail to watch course by get lessonId or lessons
<!-- Course-Overview -->
he can see title , description , thumbnail , price , instructor , rating , number of students , number of lessons , number of reviews , number of attachments , number of notes , number of lessonProgress , number of certificates

AFTER THAT we suppose he enroll and we have make enrollment record in db so now he can go to course page and see all lessons in course and he can handle with it


<!-- Course-Detail || Course-player-page -->
get userId from req.user then get courseId from req.params then check if user is enrolled to this course if not return err else return course data and all lessons in course and --> do it with compare userId , courseId with enrollment table
so if successfull he can see all lessons in course and he can handle with it

so in watch we will talk about it in Lesson section

### POST ---> only admin and instructor can create course
in short 
we get user data from req.user the use middleWares for check if he is admin or instructor then create course and we get in req.body that {
    title , description , price , thumbnail , level , category, isPublished or not
}
### DELETE ---> only admin and instructor can delete course
Delete and return so front end use it to make filter or delet it from UI without reload page
### PATCH ---> only admin and instructor can update course
very simple you can say it's like POST but with update
## Enrollment
### GET
user can get all his enrollments to see his courses 
and instructor can get all his enrollments to see his courses he created
<!-- For STUDENT -->
get his id from req.user and return all enrollments that contain his id

<!-- For INSTRUCTOR -->
get his id from req.user and return all enrollments that contain his id and Courses Links

### POST
we get in req.body that {courseId} and user id from req.user

## Lessons
### GET --> user who have enrollments only
user can't easily type lessonId to go to lesson page so we must provide lessonId in url like /courses/:courseId/lessons/:lessonId and it's the Course player page who send req to this route to get lesson data and in each req ensure that user is enrolled to this course ---> 'Add Middleware to get all user enrollments'

then after user go to course-player-page Course send a req or user when write in url /courses/:courseId/lessons/:lessonId he get response contain lesson data and if he want all lessons in course just /courses/:courseId/ and it will be like more Course-Detail 
### POST --> only admin and instructor can create lesson
we get in req.body that {
    title , description , videoUrl , duration , courseId , overView , isPublished ,category  , orderIndex
}
and it's a must to get courseId from req.params 
the Route will be like /courses/:courseId/lessons
### PATCH --> only admin and instructor can update lesson
the Route will be like /courses/:courseId/lessons/:lessonId
### DELETE --> only admin and instructor can delete lesson
the Route will be like /courses/:courseId/lessons/:lessonId


## Certificate
### GET
we send it to user when he complete course when progressPercentage = 100 in enrollment table
### POST
we get in req.body that {courseId} and user id from req.user and REMEMBER ANY routes include admin or instructor must have middleware to check if he is admin or instructor
### DELETE
only admin and instructor can delete certificate
### PATCH
only admin and instructor can update certificate

## Attachment
### GET
user who have enrollments only can get attachment
we get courseId from req.params and user id from req.user and check if user is enrolled to this course if not return err else get lessonId from req.params then search in attachments table with lessonId and return attachment data
### POST
only admin and instructor can create attachment
we get courseId from req.params and user id from req.user and check if user is enrolled to this course if not return err else get lessonId from req.params then create attachment in attachments table
### DELETE
only admin and instructor can delete attachment
### PATCH
only admin and instructor can update attachment


## Notes
### GET
user who have enrollments only can get notes
we get lessonId from req.params and user id from req.user and check if user is enrolled to this course if not return err else get lessonId from req.params then search in notes table with lessonId , userId and return note data
### POST
only STUDENT can create note
we get lessonId from req.params and user id from req.user and check if user is enrolled to this course if not return err else get lessonId from req.params then create note in notes table
### DELETE
only STUDENT can delete note
### PATCH
only STUDENT can update note


## LessonProgress
### GET
we get userId , if we have lessonId in req.params we search in lessonProgress table with lessonId , userId and return lessonProgress data else we return all lessonProgress data for this user
### POST
we get req to generate lessonProgress when user start to watch lesson and we receive lessonId from req.params and user id from req.user and check if user is enrolled to this course if not return err else get lessonId from req.params then create lessonProgress in lessonProgress table we add lastWatchedAt
we get lesson duration from lesson table and we add it to lessonProgress table to check if duration is full or not
### PATCH
we get lessonId from req.params and user id from req.user and check if user is enrolled to this course if not return err else get in req.body that {progressPercentage} and update lessonProgress in lessonProgress table we add lastWatchedAt
### DELETE
only admin and instructor can delete lessonProgress
<!-- NOTICE -->
lessons tabel is who control with lessonProgress and generate it when start to watch lesson



## notes
i see this sort in write is very good because 
all thing under user is related to user and the same thing for lessons and courses

course --> Lessons , enrollments , certificates
lessons --> attachments , notes , lessonProgress

## MiddleWare

```js
const getUserInfo = (req)async =>{
    try{
        const decoded = JWT.verify( , proccess.env.JWT_SECTER_KEY)
    if(!decoded){
        return res.status(401).json({message:"not token exist"})
    }
    const user = await User.findUnique({
        where:{id:decoded.id},
        select:{"--pasword"}
    })
    if (!user||user == null){
        return res.status(404).json({message:"user not found"})
    }
    return user
    }

}
app.use("/courses/user",(req ,res,next)async=>{
    try{
       const user = await getUserInfo(req)
       req.user = user
    }
    catch(err){
        console.log(err.message)
        res.status(500).json({message:"there is an err with serer",err:err.message})
    }
})
app.use("/courses/admin",(req ,res,next)async=>{
    try{
       const user = await getUserInfo(req)
       if(user.role ==="STUDENT"){
        return res.status(401).json({message:"you don't have access"})
       }
       req.user = user
    }
    catch(err){
        console.log(err.message)
        res.status(500).json({message:"there is an err with serer",err:err.message})
    }
})
// ask AI to more middleware to add
```

### Data journey
first user go to /courses to see all courses or featured courses or he can login in /login or register in /register
then he go to course page to see course details 
then if he login he can enroll to course --> create enrollment record in enrollment table
then he can watch lesson by go to /courses/user/:course_id/:lesson_id and the 
    lessons will be preserved in course player by after get courseId , lessonId from url then we get videoUrl from lesson table and send it to course player and if he want to watch next lesson he can go to /courses/user/:course_id/:lesson_id+1 and so on and in each 10s front end will send req to update lessonProgress table
then he can add notes after taking userId , lessonId , coureId (to ensure this is for this lesson in this course) and define videoTimeStamp by get it in req.body
then he can get certificate if lessonProgress percentage = 100
























you make CourseActive component to show in 
courses/:courseId/lessons
 as you can see in eraser.io
 

you make AllLesson component to show in 
courses/:courseId/lessons/:lessonID
as you can see in eraser.io


## Data i need in Active lessons



in courses/:courseId/lessons i will get last lesson from enrollment 