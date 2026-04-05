"use client"
import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'

export default function Register() {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
      const {setUser} = useAuth()

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useGSAP(() => {
    gsap.fromTo(
      ".auth-card",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    )
  }, { scope: containerRef })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_SERVER || 'http://localhost:5000'
      const response = await fetch(`${url}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error((data && data.message) || 'Registration failed. Please try again.')
      }

      // Redirect to login page upon success
      setUser!(data)
      router.push('/')
    } catch (error: any) {
      setErrorMsg(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Background brand elements */}
      <div className="absolute inset-0 z-0 bg-slate-100/50" />
      <div className="absolute top-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      <Card className="w-full max-w-md z-10 auth-card shadow-sm border-slate-200 bg-white">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Create an account
          </CardTitle>
          <CardDescription className="text-slate-500 text-sm font-medium">
            Start your learning journey today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
                {errorMsg}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-slate-700">Username</Label>
              <Input 
                id="userName" 
                placeholder="johndoe" 
                required 
                value={formData.userName}
                onChange={handleChange}
                className="border-slate-300 focus-visible:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                required 
                value={formData.email}
                onChange={handleChange}
                className="border-slate-300 focus-visible:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={formData.password}
                onChange={handleChange}
                className="border-slate-300 focus-visible:ring-indigo-500"
              />
            </div>
            <Button disabled={isLoading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-slate-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
