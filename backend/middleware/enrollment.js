import catchError from "../catchError.js";
import { prisma } from "../lib/prisma.ts";
export const isEnrolled = async (req, res, next) => {
  const user = req.user;
  const { courseId } = req.params;
  try {
    const enrollment =await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: user.id, courseId },
      },
    });
    if (!enrollment) {
      return res.status(403).json({ message: "forbidden" });
    }
    // add enrollment to update percent
    req.enrollmentId = enrollment.id;
    next();
  } catch (error) {
    catchError(res,error);
  }
};
