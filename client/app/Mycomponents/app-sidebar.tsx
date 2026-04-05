"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroupLabel,
    SidebarGroupContent
} from "@/components/ui/sidebar";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { Plus, Library, Paperclip, Settings, Box } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CourseBuilderSidebar() {
    const { courseId } = useParams();
    const pathname = usePathname();

    return (
        <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <SidebarHeader className="p-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 dark:bg-white p-2 rounded-lg text-white dark:text-slate-900">
                        <Box className="size-5" />
                    </div>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Studio</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">Course Builder</span>
                    </div>
                </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                        Creation Tools
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            <SidebarMenuItem>
                                <SidebarMenuButton 
                                    asChild 
                                    isActive={pathname.includes("allLessons")}
                                    className={cn("py-5 px-3 rounded-xl transition-all", pathname.includes("allLessons") ? "bg-slate-200 dark:bg-slate-800 font-semibold" : "")}
                                >
                                    <Link href={`/courseBuilder/${courseId}/allLessons`} className="flex items-center gap-3">
                                        <Library className="size-5" />
                                        <span className="text-[15px]">All Lessons</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            
                            <SidebarMenuItem>
                                <SidebarMenuButton 
                                    asChild 
                                    isActive={pathname.includes("buildLesson")}
                                    className={cn("py-5 px-3 rounded-xl transition-all", pathname.includes("buildLesson") ? "bg-slate-200 dark:bg-slate-800 font-semibold" : "")}
                                >
                                    <Link href={`/courseBuilder/${courseId}/buildLesson`} className="flex items-center gap-3">
                                        <Plus className="size-5" />
                                        <span className="text-[15px]">Add Lesson</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            
                            <SidebarMenuItem>
                                <SidebarMenuButton 
                                    asChild 
                                    isActive={pathname.includes("buildAttachment")}
                                    className={cn("py-5 px-3 rounded-xl transition-all", pathname.includes("buildAttachment") ? "bg-slate-200 dark:bg-slate-800 font-semibold" : "")}
                                >
                                    <Link href={`/courseBuilder/${courseId}/buildAttachment`} className="flex items-center gap-3">
                                        <Paperclip className="size-5" />
                                        <span className="text-[15px]">Attachments</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter className="p-4 border-t border-slate-200 dark:border-slate-800">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="py-5 px-3 rounded-xl text-muted-foreground hover:text-slate-900 dark:hover:text-white transition-all">
                            <Link href={`/userProfile/dashboard`} className="flex items-center gap-3">
                                <Settings className="size-5" />
                                <span className="text-[15px] font-medium">Exit Builder</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
