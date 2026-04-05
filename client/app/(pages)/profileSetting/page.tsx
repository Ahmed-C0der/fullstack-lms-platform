"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User2, Mail, Shield, Camera } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import React from "react";

export default function ProfileSettingsPage() {
  const { user, isCheckingAuth } = useAuth();
  
  const [isEditing, setIsEditing] = React.useState(false);

  if (isCheckingAuth) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="text-center text-muted-foreground">
          You must be logged in to view your profile settings.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500 pb-20">
      
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Account Settings
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Manage your personal information, role details, and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 w-full h-32 bg-indigo-600/10 dark:bg-indigo-400/10" />
            
            <div className="relative group mt-6">
              <div className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-900 overflow-hidden shadow-lg flex items-center justify-center z-10 relative">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.userName} className="w-full h-full object-cover" />
                ) : (
                  <User2 className="h-12 w-12 text-slate-400" />
                )}
              </div>
              <button className="absolute inset-0 z-20 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="text-white size-8" />
              </button>
            </div>

            <div className="text-center mt-5 z-10 relative">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user.userName}</h2>
              <div className="flex items-center justify-center gap-1.5 mt-1.5 text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full w-max mx-auto">
                <Shield className="size-3.5" />
                {user.role}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Setting Forms */}
        <div className="md:col-span-8 space-y-6">
          
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center">
              <h3 className="text-lg font-bold">Personal Information</h3>
              <Button 
                 variant={isEditing ? "default" : "outline"}
                 onClick={() => setIsEditing(!isEditing)}
                 className="rounded-full px-6"
              >
                {isEditing ? "Save Changes" : "Edit Details"}
              </Button>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="grid gap-3">
                <Label htmlFor="username" className="text-slate-500 flex items-center gap-2">
                  <User2 className="size-4" /> Full Name
                </Label>
                <Input 
                  id="username" 
                  defaultValue={user.userName} 
                  disabled={!isEditing} 
                  className="bg-slate-50 dark:bg-slate-900/50 h-12 rounded-xl border-slate-200" 
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email" className="text-slate-500 flex items-center gap-2">
                  <Mail className="size-4" /> Email Address
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue={user.email} 
                  disabled={true} 
                  className="bg-slate-50 opacity-70 cursor-not-allowed dark:bg-slate-900/50 h-12 rounded-xl border-slate-200" 
                />
                <p className="text-[11px] text-muted-foreground mt-1 px-1">Email addresses cannot be changed directly. Contact support if you need to migrate this account.</p>
              </div>

            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm p-6 md:p-8">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Danger Zone</h3>
                  <p className="text-sm text-slate-500 mt-1">Permanently delete your account and all associated LMS data.</p>
                </div>
                <Button variant="destructive" className="rounded-xl px-6 h-11 whitespace-nowrap">
                  Delete Account
                </Button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
