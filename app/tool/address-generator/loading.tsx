import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Loader2, Sparkles } from "lucide-react";

export default function AddressGeneratorLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-h-[600px]">
          {/* Left Side - Input Section Skeleton */}
          <div className="space-y-6">
            {/* Tabs Skeleton */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Input Card Skeleton */}
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-4 w-80" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Output Section Skeleton */}
          <div className="space-y-6">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center">
                {/* Animated Loading Spinner */}
                <div className="relative mb-6">
                  {/* Outer Ring */}
                  <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
                  
                  {/* Inner Ring */}
                  <div className="absolute inset-2 w-16 h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin border-t-purple-600 dark:border-t-purple-400" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  
                  {/* Center Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
                  </div>
                  
                  {/* Sparkle Effects */}
                  <div className="absolute -top-3 -right-3">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <div className="absolute -bottom-3 -left-3">
                    <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" style={{ animationDelay: '1s' }} />
                  </div>
                </div>
                
                {/* Loading Text */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Loading Address Generator
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    Preparing the tools for you...
                  </p>
                  
                  {/* Animated Dots */}
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}