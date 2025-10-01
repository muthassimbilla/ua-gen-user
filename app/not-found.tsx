"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* 404 Number with animation */}
        <div className="relative mb-8">
          <div className="text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
            404
          </div>
          <div className="absolute inset-0 text-9xl lg:text-[12rem] font-black text-blue-600/20 dark:text-blue-400/20 blur-sm animate-pulse">
            404
          </div>
        </div>

        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 flex items-center justify-center border-4 border-red-500/30 dark:border-red-400/30">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Oops! Page Not Found
        </h1>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          The page you're looking for seems to have vanished into the digital void. 
          Don't worry, even the best explorers sometimes take a wrong turn!
        </p>

         {/* Action Buttons */}
         <div className="flex justify-center items-center mb-12">
           <Button
             onClick={handleGoBack}
             variant="outline"
             size="lg"
             className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
           >
             <ArrowLeft className="w-5 h-5 mr-2" />
             Go Back
           </Button>
         </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
            Quick Links
          </h3>
           <div className="flex flex-wrap justify-center gap-3">
             <Link
               href="/login"
               className="px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 hover:scale-105 text-sm font-medium"
             >
               <Search className="w-4 h-4 mr-2 inline" />
               Login
             </Link>
             <Link
               href="/signup"
               className="px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 hover:scale-105 text-sm font-medium"
             >
               <RefreshCw className="w-4 h-4 mr-2 inline" />
               Sign Up
             </Link>
           </div>
        </div>

        {/* Fun Message */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl border border-blue-200/50 dark:border-slate-600/50 backdrop-blur-sm">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            💡 <strong>Pro Tip:</strong> If you keep getting lost, try using the navigation menu or search function!
          </p>
        </div>
      </div>
    </div>
  )
}
