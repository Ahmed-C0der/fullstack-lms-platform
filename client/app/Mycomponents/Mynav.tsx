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
  PanelLeftIcon
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
      url: "/profile",
    },
    {
      name: user ? user.email : "",
      id: 2,
    },
    {
      name: user ? user.userName : "",
      id: 3,
    },
    {
      name: "Enrollments",
      id: 4,
      logo: <Album className="h-4 w-4" />,
      url: "/shoppingPage",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
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
                            href={"/profile"}
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
                            href={"/dashboard"}
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
          <button
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <ul className="flex flex-col p-4 space-y-4">
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.url}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Nav;
