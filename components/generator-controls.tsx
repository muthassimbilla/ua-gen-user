"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Settings, Loader2, Zap } from "lucide-react"

const GeneratorControls: React.FC = () => {
  const [platform, setPlatform] = useState("")
  const [appType, setAppType] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)

  const onGenerate = () => {
    setIsGenerating(true)
    // Generate user agents logic here
    setIsGenerating(false)
  }

  return (
    <Card className="bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Settings className="w-5 h-5" />
          Generator Settings
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Configure your user agent generation preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="platform" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Platform
            </label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="bg-white/30 dark:bg-slate-700/30 backdrop-blur-md border-white/50 dark:border-slate-600/50">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-white/50 dark:border-slate-700/50">
                <SelectItem value="ios">iOS</SelectItem>
                <SelectItem value="android">Android</SelectItem>
                <SelectItem value="pixel">Google Pixel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="appType" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              App Type
            </label>
            <Select value={appType} onValueChange={setAppType}>
              <SelectTrigger className="bg-white/30 dark:bg-slate-700/30 backdrop-blur-md border-white/50 dark:border-slate-600/50">
                <SelectValue placeholder="Select app" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-white/50 dark:border-slate-700/50">
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Quantity
            </label>
            <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number(value))}>
              <SelectTrigger className="bg-white/30 dark:bg-slate-700/30 backdrop-blur-md border-white/50 dark:border-slate-600/50">
                <SelectValue placeholder="Select quantity" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-white/50 dark:border-slate-700/50">
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            size="lg"
            className="bg-gradient-to-r from-indigo-500/80 to-purple-600/80 backdrop-blur-md hover:from-indigo-600/80 hover:to-purple-700/80 text-white border-0 shadow-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Generate User Agents
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default GeneratorControls
