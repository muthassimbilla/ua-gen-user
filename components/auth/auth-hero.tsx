"use client"

import React from "react"
import { Shield, Sparkles, UserPlus, Zap } from "lucide-react"

interface AuthHeroProps {
  variant: "login" | "signup"
}

export default function AuthHero({ variant }: AuthHeroProps) {
  const isLogin = variant === "login"
  
  return (
    <>
      {/* Mobile header - only visible on small screens */}
      <div className="lg:hidden text-center mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl relative overflow-hidden mx-auto mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          <img
            src="/logo.jpg"
            alt="UGen Pro Logo"
            className="w-full h-full object-cover rounded-2xl relative z-10"
          />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {isLogin ? "Welcome Back" : "Join Our Community"}
        </h1>
        <p className="text-muted-foreground">
          {isLogin 
            ? "Sign in to your account to continue" 
            : "Create your account and unlock access to powerful tools"
          }
        </p>
      </div>

      {/* Desktop hero - only visible on large screens */}
      <div className="hidden lg:block space-y-10">
        <div className="space-y-6">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <img
              src="/logo.jpg"
              alt="UGen Pro Logo"
              className="w-full h-full object-cover rounded-3xl relative z-10"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              {isLogin ? "Welcome Back" : "Join Our Community"}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
              {isLogin 
                ? "Sign in to your account to continue your journey with our powerful tools and services."
                : "Create your account and unlock access to powerful tools and exclusive features."
              }
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 group">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-muted-foreground text-lg">
              {isLogin ? "Fast and secure authentication" : "Quick and easy registration"}
            </span>
          </div>
          <div className="flex items-center space-x-4 group">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-muted-foreground text-lg">
              {isLogin ? "Your data is always protected" : "Secure account protection"}
            </span>
          </div>
          <div className="flex items-center space-x-4 group">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              {isLogin ? (
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              ) : (
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              )}
            </div>
            <span className="text-muted-foreground text-lg">
              {isLogin ? "Modern and intuitive interface" : "Instant access to all features"}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
