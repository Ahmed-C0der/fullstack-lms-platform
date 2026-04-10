"use client";

import React, { JSX, useState } from "react";
import {
  User,
  Menu,
  X,
  LogOut,
  ChartNoAxesCombinedIcon,
  CodeSquare,
  Album,
  GraduationCap,
  PanelLeftIcon,
  Mail,
  Settings
} from "lucide-react";
import { ModeToggle } from "./modeToggle";
import { useAuth } from "@/context/AuthContext"; // get user data by dompine fetch with useContext , creatContext
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import interactWithDB from "@/lib/getDataFromDB";
import { IUser } from "@/lib/models";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
function Nav() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, isCheckingAuth, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    await logout()
    setIsLoggingOut(false)
    setIsOpen(false)
  }
  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };



  interface Link {
    url: string;
    name: string;
    id: number;
  }
  const links: Link[] = [
    user?{ url: "/userProfile/dashboard", id: 1, name: "Home" }:
    { url: "/", id: 1, name: "Home" }
    ,
    { url: "/courses", id: 2, name: "Courses" },
    { url: "/myEnrollment", id: 3, name: "My Enrollments" },
    { url: "/about", id: 5, name: "About" },
  ];
  type UserMenuLinks = {
    name: string;
    id: number;
    logo?: JSX.Element;
    url?: string;
  };
  const userMenuLinks: UserMenuLinks[] = [
    {
      name: "profile",
      id: 1,
      logo: <User className="h-4 w-4" />,
      url: "/userProfile/dashboard",
    },
    {
      name: user ? user.email : "",
      id: 2,
      url: "/profileSetting",
      logo: <Mail className="h-4 w-4" />,
    },
    {
      name: user ? user.userName : "",
      id: 3,
      url: "/profileSetting",
      logo: <Settings className="h-4 w-4" />,
    },
    {
      name: "Enrollments",
      id: 4,
      logo: <Album className="h-4 w-4" />,
      url: "/myEnrollment",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* logo */}
        
          {!isCheckingAuth && user ? <div className="flex items-center gap-1">
            <SidebarTrigger>
              <PanelLeftIcon />
            </SidebarTrigger>
            <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <GraduationCap className="h-6 w-6 text-foreground" />
            <span className="ml-2 text-lg font-bold text-foreground tracking-tight">
              A.C0der
            </span>
          </Link>
          </div>

          :
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <GraduationCap className="h-6 w-6 text-foreground" />
            <span className="ml-2 text-lg font-bold text-foreground tracking-tight">
              A.C0der
            </span>
          </Link>
          
        }

          
        {/* desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((el: Link) => (
            <li key={el.id}>
              <Link
                href={el.url}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {el.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* icons && DropdownMenu */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          <div className="text-muted-foreground hover:text-foreground transition-colors">
            {isCheckingAuth ? (
              // Loading State
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
            ) : user ? (
              // Logged In State
              <div className='flex items-center gap-2'>
                <Link href={"/userProfile/dashboard"}>
                  <ChartNoAxesCombinedIcon />
                </Link>
                <DropdownMenu>



                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={
                          user.avatarUrl?.[0] || "https://github.com/shadcn.png"
                        }
                        alt={user.userName}
                      />
                      <AvatarFallback>
                        {user.userName?.charAt(0).toUpperCase() || "CN"}
                      </AvatarFallback>
                      <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>

                      {userMenuLinks.map((el: UserMenuLinks) => (
                        <DropdownMenuItem key={el.id}>
                          {el.url && <Link
                            className="flex items-center gap-2"
                            href={el.url}
                          >
                            {el.name} {el.logo || ""}
                          </Link>}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />

                      {user.role === "ADMIN" && (
                        <DropdownMenuItem>
                          <Link
                            className="flex items-center gap-2"
                            href={"/AdminDashboard"}
                          >
                            Dashboard <User className="h-4 w-4" />
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="cursor-pointer"
                      >
                         {isLoggingOut ? "Logging out..." : "Logout"}
                         <LogOut className="h-4 w-4 ml-auto" />
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // Guest State
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <User className="h-6 w-6 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link href={"/login"} className="w-full">
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={"/register"} className="w-full">
                        register
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all rounded-full"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6 animate-in spin-in-90 duration-300" /> : <Menu className="h-6 w-6 animate-in fade-in duration-300" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Container */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-border bg-background shadow-xl ${
          isOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col p-4 space-y-4">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.url}
                  className="flex items-center p-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/20 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <DropdownMenuSeparator className="md:hidden" />
          
          {!user && (
            <div className="grid grid-cols-2 gap-3 px-2">
              <Button asChild variant="outline" className="w-full rounded-xl" onClick={() => setIsOpen(false)}>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="w-full rounded-xl" onClick={() => setIsOpen(false)}>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          {user && (
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account</p>
              {userMenuLinks.map((el) => (
                <Link
                  key={el.id}
                  href={el.url || "#"}
                  className="flex items-center gap-3 p-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/20 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="p-2 bg-secondary/50 rounded-lg">{el.logo}</span>
                  {el.name}
                </Link>
              ))}
              {user.role === "ADMIN" && (
                <Link
                  href="/AdminDashboard"
                  className="flex items-center gap-3 p-3 rounded-xl text-base font-medium text-primary hover:bg-primary/5 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="p-2 bg-primary/10 rounded-lg"><User className="h-4 w-4" /></span>
                  Admin Dashboard
                </Link>
              )}
              <Button 
                variant="destructive" 
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl py-6"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
