import express from "express"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import lessonRouter from "./routes/lessons.routes.js"
import courseRouter from "./routes/courses.routes.js"
import enrollmentRouter from "./routes/enrollment.routes.js"
import { getUserInfo } from "./middleware/UserData.js"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

/*
Note: Many developers still keep CORS enabled on the backend as a "second layer" of security,
 just in case they want to allow other apps to connect later. But for your Next.js app to work through a proxy,
  the backend CORS can be totally turned off.

*/
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/courses/:courseId/lessons", getUserInfo, lessonRouter)
app.use("/api/courses", courseRouter)
app.use("/api/enrollments", getUserInfo, enrollmentRouter)
app.listen(PORT, () => console.log("server is running on Port :" + PORT))