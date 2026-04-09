"use client"
import React, { useEffect, useState } from 'react'
import interactWithDB from '@/lib/getDataFromDB'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Shield, BookOpen } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      const { target, isFinished } = await interactWithDB<any[]>('/api/auth/users')
      if (target) {
        setUsers(target)
      }
      setIsLoading(!isFinished)
    }
    fetchUsers()
  }, [])

  if (isLoading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-10 text-indigo-600" />
          <p className="text-muted-foreground animate-pulse font-medium">Fetching User Database...</p>
        </div>
      </div>
    )
  }

  // Quick stats calculations
  const totalUsers = users.length || 0
  const totalInstructors = users.filter(u => u.role === 'INSTRUCTOR').length || 0
  const totalAdmins = users.filter(u => u.role === 'ADMIN').length || 0

  return (
    <div className="container mx-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-muted-foreground text-lg">Manage all internal and student accounts across your platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative bg-white dark:bg-slate-950">
           <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-10 pointer-events-none">
              <Users className="size-24" />
           </div>
           <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Total Users</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-5xl font-black tracking-tighter">{totalUsers}</div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Registered platform accounts</p>
           </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative bg-white dark:bg-slate-950">
           <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-10 pointer-events-none">
              <BookOpen className="size-24" />
           </div>
           <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Instructors</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">{totalInstructors}</div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Course creators & educators</p>
           </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative bg-white dark:bg-slate-950">
           <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-10 pointer-events-none">
              <Shield className="size-24" />
           </div>
           <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Administrators</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">{totalAdmins}</div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Platform moderators & admins</p>
           </CardContent>
        </Card>
      </div>

      {/* Database Table */}
      <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-950">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 px-6 py-5">
           <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">User Database Directory</CardTitle>
           </div>
        </CardHeader>
        <CardContent className="p-0">
           <Table>
             <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
               <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-800">
                 <TableHead className="w-[100px] text-center font-semibold">Avatar</TableHead>
                 <TableHead className="font-semibold">User ID / Name</TableHead>
                 <TableHead className="font-semibold">Contact Email</TableHead>
                 <TableHead className="font-semibold">Role Type</TableHead>
                 <TableHead className="text-right font-semibold pr-6">Joined Date</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id} className="cursor-default hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group border-slate-100 dark:border-slate-800">
                      <TableCell className="py-4">
                        <div className="flex justify-center">
                            <Avatar className="size-10 border border-slate-200 dark:border-slate-800 shadow-sm group-hover:scale-105 group-hover:ring-2 group-hover:ring-indigo-100 transition-all">
                              <AvatarImage src={user.avatarUrl} />
                              <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold uppercase dark:bg-indigo-900/30 dark:text-indigo-400">
                                 {user.userName ? user.userName.substring(0, 2) : "U"}
                              </AvatarFallback>
                            </Avatar>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-0.5">
                           <span className="font-semibold text-slate-900 dark:text-slate-100">{user.userName || "Unknown User"}</span>
                           <span className="text-[11px] text-slate-400 font-mono tracking-tighter truncate w-32" title={user.id}>{user.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400 font-medium py-4">
                        {user.email}
                      </TableCell>
                      <TableCell className="py-4">
                        {user.role === 'ADMIN' && (
                           <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 shadow-sm px-3 py-1 tracking-wide">ADMIN</Badge>
                        )}
                        {user.role === 'INSTRUCTOR' && (
                           <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 shadow-sm px-3 py-1 tracking-wide border-0">INSTRUCTOR</Badge>
                        )}
                        {(user.role === 'STUDENT' || !user.role) && (
                           <Badge variant="outline" className="text-slate-500 dark:text-slate-400 px-3 py-1 tracking-wide border-slate-200 dark:border-slate-700">STUDENT</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-slate-500 dark:text-slate-400 font-medium text-sm py-4 pr-6">
                         {new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                         })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                     <TableCell colSpan={5} className="h-40 text-center text-muted-foreground font-medium">
                        No users found in database.
                     </TableCell>
                  </TableRow>
                )}
             </TableBody>
           </Table>
        </CardContent>
      </Card>
    </div>
  )
}