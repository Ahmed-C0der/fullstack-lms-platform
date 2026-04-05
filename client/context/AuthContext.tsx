"use client";

import { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { IUser, AuthData } from "@/lib/models";

const AuthContext = createContext<AuthData>({
    user: null,
    isCheckingAuth: true,
    setUser(user) {
        
    },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    // user
    const [user, setUser] = useState<IUser | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
    const getUser = async (): Promise<void> => {
        // fisrt defin url
        try {
            const url = process.env.BACKEND_SERVER || "http://localhost:5000";
            const response: Response = await fetch(`${url}/api/auth/me`, {
                credentials: "include",
            });

            // check if res is ok before setUser
            if (!response.ok) {
                throw new Error("Failed to authenticate");
            }
            const data = response.json();
            setUser(await data);
        } catch (error) {
            if (error instanceof Error) {
                // Now TypeScript knows 'error' has a '.message' property
                console.log("Auth check failed:", error.message);
            } else {
                console.log("An unexpected error occurred:", error);
            }
            setUser(null);
        } finally {
            setIsCheckingAuth(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);
    const data: AuthData = {
        user,
        isCheckingAuth,
        // setUser:(user:IUser|null)=>{setUser(user)}
        setUser
    };
    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthData => useContext(AuthContext);
