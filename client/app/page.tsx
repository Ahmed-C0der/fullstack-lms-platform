"use client"
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import HomePage from "./Mycomponents/homePage";
import { Spinner } from "@/components/ui/spinner";
import Student from "./Mycomponents/dashboard/studentDashboard";
import NotStudent from "./Mycomponents/dashboard/notStudentDashboard";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isCheckingAuth } = useAuth()
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && user) {
      router.replace("/userProfile/dashboard")
    }
  }, [user, isCheckingAuth, router])

  if (isCheckingAuth) return <Spinner />
  if (user) return null    

  return <HomePage />
}
