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
  GraduationCap
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
function Nav() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, isCheckingAuth } = useAuth();

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };
  console.log(user);
  console.log(isCheckingAuth);

  interface Link {
    url: string;
    name: string;
    id: number;
  }
  const links: Link[] = [
    { url: "#", id: 1, name: "Home" },
    { url: "#", id: 2, name: "Courses" },
    { url: "#", id: 3, name: "programs" },
    { url: "#", id: 4, name: "pricing" },
    { url: "#", id: 5, name: "About" },
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
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <GraduationCap className="h-6 w-6 text-foreground" />
          <span className="ml-2 text-lg font-bold text-foreground tracking-tight">
            A.C0der
          </span>
        </Link>

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
              <>  
               <Link href={"/dashboard"}>
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
                        {el.url&&<Link
                          className="flex items-center gap-2"
                          href={"/profile"}
                        >
                          {el.name} {el.logo||""}
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
                      onClick={() => (window.location.href = "/auth")}
                    >
                      {/* Using simple redirect or could use auth context logout function if exposed here, but Link to /auth where logout happens or simple text is fine. 
                             Better: Use Context Logout if available. I will assume it's just a link for now or add onClick logic if I could.
                            
                          */}
                      <Link
                        className="flex items-center gap-2 w-full"
                        href={"/auth"}
                      >
                        Logout <LogOut className="h-4 w-4" />
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              </>
            ) : (
              // Guest State
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <User className="h-6 w-6 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link href={"/auth?status=loign"} className="w-full">
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={"/auth?status=register"} className="w-full">
                        register
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {/* <button className="text-muted-foreground hover:text-foreground transition-colors relative">
            <Link href={"/shoppingPage"}>
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary"></span>
            </Link>
          </button> */}
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
            <li>
              <Link
                href={"/"}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href={"/products"}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href={"/about"}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href={"/lab"}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                The Lab
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Nav;
