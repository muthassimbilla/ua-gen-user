import { Loader2, Sparkles } from "lucide-react"

export default function LoadingSpinner() {
  return (
    <div className="auth-container flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Spinner Container */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
          
          {/* Inner Ring */}
          <div className="absolute inset-2 w-12 h-12 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin border-t-purple-600 dark:border-t-purple-400" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>
          
          {/* Sparkle Effects */}
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Sparkles className="w-3 h-3 text-pink-500 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>
        
        {/* Loading Text with Animation */}
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Loading...</p>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
