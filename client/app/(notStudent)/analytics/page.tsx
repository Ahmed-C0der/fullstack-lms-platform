"use client"

import React from "react"
import { TrendingUp, Users, BookOpen, GraduationCap, DollarSign } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Mock Data
const enrollmentData = [
  { month: "Jan", enrollments: 186, completions: 80 },
  { month: "Feb", enrollments: 305, completions: 200 },
  { month: "Mar", enrollments: 237, completions: 120 },
  { month: "Apr", enrollments: 173, completions: 190 },
  { month: "May", enrollments: 309, completions: 130 },
  { month: "Jun", enrollments: 414, completions: 140 },
]

const revenueData = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5100 },
  { month: "Mar", revenue: 4900 },
  { month: "Apr", revenue: 7300 },
  { month: "May", revenue: 8400 },
  { month: "Jun", revenue: 10100 },
]

const enrollmentConfig = {
  enrollments: {
    label: "Enrollments",
    color: "#4f46e5", // Indigo 600
  },
  completions: {
    label: "Completions",
    color: "#10b981", // Emerald 500
  },
} satisfies ChartConfig

const revenueConfig = {
  revenue: {
    label: "Revenue ($)",
    color: "#8b5cf6", // Violet 500
  },
} satisfies ChartConfig

export default function AnalyticsDashboard() {
  return (
    <div className="container mx-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold tracking-tight text-slate-900 dark:text-white">Platform Analytics</h1>
        <p className="text-muted-foreground text-lg">Monitor student engagement, course performance, and financial metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tighter">$40,000</div>
            <p className="text-xs flex items-center text-emerald-500 font-medium mt-1">
              <TrendingUp className="size-3 mr-1" /> +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase">Active Students</CardTitle>
            <Users className="size-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tighter">+2,350</div>
            <p className="text-xs flex items-center text-emerald-500 font-medium mt-1">
              <TrendingUp className="size-3 mr-1" /> +180 since yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase">Certificates Issued</CardTitle>
            <GraduationCap className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tighter">860</div>
            <p className="text-xs flex items-center text-emerald-500 font-medium mt-1">
              <TrendingUp className="size-3 mr-1" /> +19% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase">Active Courses</CardTitle>
            <BookOpen className="size-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tighter">142</div>
            <p className="text-xs flex items-center text-slate-500 font-medium mt-1">
              7 new courses added this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart - Enrollments vs Completions */}
        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Student Engagement</CardTitle>
            <CardDescription>Enrollments & Completions over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={enrollmentConfig} className="min-h-[250px] w-full">
              <BarChart accessibilityLayer data={enrollmentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="enrollments" fill="var(--color-enrollments)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completions" fill="var(--color-completions)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 pt-4">
            <div className="flex items-center gap-2 font-medium leading-none">
              Engagement is trending up by 5.2% this month <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-muted-foreground text-sm leading-none">
              Showing total volume for the selected timeframe.
            </div>
          </CardFooter>
        </Card>

        {/* Area Chart - Revenue */}
        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Revenue Trajectory</CardTitle>
            <CardDescription>Overall platform income over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={revenueConfig} className="min-h-[250px] w-full">
              <AreaChart
                accessibilityLayer
                data={revenueData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 pt-4">
            <div className="flex items-center gap-2 font-medium leading-none">
              MRR grew by over 20% in June <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-muted-foreground text-sm leading-none">
              A continuous positive trajectory due to new Premium Course additions.
            </div>
          </CardFooter>
        </Card>

      </div>

    </div>
  )
}
