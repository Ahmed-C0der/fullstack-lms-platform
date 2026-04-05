import JWT from "jsonwebtoken"
import { prisma } from "../lib/prisma.ts"

export const getUserInfo = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ message: "no token" })
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY)

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                avatarUrl: true,
                userName: true,
                role: true
            }
        })

        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        req.user = user
        next()

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err.message })
    }
}

export const notStudent = (req, res, next) => {
    const { role } = req.user
    if (role === "STUDENT") {
        return res.status(403).json({ message: "forbidden" })
    }
    next()
}
