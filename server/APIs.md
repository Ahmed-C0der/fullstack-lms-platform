# Courses

http://localhost:5000/api/courses/

## Data Type

```JSON
{
    "id": "29d66c7c-5b29-4e87-b295-097698353e4a",
    "title": "React from Zero to Hero",
    "category": [
      "Frontend",
      "JavaScript"
    ],
    "description": "Learn React from scratch — components, hooks, state management, and more. Build real projects and understand the core concepts behind modern frontend development.",
    "isFeatured": true,
    "thumbnailUrl": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
    "level": "BEGINNER",
    "isPublished": true,
    "createdAt": "2026-04-01T16:47:28.503Z",
    "language": "Arabic",
    "price": 199,
    "instructorId": "f4a01147-dd27-41ae-b473-47553af4a936"
  },
```

# Lessons

http://localhost:5000/api/courses/:courseId/lessons

## Data Type

```JSON
[
  {
    "id": "31acc531-cac2-4167-8134-ff8790ca88cb",
    "title": "What is React?",
    "durationSeconds": 300,
    "orderIndex": 1,
    "category": "Introduction",
    "overview": "We cover what React is, why it was created, and how it differs from vanilla JavaScript. We also look at the virtual DOM and why it makes React fast.",
    "isPublished": true
  },
  {
    "id": "facfb485-4cbb-4275-952e-3e7e754efb96",
    "title": "Setting Up Your Environment",
    "durationSeconds": 480,
    "orderIndex": 2,
    "category": "Introduction",
    "overview": "Install Node.js and create a React app using Vite. We explore the project structure and understand what each file does.",
    "isPublished": true
  },
  {
    "id": "69f0544a-e4be-423b-bd4b-8bee359924d4",
    "title": "Your First Component",
    "durationSeconds": 600,
    "orderIndex": 3,
    "category": "Components",
    "overview": "Learn what a component is, how to create one, and how to render it inside your app. We cover functional components and JSX syntax.",
    "isPublished": true
  },
  {
    "id": "b0ed908d-28a9-4d4b-8a81-4d4b646dcb8a",
    "title": "Props and Data Flow",
    "durationSeconds": 540,
    "orderIndex": 4,
    "category": "Components",
    "overview": "Understand how data flows from parent to child components using props. Learn prop types and default values.",
    "isPublished": true
  },
  {
    "id": "69997bc3-f04b-4021-9298-3e468b71ff99",
    "title": "useState Hook",
    "durationSeconds": 720,
    "orderIndex": 5,
    "category": "Hooks",
    "overview": "Understand state in React and how to use the useState hook to manage dynamic data inside your components.",
    "isPublished": true
  }
]

```

# Lessons ENROLLED

http://localhost:5000/api/courses/:courseId/lessons/enrolled

## Data type

```JSON
[
  {
    "id": "31acc531-cac2-4167-8134-ff8790ca88cb",
    "title": "What is React?",
    "durationSeconds": 300,
    "orderIndex": 1,
    "category": "Introduction",
    "overview": "We cover what React is, why it was created, and how it differs from vanilla JavaScript. We also look at the virtual DOM and why it makes React fast.",
    "isPublished": true,
    "_count": {
      "lessonProgress": 0,
      "notes": 0,
      "attachments": 0
    },
    "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    "id": "facfb485-4cbb-4275-952e-3e7e754efb96",
    "title": "Setting Up Your Environment",
    "durationSeconds": 480,
    "orderIndex": 2,
    "category": "Introduction",
    "overview": "Install Node.js and create a React app using Vite. We explore the project structure and understand what each file does.",
    "isPublished": true,
    "_count": {
      "lessonProgress": 0,
      "notes": 0,
      "attachments": 0
    },
    "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    "id": "69f0544a-e4be-423b-bd4b-8bee359924d4",
    "title": "Your First Component",
    "durationSeconds": 600,
    "orderIndex": 3,
    "category": "Components",
    "overview": "Learn what a component is, how to create one, and how to render it inside your app. We cover functional components and JSX syntax.",
    "isPublished": true,
    "_count": {
      "lessonProgress": 0,
      "notes": 0,
      "attachments": 0
    },
    "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    "id": "b0ed908d-28a9-4d4b-8a81-4d4b646dcb8a",
    "title": "Props and Data Flow",
    "durationSeconds": 540,
    "orderIndex": 4,
    "category": "Components",
    "overview": "Understand how data flows from parent to child components using props. Learn prop types and default values.",
    "isPublished": true,
    "_count": {
      "lessonProgress": 0,
      "notes": 0,
      "attachments": 0
    },
    "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    "id": "69997bc3-f04b-4021-9298-3e468b71ff99",
    "title": "useState Hook",
    "durationSeconds": 720,
    "orderIndex": 5,
    "category": "Hooks",
    "overview": "Understand state in React and how to use the useState hook to manage dynamic data inside your components.",
    "isPublished": true,
    "_count": {
      "lessonProgress": 0,
      "notes": 0,
      "attachments": 0
    },
    "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4"
  }
]


```

# Enrollment
http://localhost:5000/api/enrollments/me

http://localhost:5000/api/enrollments/:courseId
## DATA TYPE

```JSON
{
    "id": "b87f3867-4cd9-4ea3-aff8-3c603dda6a05",
    "userId": "f4a01147-dd27-41ae-b473-47553af4a936",
    "courseId": "29d66c7c-5b29-4e87-b295-097698353e4a",
    "lastLesson": "31acc531-cac2-4167-8134-ff8790ca88cb",
    "progressPercent": 0,
    "enrolledAt": "2026-04-02T12:26:14.649Z",
    "completedAt": null,
    "lastAccessedAt": null
  }


```
