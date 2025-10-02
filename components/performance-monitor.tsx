"use client"

import { useEffect, useState } from 'react'
import { performanceMonitor, useMemoryUsage, checkPerformanceBudget } from '@/lib/performance-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  Clock, 
  HardDrive, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw
} from 'lucide-react'

interface PerformanceMetrics {
  TTFB: number
  FCP: number
  LCP: number
  FID: number
  CLS: number
  DOMContentLoaded: number
  LoadComplete: number
  ResourceLoadTime: number
}

interface PerformanceData {
  metrics: PerformanceMetrics
  budgets: Record<string, number>
  violations: Array<[string, number]>
  score: number
}

export function PerformanceMonitor() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [memoryInfo, setMemoryInfo] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMonitoring, setIsMonitoring] = useState(false)

  const memoryUsage = useMemoryUsage()

  useEffect(() => {
    if (memoryUsage) {
      setMemoryInfo(memoryUsage)
    }
  }, [memoryUsage])

  const checkPerformance = () => {
    const data = checkPerformanceBudget()
    if (data) {
      setPerformanceData(data)
    }
  }

  const startMonitoring = () => {
    setIsMonitoring(true)
    performanceMonitor.mark('monitoring-start')
    
    // Check performance every 5 seconds
    const interval = setInterval(() => {
      checkPerformance()
    }, 5000)

    return () => {
      clearInterval(interval)
      setIsMonitoring(false)
    }
  }

  const stopMonitoring = () => {
    setIsMonitoring(false)
    performanceMonitor.mark('monitoring-end')
    performanceMonitor.measure('monitoring-duration', 'monitoring-start', 'monitoring-end')
  }

  const clearMetrics = () => {
    performanceMonitor.clearMetrics()
    setPerformanceData(null)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Activity className="w-4 h-4 mr-2" />
          Performance
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-y-auto">
      <Card className="bg-white dark:bg-gray-800 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Performance Monitor
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={isMonitoring ? stopMonitoring : startMonitoring}
                size="sm"
                variant={isMonitoring ? "destructive" : "default"}
              >
                {isMonitoring ? "Stop" : "Start"}
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                size="sm"
                variant="outline"
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Performance Score */}
          {performanceData && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Performance Score</span>
                <Badge className={getScoreBadge(performanceData.score)}>
                  {performanceData.score}/100
                </Badge>
              </div>
              <Progress 
                value={performanceData.score} 
                className="h-2"
              />
            </div>
          )}

          {/* Core Web Vitals */}
          {performanceData && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Core Web Vitals
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>TTFB:</span>
                  <span className={performanceData.metrics.TTFB > 600 ? 'text-red-600' : 'text-green-600'}>
                    {formatTime(performanceData.metrics.TTFB)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>FCP:</span>
                  <span className={performanceData.metrics.FCP > 1800 ? 'text-red-600' : 'text-green-600'}>
                    {formatTime(performanceData.metrics.FCP)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>LCP:</span>
                  <span className={performanceData.metrics.LCP > 2500 ? 'text-red-600' : 'text-green-600'}>
                    {formatTime(performanceData.metrics.LCP)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>CLS:</span>
                  <span className={performanceData.metrics.CLS > 0.1 ? 'text-red-600' : 'text-green-600'}>
                    {performanceData.metrics.CLS.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Memory Usage */}
          {memoryInfo && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Memory Usage
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Used:</span>
                  <span>{formatBytes(memoryInfo.usedJSHeapSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>{formatBytes(memoryInfo.totalJSHeapSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Limit:</span>
                  <span>{formatBytes(memoryInfo.jsHeapSizeLimit)}</span>
                </div>
                <Progress 
                  value={(memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100} 
                  className="h-1"
                />
              </div>
            </div>
          )}

          {/* Violations */}
          {performanceData && performanceData.violations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Violations
              </h4>
              <div className="space-y-1">
                {performanceData.violations.map(([metric, value]) => (
                  <div key={metric} className="text-xs text-red-600">
                    {metric}: {formatTime(value)} (exceeds budget)
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              onClick={checkPerformance}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Check Now
            </Button>
            <Button
              onClick={clearMetrics}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Performance overlay for development
export function PerformanceOverlay() {
  const [isVisible, setIsVisible] = useState(false)
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const checkMetrics = () => {
        const data = checkPerformanceBudget()
        if (data) {
          setMetrics(data)
        }
      }

      checkMetrics()
      const interval = setInterval(checkMetrics, 10000)

      return () => clearInterval(interval)
    }
  }, [])

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-3 py-1 rounded text-xs"
      >
        Perf
      </button>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-black bg-opacity-80 text-white p-4 rounded text-xs max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold">Performance</span>
        <button onClick={() => setIsVisible(false)}>×</button>
      </div>
      {metrics && (
        <div className="space-y-1">
          <div>Score: {metrics.score}/100</div>
          <div>TTFB: {metrics.metrics.TTFB.toFixed(0)}ms</div>
          <div>FCP: {metrics.metrics.FCP.toFixed(0)}ms</div>
          <div>LCP: {metrics.metrics.LCP.toFixed(0)}ms</div>
          <div>CLS: {metrics.metrics.CLS.toFixed(3)}</div>
        </div>
      )}
    </div>
  )
}
