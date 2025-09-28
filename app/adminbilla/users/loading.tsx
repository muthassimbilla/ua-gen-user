import { Card, CardContent } from "@/components/ui/card"
import { Users, Sparkles } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="relative mb-6">
            {/* Outer Ring */}
            <div className="w-16 h-16 border-4 border-red-200 dark:border-red-800 rounded-full animate-spin border-t-red-600 dark:border-t-red-400 mx-auto"></div>
            
            {/* Inner Ring */}
            <div className="absolute inset-2 w-12 h-12 border-4 border-orange-200 dark:border-orange-800 rounded-full animate-spin border-t-orange-600 dark:border-t-orange-400 mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className="w-6 h-6 text-red-600 dark:text-red-400 animate-pulse" />
            </div>
            
            {/* Sparkle Effects */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <Sparkles className="w-3 h-3 text-pink-500 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Loading Users</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">Fetching user data...</p>
          
          {/* Animated Dots */}
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
