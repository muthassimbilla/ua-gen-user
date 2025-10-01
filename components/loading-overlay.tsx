import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  message?: string
  fullScreen?: boolean
}

export default function LoadingOverlay({ message = "Loading...", fullScreen = false }: LoadingOverlayProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-slate-50/95 to-slate-100/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
          </div>
          <p className="text-base font-medium text-slate-700 dark:text-slate-300">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg">
      <div className="flex flex-col items-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{message}</p>
      </div>
    </div>
  )
}
