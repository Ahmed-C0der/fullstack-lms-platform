"use client"
import interactWithDB from "@/lib/getDataFromDB";
import { Enrollment } from "@/lib/models";
import React, { createContext, ProviderProps, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const EnrollmentContext = createContext<{enrollments:Enrollment[] | null , isCheck:boolean,editLocallEnrollemnts:(enrollment:Enrollment)=>void
}>({
    enrollments:null,
    isCheck:true,
    editLocallEnrollemnts(enrollment){}
})

export const EnrollmentContextProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
     const { user, isCheckingAuth } = useAuth()
    const [enrollments ,setEnrollments ] = useState<Enrollment[]|null>(null)
    const [isCheck , setisCheck]= useState<boolean>(true)
    useEffect(()=>{
        if (isCheckingAuth) return 
    
    if (!user) {
      setisCheck(false)         
      return
    }

        const Gett = async ()=>{
            const { target, isFinished } = await interactWithDB<Enrollment[]>("/api/enrollments/me")
            setEnrollments(target)
            setisCheck(false)
        }
        Gett()
    },[user, isCheckingAuth])
    function editLocallEnrollemnts(enrollment:Enrollment){
        setEnrollments((pre)=>[...(pre || []),enrollment])
    }
    return (
        <EnrollmentContext.Provider value={{enrollments , isCheck , editLocallEnrollemnts}}>
            {children}
        </EnrollmentContext.Provider>
    )
}

export const useEnrollment = () => useContext(EnrollmentContext)