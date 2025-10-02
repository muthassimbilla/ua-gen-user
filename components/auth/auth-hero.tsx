"use client"

interface AuthHeroProps {
  variant: "login" | "signup"
}

export default function AuthHero({ variant }: AuthHeroProps) {
  const isLogin = variant === "login"

  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">{isLogin ? "Welcome back" : "Create account"}</h1>
      <p className="text-muted-foreground text-sm">
        {isLogin ? "Sign in to continue" : "Get started with your account"}
      </p>
    </div>
  )
}
