export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Spinner Container */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>

          {/* Inner Ring */}
          <div
            className="absolute inset-2 w-16 h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin border-t-purple-600 dark:border-t-purple-400"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>

          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">Loading Login</h2>
          <p className="text-slate-500 dark:text-slate-400">Preparing your login experience...</p>
        </div>
      </div>
    </div>
  )
}
