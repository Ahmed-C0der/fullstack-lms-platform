import { prisma } from "../lib/prisma.ts"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  userName: z.string().min(2).max(50)
})
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
})
const generateHashPassword = async (password) => {
    const salt = await bcrypt.genSalt(12)
    const hashPassword = await bcrypt.hash(password, salt)
    return hashPassword

}
const comparePassowrd = async (password, DBPassword) => {
    const Compare = await bcrypt.compare(password, DBPassword)
    return Compare
}
export const register = async (req, res) => {
    const { email, password, userName } = req.body
    try {
        // add user to DB
        // Hash Bassword Before save it
        const validation = registerSchema.safeParse(req.body)
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.flatten() })
        }
        const hashPassword = await generateHashPassword(password)
        const user = await prisma.user.create({
            data: {
                email,
                password: hashPassword,
                userName
            },

        })
        const User = {
            userName: user.userName,
            email: user.email,
            role: user.role
        }
        // if Success generate Token
        const token = JWT.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" })
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only true in production
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",

            maxAge: 24 * 60 * 60 * 1000
        })
        res.json(User)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "there is an err with server try later", err: err.message })
    }
}

export const login = async (req, res) => {
    // get email , password
    const { email, password } = req.body
    try {
        const validation = loginSchema.safeParse(req.body)
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.flatten() })
        }
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user || user == null) {
            res.status(404).json({ message: "user not found" })
            return
        }
        // compare password
        const compare = await comparePassowrd(password, user.password)
        if (!compare) {
            res.status(401).json({ message: "password is incorrect" })
            return
        }
        const token = JWT.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" })
        res.cookie("token", token, {
            httpOnly: true, // Prevents JavaScript (XSS) from reading the cookie
            secure: process.env.NODE_ENV === "production", // Only true in production
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
        const User = {
            userName: user.userName,
            email: user.email,
            role: user.role,
            id: user.id,
            avatarUrl: user.avatarUrl,
        }
        res.json(User)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err: err.message })
    }
}

export const requireAuth = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}

export const me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                role: true,
                userName: true,
                avatarUrl: true,
            }
        })
        res.json(user)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

export const logout = (req, res) => {
    res.clearCookie('token')
    res.json({ message: "logged out successfully" })
}

export const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Unauthorized" })
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                userName: true,
                email: true,
                role: true,
                avatarUrl: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        res.json(users)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}