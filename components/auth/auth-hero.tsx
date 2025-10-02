"use client"

import { Sparkles, UserPlus } from "lucide-react"

interface AuthHeroProps {
  variant: "login" | "signup"
}

export default function AuthHero({ variant }: AuthHeroProps) {
  const isLogin = variant === "login"

  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-4 shadow-lg">
        {isLogin ? <Sparkles className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
      </div>

      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
        {isLogin ? "Welcome back" : "Create account"}
      </h1>

      <p className="text-muted-foreground text-sm">
        {isLogin ? "Sign in to continue to your dashboard" : "Get started with your new account"}
      </p>
    </div>
  )
}
