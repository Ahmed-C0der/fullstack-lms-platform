"use client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { ChevronDown, DatabaseSearchIcon, ArchiveIcon, Lectern, User2, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Library, Paperclip } from "lucide-react";
import { JSX } from "react";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { IUser } from "@/lib/models";
import interactWithDB from "@/lib/getDataFromDB";
interface ILink {
    id: number,
    title: string,
    icon: JSX.Element,
    url:string
}

export function AppSidebar() {
    const { courseId } = useParams();
    const {user , isCheckingAuth,setUser} = useAuth()

    const getGlobalLinks = () => {
        const baseLinks: ILink[] = [
            { id: 1, title: "Home", icon: <Lectern className="size-4" />, url: "/" },
            { id: 2, title: "All Courses", icon: <DatabaseSearchIcon className="size-4" />, url: "/courses" },
            { id: 3, title: "My Enrollments", icon: <ArchiveIcon className="size-4" />, url: "/myEnrollment" },
        ];

        if (user?.role === "INSTRUCTOR" || user?.role === "ADMIN") {
            baseLinks.push(
                { id: 4, title: "Instructor Studio", icon: <User2 className="size-4" />, url: "/courseBuilder" },
                { id: 5, title: "Analytics", icon: <ArchiveIcon className="size-4" />, url: "/analytics" }
            );
        }

        if (user?.role === "ADMIN") {
            baseLinks.push(
                { id: 6, title: "Admin Panel", icon: <DatabaseSearchIcon className="size-4" />, url: "/AdminDashboard" }
            );
        }

        return baseLinks;
    }

    const links = getGlobalLinks()

    let loggingOut = false
    const logoutfunction = async () => {
    if (loggingOut) return
    loggingOut = true

    const { target, isFinished } = await interactWithDB<IUser>("/api/auth/logout","POST")
    if (target) {
      if (setUser) {
        setUser(null)
        console.log("done")
      }
    }
    loggingOut = !isFinished
  }
    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader>
                {/* may be will be just the name of the course and H1 like create more creativity */}
            </SidebarHeader>
            <SidebarContent>
                {/* three links : all lessons , buildLesson , buildAttachment */}
                <SidebarMenu className=" h-full">
                    {links.map((link)=>(
                    <SidebarMenuItem key={link.id}>
                        <SidebarMenuButton asChild>
                            <Link href={link.url} className="flex items-center gap-2">
                                {link.icon}
                                <span className="font-medium text-sm">{link.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    ))}
                    
                </SidebarMenu>

            </SidebarContent>
            <SidebarFooter>
                {/* i think here i will just add dropwond menu for user */}
                <SidebarMenu>
            <SidebarMenuItem>
                {isCheckingAuth ? <>looding <Spinner/></> :user &&
                
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    {/* {user.avatarUrl ?<Image width={100} height={100} src={user.avatarUrl} alt={`img for user ${user.userName}`}></Image> :<User2 />} */}
                    <User2 />
                     {user.userName} <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Email:{user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Role:{user.role}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profileSetting">Setting</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive"className="cursor-pointer" onClick={logoutfunction}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
                
                }
              
            </SidebarMenuItem>
          </SidebarMenu>

            </SidebarFooter>
        </Sidebar>
    );
}
