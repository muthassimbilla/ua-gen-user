"use client"

import { useCallback } from "react"

import { useState, useEffect, memo, startTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Smartphone,
  Copy,
  Download,
  Loader2,
  Settings,
  LogIn,
  UserPlus,
  LogOut,
  Shield,
  Clock,
  Check,
} from "lucide-react"
import dynamic from "next/dynamic"
import type { GenerationHistory } from "@/lib/supabase" // Declared the variable here
import { useRouter } from "next/navigation" // Added useRouter import for logout redirect
import Link from "next/link" // Import Link for navigation

import GeneratorControls from "@/components/GeneratorControls"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccountPending } from "@/components/auth/account-pending" // Import the new Account Pending component

const CustomModal = dynamic(() => import("@/components/CustomModal"), {
  loading: () => null,
  ssr: false,
})

const ProgressModal = dynamic(() => import("@/components/ProgressModal"), {
  loading: () => null,
  ssr: false,
})

const LoadingSkeleton = memo(() => (
  <Card className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-2xl rounded-2xl">
    <CardContent className="p-8 text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-xl"></div>
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4 relative z-10" />
      </div>
      <p className="text-slate-600 dark:text-slate-300 font-medium">Loading data...</p>
    </CardContent>
  </Card>
))

LoadingSkeleton.displayName = "LoadingSkeleton"

let supabaseModulesCache = null
const loadSupabaseModules = async () => {
  if (supabaseModulesCache) return supabaseModulesCache

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("[v0] Supabase environment variables not available, using mock data")
      return null
    }

    const module = await import("@/lib/supabase")
    supabaseModulesCache = {
      DeviceModel: module.DeviceModel,
      IOSVersion: module.IOSVersion,
      AppVersion: module.AppVersion,
      Configuration: module.Configuration,
      GenerationHistory: module.GenerationHistory,
      BlacklistedUserAgent: module.BlacklistedUserAgent,
      AndroidDeviceModel: module.AndroidDeviceModel,
      AndroidBuildNumber: module.AndroidBuildNumber,
      AndroidAppVersion: module.AndroidAppVersion,
      InstagramDeviceModel: module.InstagramDeviceModel,
      InstagramVersion: module.InstagramVersion,
      ChromeVersion: module.ChromeVersion,
      ResolutionDpi: module.ResolutionDpi,
      PixelFacebookDeviceModel: module.PixelFacebookDeviceModel,
      PixelFacebookBuildNumber: module.PixelFacebookBuildNumber,
      PixelFacebookAppVersion: module.PixelFacebookAppVersion,
      PixelInstagramDeviceModel: module.PixelInstagramDeviceModel,
      PixelInstagramVersion: module.InstagramVersion,
      PixelInstagramChromeVersion: module.ChromeVersion,
      PixelInstagramResolutionDpi: module.ResolutionDpi,
      SamsungInstagramBuildNumber: module.InstagramBuildNumber,
      UserAgentHistory: module.GenerationHistory, // Using GenerationHistory as UserAgentHistory
      FacebookBuildNumber: module.FacebookBuildNumber, // Added for Samsung Facebook
      InstagramBuildNumber: module.InstagramBuildNumber, // Added for Samsung Instagram
    }
    return supabaseModulesCache
  } catch (error) {
    console.error("Error loading Supabase modules:", error)
    return null
  }
}

const AppHeader = memo(() => (
  <div className="text-center space-y-4 mb-8">
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
        <Smartphone className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        User Agent Generator
      </h1>
    </div>
    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
      Generate unique, realistic user agents for iOS, Android, Instagram, and Facebook applications
    </p>
  </div>
))

AppHeader.displayName = "AppHeader"

const NavigationHeader = () => {
  const { user, loading, isAuthenticated, profile, isAdmin, isPending, isApproved, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    console.log("[v0] Starting logout process...")
    await signOut()
    console.log("[v0] Logout completed, redirecting to auth...")
    router.push("/auth")
  }

  if (loading) {
    return (
      <div className="absolute top-4 right-4 z-10">
        <div className="flex gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white"
            disabled
          >
            <Loader2 className="w-4 h-4 animate-spin" />
          </Button>
        </div>
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-white/90 text-sm font-medium">{profile?.full_name || user.email}</span>
              {isAdmin && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/20 backdrop-blur-md text-yellow-100 border-yellow-400/30"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isPending && (
                <Badge
                  variant="secondary"
                  className="bg-orange-500/20 backdrop-blur-md text-orange-100 border-orange-400/30"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  অনুমোদনের অপেক্ষায়
                </Badge>
              )}
              {isApproved && (
                <Badge
                  variant="secondary"
                  className="bg-green-500/20 backdrop-blur-md text-green-100 border-green-400/30"
                >
                  ✓ অনুমোদিত
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <ThemeToggle />
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                onClick={() => (window.location.href = "/admin")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              লগআউট
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="flex gap-2">
        <ThemeToggle />
        <Button
          variant="outline"
          size="sm"
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
          onClick={() => (window.location.href = "/auth")}
        >
          <LogIn className="w-4 h-4 mr-2" />
          লগইন
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
          onClick={() => (window.location.href = "/auth")}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          সাইন আপ
        </Button>
      </div>
    </div>
  )
}

// Placeholder for GeneratedAgentsHistory and UserAgentGenerator components
const UserAgentGenerator = memo(() => {
  // This component will be replaced by the actual implementation in the merged code
  return <div className="text-center text-gray-500">User Agent Generator Component</div>
})
UserAgentGenerator.displayName = "UserAgentGenerator"

const GeneratedAgentsHistory = memo(() => {
  // This component will be replaced by the actual implementation in the merged code
  return <div className="text-center text-gray-500">Generated Agents History Component</div>
})
GeneratedAgentsHistory.displayName = "GeneratedAgentsHistory"

export default function Home() {
  const {
    user,
    profile,
    signOut,
    loading,
    isAuthenticated,
    canUseGenerator,
    needsApproval,
    isAdmin,
    isRejected,
    isSuspended,
  } = useAuth()
  const router = useRouter()
  const [platform, setPlatform] = useState("")
  const [appType, setAppType] = useState("")
  // Changed default quantity to 1
  const [quantity, setQuantity] = useState(1)
  // Added type annotation for userAgents
  const [userAgents, setUserAgents] = useState<string[]>([])
  const [currentHistoryId, setCurrentHistoryId] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  // Added type annotation for history
  const [history, setHistory] = useState<GenerationHistory[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [activeTab, setActiveTab] = useState<"generator" | "history">("generator")
  const [connectionError, setConnectionError] = useState(null)
  const [accessKey, setAccessKey] = useState(null) // Added accessKey state

  const [supabaseModules, setSupabaseModules] = useState(null)

  const [isDataLoaded, setIsDataLoaded] = useState(false)

  // Modal states
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: () => {},
    showCancel: false,
  })

  // Progress Modal state
  const [progressModal, setProgressModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    progress: 0,
    type: "info",
    showCancel: false,
  })

  const [dataState, setDataState] = useState({
    deviceModels: [],
    iosVersions: [],
    appVersions: [],
    configurations: {},
    blacklistedUAs: new Set(),
    androidDeviceModels: [],
    androidBuildNumbers: [],
    androidAppVersions: [],
    instagramDeviceModels: [],
    instagramVersions: [],
    chromeVersions: [],
    resolutionDpis: [],
  })

  const [allCopied, setAllCopied] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const [pixelFacebookDeviceModels, setPixelFacebookDeviceModels] = useState([])
  const [pixelFacebookBuildNumbers, setPixelFacebookBuildNumbers] = useState([])
  const [pixelFacebookAppVersions, setPixelFacebookAppVersions] = useState([])
  const [pixelInstagramDeviceModels, setPixelInstagramDeviceModels] = useState([])
  const [pixelInstagramVersions, setPixelInstagramVersions] = useState([])
  const [pixelInstagramChromeVersions, setPixelInstagramChromeVersions] = useState([])
  const [pixelInstagramResolutionDpis, setPixelInstagramResolutionDpis] = useState([])

  // Added deviceType state for Samsung Facebook generation
  const [deviceType, setDeviceType] = useState("")

  const {
    deviceModels,
    iosVersions,
    appVersions,
    configurations,
    blacklistedUAs,
    androidDeviceModels,
    androidBuildNumbers,
    androidAppVersions,
    instagramDeviceModels,
    instagramVersions,
    chromeVersions,
    resolutionDpis,
  } = dataState

  // Moved useEffect to the top to fix lint/correctness/useHookAtTopLevel
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth")
    }
  }, [loading, user, router])

  // The rest of the component logic follows
  useEffect(() => {
    let mounted = true

    const initializeSupabase = async () => {
      try {
        if (
          typeof window !== "undefined" &&
          (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        ) {
          console.warn("[v0] Supabase environment variables not available")
          setConnectionError("Supabase configuration not available")
          return
        }

        const modules = await loadSupabaseModules()
        if (mounted) {
          setSupabaseModules(modules)
          setConnectionError(null)
        }
      } catch (error) {
        if (mounted) {
          setConnectionError(error.message)
          console.error("Failed to initialize Supabase:", error)
        }
      }
    }

    startTransition(() => {
      initializeSupabase()
    })

    return () => {
      mounted = false
    }
  }, [])

  const showModal = useCallback((title, message, type = "info", onConfirm = () => {}, showCancel = false) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      showCancel,
    })
  }, [])

  const showProgressModal = useCallback((title, message, progress = 0, type = "info", showCancel = false) => {
    setProgressModal({
      isOpen: true,
      title,
      message,
      progress,
      type,
      showCancel,
    })
  }, [])

  const hideProgressModal = useCallback(() => {
    setProgressModal((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const loadData = useCallback(async () => {
    if (!supabaseModules || isDataLoaded) return

    try {
      setConnectionError(null)
      console.log("[v0] Starting data loading...")

      const {
        DeviceModel,
        IOSVersion,
        AppVersion,
        Configuration,
        BlacklistedUserAgent,
        AndroidDeviceModel,
        AndroidBuildNumber,
        AndroidAppVersion,
        InstagramDeviceModel,
        InstagramVersion,
        ChromeVersion,
        ResolutionDpi,
        PixelFacebookDeviceModel,
        PixelFacebookBuildNumber,
        PixelFacebookAppVersion,
        PixelInstagramDeviceModel,
        PixelInstagramVersion,
        PixelInstagramChromeVersion,
        PixelInstagramResolutionDpi,
      } = supabaseModules

      const loadBatch1 = Promise.all([
        DeviceModel?.list() || Promise.resolve([]),
        IOSVersion?.list() || Promise.resolve([]),
        AppVersion?.list() || Promise.resolve([]),
        Configuration?.list() || Promise.resolve([]),
      ])

      const loadBatch2 = Promise.all([
        BlacklistedUserAgent?.list() || Promise.resolve([]),
        AndroidDeviceModel?.list() || Promise.resolve([]),
        AndroidBuildNumber?.list() || Promise.resolve([]),
        AndroidAppVersion?.list() || Promise.resolve([]),
      ])

      const loadBatch3 = Promise.all([
        InstagramDeviceModel?.list() || Promise.resolve([]),
        InstagramVersion?.list() || Promise.resolve([]),
        ChromeVersion?.list() || Promise.resolve([]),
        ResolutionDpi?.list() || Promise.resolve([]),
      ])

      const loadBatch4 = Promise.all([
        PixelFacebookDeviceModel?.list() || Promise.resolve([]),
        PixelFacebookBuildNumber?.list() || Promise.resolve([]),
        PixelFacebookAppVersion?.list() || Promise.resolve([]),
        PixelInstagramDeviceModel?.list() || Promise.resolve([]),
        PixelInstagramVersion?.list() || Promise.resolve([]),
        PixelInstagramChromeVersion?.list() || Promise.resolve([]),
        PixelInstagramResolutionDpi?.list() || Promise.resolve([]),
      ])

      const [batch1, batch2, batch3, batch4] = await Promise.all([loadBatch1, loadBatch2, loadBatch3, loadBatch4])

      const [devices, ios, apps, configs] = batch1
      const [blacklisted, androidDevices, androidBuilds, androidApps] = batch2
      const [instaDevices, instaVersions, chromeVersions, resolutionDpis] = batch3
      const [
        pixelFbDevices,
        pixelFbBuilds,
        pixelFbApps,
        pixelInstaDevices,
        pixelInstaVersions,
        pixelInstaChromes,
        pixelInstaResolutions,
      ] = batch4

      console.log("[v0] Pixel Facebook devices loaded:", pixelFbDevices?.length || 0)
      console.log("[v0] Pixel Facebook builds loaded:", pixelFbBuilds?.length || 0)
      console.log("[v0] Pixel Facebook apps loaded:", pixelFbApps?.length || 0)
      console.log("[v0] Pixel Instagram devices loaded:", pixelInstaDevices?.length || 0)
      console.log("[v0] Pixel Instagram versions loaded:", pixelInstaVersions?.length || 0)
      console.log("[v0] Pixel Instagram chrome versions loaded:", pixelInstaChromes?.length || 0)
      console.log("[v0] Pixel Instagram resolutions loaded:", pixelInstaResolutions?.length || 0)
      console.log("[v0] Samsung Instagram devices loaded:", instaDevices?.length || 0)
      console.log("[v0] Samsung Instagram versions loaded:", instaVersions?.length || 0)
      console.log("[v0] Samsung Chrome versions loaded:", chromeVersions?.length || 0)
      console.log("[v0] Samsung Resolution DPIs loaded:", resolutionDpis?.length || 0)

      startTransition(() => {
        const configsObj = {}
        configs.forEach((config) => {
          try {
            configsObj[config.config_key] = JSON.parse(config.config_value)
          } catch (e) {
            configsObj[config.config_key] = config.config_value
          }
        })

        const blacklistSet = new Set(blacklisted.map((b) => b.user_agent))

        setDataState({
          deviceModels: devices.filter((d) => d.is_active),
          iosVersions: ios.filter((v) => v.is_active),
          appVersions: apps.filter((a) => a.is_active),
          androidDeviceModels: androidDevices.filter((d) => d.is_active),
          androidBuildNumbers: androidBuilds.filter((b) => b.is_active),
          androidAppVersions: androidApps.filter((a) => a.is_active),
          instagramDeviceModels: instaDevices.filter((d) => d.is_active),
          instagramVersions: instaVersions.filter((v) => v.is_active),
          chromeVersions: chromeVersions.filter((v) => v.is_active),
          resolutionDpis: resolutionDpis.filter((r) => r.is_active),
          configurations: configsObj,
          blacklistedUAs: blacklistSet,
        })
      })

      console.log("[v0] Setting Pixel Facebook device models:", pixelFbDevices?.length || 0)
      console.log("[v0] Setting Pixel Instagram device models:", pixelInstaDevices?.length || 0)

      setPixelFacebookDeviceModels(pixelFbDevices || [])
      setPixelFacebookBuildNumbers(pixelFbBuilds || [])
      setPixelFacebookAppVersions(pixelFbApps || [])
      setPixelInstagramDeviceModels(pixelInstaDevices || [])
      setPixelInstagramVersions(pixelInstaVersions || [])
      setPixelInstagramChromeVersions(pixelInstaChromes || [])
      setPixelInstagramResolutionDpis(pixelInstaResolutions || [])

      console.log("[v0] Data loading completed successfully")
      setIsDataLoaded(true)
    } catch (error) {
      console.error("Error loading data:", error)
      setConnectionError("Failed to load data. Please check your connection and try again.")
    }
  }, [supabaseModules, isDataLoaded])

  const loadHistory = useCallback(async () => {
    if (!supabaseModules || !isDataLoaded) return

    try {
      const { UserAgentHistory } = supabaseModules
      if (!UserAgentHistory) {
        console.error("UserAgentHistory module not available")
        return
      }
      const history = await UserAgentHistory.list()
      setHistory(history.slice(0, 50))
    } catch (error) {
      console.error("Error loading history:", error)
    }
  }, [supabaseModules, isDataLoaded])

  useEffect(() => {
    if (supabaseModules && !isDataLoaded) {
      loadData()
    }
  }, [supabaseModules, isDataLoaded])

  useEffect(() => {
    if (supabaseModules && isDataLoaded) {
      loadHistory()
    }
  }, [supabaseModules, isDataLoaded])

  const handleHistoryDownload = useCallback(
    async (historyItem) => {
      if (!historyItem.user_agents || historyItem.user_agents.length === 0) {
        showModal("❌ No Data!", "No user agents found in this history.", "error")
        return
      }

      showModal(
        "📥 Download History",
        `Do you want to download ${historyItem.user_agents.length} user agents again?`,
        "info",
        async () => {
          setModal((prev) => ({ ...prev, isOpen: false }))

          try {
            const content = historyItem.user_agents.join("\n")
            const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url

            const appTypeDisplay = historyItem.app_type.replace("android_", "android-")
            const timestamp = new Date(historyItem.generated_at).toISOString().slice(0, 19).replace(/:/g, "-")
            a.download = `${appTypeDisplay}_user_agents_${timestamp}.txt`

            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            showModal(
              "✅ Download Successful!",
              `${historyItem.user_agents.length} user agents downloaded successfully.`,
              "success",
            )
          } catch (error) {
            console.error("Error downloading from history:", error)
            showModal("❌ Download Failed!", "Error occurred while downloading!", "error")
          }
        },
        true,
      )
    },
    [showModal],
  )

  const handleHistoryCopy = useCallback(
    async (historyItem) => {
      if (!historyItem.user_agents || historyItem.user_agents.length === 0) {
        showModal("❌ No Data!", "No user agents found in this history.", "error")
        return
      }

      try {
        const content = historyItem.user_agents.join("\n")
        await navigator.clipboard.writeText(content)

        showModal(
          "✅ Copy Successful!",
          `${historyItem.user_agents.length} user agents copied successfully.`,
          "success",
        )
      } catch (error) {
        console.error("Error copying from history:", error)
        showModal("❌ Copy Failed!", "Error occurred while copying!", "error")
      }
    },
    [showModal],
  )

  const parseIOSVersion = (version) => {
    return version.split(".").map(Number)
  }

  const compareVersions = (v1, v2) => {
    const version1 = parseIOSVersion(v1)
    const version2 = parseIOSVersion(v2)

    for (let i = 0; i < Math.max(version1.length, version2.length); i++) {
      const a = version1[i] || 0
      const b = version2[i] || 0
      if (a < b) return -1
      if (a > b) return 1
    }
    return 0
  }

  const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const extractModelIdentifier = (modelName) => {
    if (!modelName) return modelName
    const match = modelName.match(/^([^\s(]+)/)
    return match ? match[1] : modelName
  }

  const getApiLevel = (version) => {
    const apiLevels = {
      "7.0": "24",
      "7.1": "25",
      "8.0": "26",
      "8.1": "27",
      "9": "28",
      "10": "29",
      "11": "30",
      "12": "31",
      "13": "33",
      "14": "34",
      "15": "35",
      "16": "36",
    }
    return apiLevels[version] || "35" // Latest API level as fallback
  }

  const generateAndroidInstagramUserAgent = async (cachedBuildNumbers = null) => {
    try {
      if (!instagramDeviceModels.length || !instagramVersions.length || !chromeVersions.length) {
        console.error("Missing Instagram configuration data")
        return null
      }

      const versionPairs = {
        "7": "24/7.0",
        "7.1": "25/7.1",
        "8": "26/8.0",
        "8.1": "27/8.1",
        "9": "28/9",
        "10": "29/10",
        "11": "30/11",
        "12": "31/12",
        "13": "33/13",
        "14": "34/14",
        "15": "35/15",
      }

      const languageConfig = configurations.languages
      if (!languageConfig) {
        throw new Error("Language configuration not found in database. Please configure languages in admin panel.")
      }

      let languagePercentages: { [key: string]: number }
      try {
        languagePercentages = typeof languageConfig === "string" ? JSON.parse(languageConfig) : languageConfig
      } catch (error) {
        throw new Error("Invalid language configuration format in database")
      }

      const samsungDevices = instagramDeviceModels.filter((device) => device.manufacturer?.toLowerCase() === "samsung")

      if (samsungDevices.length === 0) {
        console.log("[v0] No Samsung devices found, using all devices")
      }

      const devicePool = samsungDevices.length > 0 ? samsungDevices : instagramDeviceModels
      const device = devicePool[Math.floor(Math.random() * devicePool.length)]
      const androidVersion = device.android_version.toString()

      const versionPair = versionPairs[androidVersion] || `28/${androidVersion}`

      let instagramBuildNumbers = cachedBuildNumbers
      if (!instagramBuildNumbers) {
        const { InstagramBuildNumber } = supabaseModules
        instagramBuildNumbers = (await InstagramBuildNumber?.list()) || []
      }

      let matchingBuildNumbers = instagramBuildNumbers.filter((bn) => bn.android_version === androidVersion)

      if (matchingBuildNumbers.length === 0) {
        const androidVersionNum = Number.parseFloat(androidVersion)
        matchingBuildNumbers = instagramBuildNumbers.filter((bn) => {
          const bnVersion = Number.parseFloat(bn.android_version)
          return Math.abs(bnVersion - androidVersionNum) <= 2
        })

        if (matchingBuildNumbers.length === 0) {
          matchingBuildNumbers = instagramBuildNumbers.filter((bn) => bn.is_active !== false)
        }

        if (matchingBuildNumbers.length === 0) {
          matchingBuildNumbers = instagramBuildNumbers
        }
      }

      if (matchingBuildNumbers.length === 0) {
        throw new Error(
          `No build numbers found for Samsung device with Android version ${androidVersion}. Please add build numbers in admin panel.`,
        )
      }

      const selectedBuildNumber = matchingBuildNumbers[Math.floor(Math.random() * matchingBuildNumbers.length)]
      const buildNumber = selectedBuildNumber.build_number

      const resolutions = Array.isArray(device.resolutions)
        ? device.resolutions
        : device.resolutions.split(",").map((r) => r.trim())
      const resolution = resolutions[Math.floor(Math.random() * resolutions.length)]

      const matchingDpis = resolutionDpis.filter((rd) => rd.resolution === resolution)
      const dpiOptions = matchingDpis.length > 0 ? matchingDpis[0].dpis.map((d) => `${d}dpi`) : ["420dpi"]
      const dpi = dpiOptions[Math.floor(Math.random() * dpiOptions.length)]

      const language = getWeightedRandomLanguage(languagePercentages)

      const instagramVersion = instagramVersions[Math.floor(Math.random() * instagramVersions.length)]
      const chromeVersion = chromeVersions[Math.floor(Math.random() * chromeVersions.length)]

      const instagramVersionString =
        instagramVersion.version || instagramVersion.app_version || instagramVersion.toString()
      const chromeVersionString = chromeVersion.version || chromeVersion.chrome_version || chromeVersion.toString()

      const userAgent =
        `Mozilla/5.0 (Linux; Android ${androidVersion}; ${device.model || "Unknown"} Build/${buildNumber}) ` +
        `AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersionString} Mobile Safari/537.36 ` +
        `Instagram ${instagramVersionString} Android (${versionPair}; ${dpi}; ${resolution}; samsung; ${device.model || "Unknown"}; ${device.model || "Unknown"}; qcom; ${language}; 123456789)`

      return userAgent
    } catch (error) {
      console.error("Error generating Samsung Instagram user agent:", error)
      return null
    }
  }

  const generateSamsungFacebookUserAgent = async () => {
    try {
      if (!androidDeviceModels.length || !androidAppVersions.length) {
        console.error("Missing Facebook configuration data")
        return null
      }

      const languageConfig = configurations.languages
      if (!languageConfig) {
        throw new Error("Language configuration not found in database. Please configure languages in admin panel.")
      }

      let languagePercentages: { [key: string]: number }
      try {
        languagePercentages = typeof languageConfig === "string" ? JSON.parse(languageConfig) : languageConfig
      } catch (error) {
        throw new Error("Invalid language configuration format in database")
      }

      // Filter Samsung devices
      const samsungDevices = androidDeviceModels.filter((device) => device.manufacturer?.toLowerCase() === "samsung")

      console.log("[v0] Total Facebook devices:", androidDeviceModels.length)
      console.log("[v0] Samsung Facebook devices:", samsungDevices.length)

      if (samsungDevices.length === 0) {
        console.log("[v0] No Samsung devices found, using all devices")
      }

      const devicePool = samsungDevices.length > 0 ? samsungDevices : androidDeviceModels
      const device = devicePool[Math.floor(Math.random() * devicePool.length)]
      const androidVersion = device.android_version.toString()

      console.log("[v0] Selected Samsung device:", device.model_name, "Android version:", androidVersion)

      // Get Facebook build numbers from facebook_build_numbers table
      const { FacebookBuildNumber } = supabaseModules
      const facebookBuildNumbers = (await FacebookBuildNumber?.list()) || []

      console.log("[v0] Total Facebook build numbers available:", facebookBuildNumbers.length)
      console.log(
        "[v0] Available Android versions in Facebook build numbers:",
        [...new Set(facebookBuildNumbers.map((bn) => bn.android_version))].sort(),
      )

      // Match build numbers with device Android version
      let matchingBuildNumbers = facebookBuildNumbers.filter((bn) => bn.android_version === androidVersion)

      if (matchingBuildNumbers.length === 0) {
        console.log(
          `[v0] No exact Facebook build numbers for Android ${androidVersion}, trying Samsung-compatible versions`,
        )

        const androidVersionNum = Number.parseFloat(androidVersion)

        // First try: Find build numbers for same or newer Android versions
        let compatibleVersions = facebookBuildNumbers.filter((bn) => {
          const bnVersion = Number.parseFloat(bn.android_version)
          return bnVersion >= androidVersionNum && bnVersion <= androidVersionNum + 2
        })

        // Second try: If no newer versions, try older versions
        if (compatibleVersions.length === 0) {
          compatibleVersions = facebookBuildNumbers.filter((bn) => {
            const bnVersion = Number.parseFloat(bn.android_version)
            return Math.abs(bnVersion - androidVersionNum) <= 2
          })
        }

        // Third try: Use any active build numbers
        if (compatibleVersions.length === 0) {
          console.log("[v0] No compatible Facebook build numbers found, using any active build numbers")
          compatibleVersions = facebookBuildNumbers.filter((bn) => bn.is_active !== false)
        }

        // Final fallback: Use any build number
        if (compatibleVersions.length === 0) {
          console.log("[v0] No active Facebook build numbers found, using any available build numbers")
          compatibleVersions = facebookBuildNumbers
        }

        matchingBuildNumbers = compatibleVersions
        console.log(`[v0] Found ${compatibleVersions.length} compatible Facebook build numbers for Samsung device`)
      }

      if (matchingBuildNumbers.length === 0) {
        throw new Error(
          `No Facebook build numbers found for Samsung device with Android version ${androidVersion}. Please add build numbers in admin panel.`,
        )
      }

      const selectedBuildNumber = matchingBuildNumbers[Math.floor(Math.random() * matchingBuildNumbers.length)]
      const buildNumber = selectedBuildNumber.build_number
      console.log(
        "[v0] Selected Facebook build number:",
        buildNumber,
        "for Android version:",
        selectedBuildNumber.android_version,
      )

      const fbVersions = androidAppVersions.filter((a) => a.app_type === "facebook")
      const chromeVersions = androidAppVersions.filter((a) => a.app_type === "chrome")

      if (fbVersions.length === 0 || chromeVersions.length === 0) {
        throw new Error("No Facebook or Chrome versions available")
      }

      const fbVersion = fbVersions[Math.floor(Math.random() * fbVersions.length)]
      const chromeVersion = chromeVersions[Math.floor(Math.random() * chromeVersions.length)]

      const modelIdentifier = extractModelIdentifier(device.model_name)

      const userAgent =
        `Mozilla/5.0 (Linux; Android ${androidVersion}; ${modelIdentifier} Build/${buildNumber}) ` +
        `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 ` +
        `Chrome/${chromeVersion.version} Mobile Safari/537.36 ` +
        `[FB_IAB/FB4A;FBAV/${fbVersion.version};IABMV/${fbVersion.iabmv};]`

      console.log("[v0] Generated Samsung Facebook user agent successfully")
      return userAgent
    } catch (error) {
      console.error("Error generating Samsung Facebook user agent:", error)
      return null
    }
  }

  const generateAndroidUserAgent = async () => {
    try {
      if (appType === "instagram") {
        return await generateAndroidInstagramUserAgent()
      }

      if (deviceType === "samsung") {
        return await generateSamsungFacebookUserAgent()
      }

      const device = androidDeviceModels[Math.floor(Math.random() * androidDeviceModels.length)]
      if (!device) throw new Error("No Android device models available")

      const buildNumber = androidBuildNumbers.find((b) => b.android_version === device.android_version)
      if (!buildNumber) throw new Error(`No build number found for ${device.android_version}`)

      const fbVersions = androidAppVersions.filter((a) => a.app_type === "facebook")
      const chromeVersions = androidAppVersions.filter((a) => a.app_type === "chrome")

      if (fbVersions.length === 0 || chromeVersions.length === 0) {
        throw new Error("No Facebook or Chrome versions available")
      }

      const fbVersion = fbVersions[Math.floor(Math.random() * fbVersions.length)]
      const chromeVersion = chromeVersions[Math.floor(Math.random() * chromeVersions.length)]

      const modelIdentifier = extractModelIdentifier(device.model_name)

      const userAgent =
        `Mozilla/5.0 (Linux; ${device.android_version}; ${modelIdentifier} Build/${buildNumber.build_number}) ` +
        `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 ` +
        `Chrome/${chromeVersion.version} Mobile Safari/537.36 ` +
        `[FB_IAB/FB4A;FBAV/${fbVersion.version};IABMV/${fbVersion.iabmv};]`

      return userAgent
    } catch (error) {
      console.error("Error generating Android user agent:", error)
      return null
    }
  }

  const getWeightedRandomLanguage = (percentages) => {
    // Filter out languages with 0% usage
    const validLanguages = Object.entries(percentages).filter(([lang, percentage]) => percentage > 0)

    if (validLanguages.length === 0) {
      throw new Error("No languages with valid percentages found")
    }

    // Calculate total percentage of valid languages
    const totalPercentage = validLanguages.reduce((sum, [lang, percentage]) => sum + percentage, 0)

    if (totalPercentage <= 0) {
      throw new Error("Total language percentage must be greater than 0")
    }

    // Normalize percentages to ensure they sum to 100
    const normalizedLanguages = validLanguages.map(([lang, percentage]) => [lang, (percentage / totalPercentage) * 100])

    const random = Math.random() * 100
    let cumulative = 0

    for (const [lang, percentage] of normalizedLanguages) {
      cumulative += percentage
      if (random <= cumulative) {
        return lang
      }
    }

    // Fallback to first valid language if something goes wrong
    return normalizedLanguages[0][0]
  }

  const generatePixelUserAgent = async () => {
    try {
      console.log("[v0] Generating Pixel user agent, appType:", appType)
      console.log("[v0] Available Pixel Facebook devices:", pixelFacebookDeviceModels?.length || 0)
      console.log("[v0] Available Pixel Instagram devices:", pixelInstagramDeviceModels?.length || 0)

      if (appType === "instagram") {
        return await generatePixelInstagramUserAgent()
      }

      if (!pixelFacebookDeviceModels || pixelFacebookDeviceModels.length === 0) {
        console.log("[v0] No Pixel Facebook device models available")
        throw new Error("No Pixel device models available")
      }

      if (!pixelFacebookAppVersions || pixelFacebookAppVersions.length === 0) {
        console.log("[v0] No Pixel Facebook app versions available")
        throw new Error("No Pixel app versions available")
      }

      // Use Pixel Facebook device data
      const device = pixelFacebookDeviceModels[Math.floor(Math.random() * pixelFacebookDeviceModels.length)]
      console.log("[v0] Selected Pixel device:", device)

      console.log("[v0] Using device build number:", device.build_number)

      const fbVersions = pixelFacebookAppVersions.filter((a) => a.app_type === "facebook")
      const chromeVersions = pixelFacebookAppVersions.filter((a) => a.app_type === "chrome")

      console.log("[v0] Facebook versions available:", fbVersions?.length || 0)
      console.log("[v0] Chrome versions available:", chromeVersions?.length || 0)

      if (fbVersions.length === 0 || chromeVersions.length === 0) {
        throw new Error("No Facebook or Chrome versions available for Pixel")
      }

      const fbVersion = fbVersions[Math.floor(Math.random() * fbVersions.length)]
      const chromeVersion = chromeVersions[Math.floor(Math.random() * chromeVersions.length)]

      const modelIdentifier = device.model_name || device.device_model || "Pixel"

      const userAgent =
        `Mozilla/5.0 (Linux; ${device.android_version || "13"}; ${modelIdentifier} Build/${device.build_number || "TQ3A.230901.001"}) ` +
        `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 ` +
        `Chrome/${chromeVersion.version || "136.0.7195.102"} Mobile Safari/537.36 ` +
        `[FB_IAB/FB4A;FBAV/${fbVersion.version || "445.0.0.33.118"};IABMV/${fbVersion.iabmv || "1"};]`

      console.log("[v0] Generated Pixel Facebook user agent:", userAgent)
      return userAgent
    } catch (error) {
      console.error("Error generating Pixel user agent:", error)
      return null
    }
  }

  const generatePixelInstagramUserAgent = async () => {
    try {
      console.log("[v0] Generating Pixel Instagram user agent")
      console.log("[v0] Available devices:", pixelInstagramDeviceModels?.length || 0)
      console.log("[v0] Available versions:", pixelInstagramVersions?.length || 0)

      if (!pixelInstagramDeviceModels || pixelInstagramDeviceModels.length === 0) {
        console.log("[v0] No Pixel Instagram device models available")
        throw new Error("No Pixel Instagram device models available")
      }

      if (!pixelInstagramVersions || pixelInstagramVersions.length === 0) {
        console.log("[v0] No Pixel Instagram versions available")
        throw new Error("No Pixel Instagram versions available")
      }

      if (!pixelInstagramChromeVersions || pixelInstagramChromeVersions.length === 0) {
        console.log("[v0] No Pixel Instagram Chrome versions available")
        throw new Error("No Pixel Instagram Chrome versions available")
      }

      if (!pixelInstagramResolutionDpis || pixelInstagramResolutionDpis.length === 0) {
        console.log("[v0] No Pixel Instagram resolution DPIs available")
        throw new Error("No Pixel Instagram resolution DPIs available")
      }

      const device = pixelInstagramDeviceModels[Math.floor(Math.random() * pixelInstagramDeviceModels.length)]
      const version = pixelInstagramVersions[Math.floor(Math.random() * pixelInstagramVersions.length)]
      const chromeVersion =
        pixelInstagramChromeVersions[Math.floor(Math.random() * pixelInstagramChromeVersions.length)]
      const resolutionDpi =
        pixelInstagramResolutionDpis[Math.floor(Math.random() * pixelInstagramResolutionDpis.length)]

      console.log("[v0] Selected device:", device)
      console.log("[v0] Selected version:", version)
      console.log("[v0] Selected chrome version:", chromeVersion)
      console.log("[v0] Selected resolution DPI:", resolutionDpi)

      const modelIdentifier = device.model || device.model_name || device.device_model || "Pixel"

      const manufacturer = device.manufacturer ? `Google/${device.manufacturer}` : "Google/google"

      const deviceCodename = device.code || device.device_codename || "panther"
      const doubleCodename = `${deviceCodename}; ${deviceCodename}`

      const buildNumber =
        device.build_number ||
        (() => {
          throw new Error("No build number found for this device. Please configure build numbers in admin panel.")
        })()
      const androidVersion = device.android_version || 13
      const apiLevel = getApiLevel(androidVersion.toString()) || "35"

      const userAgent =
        `Mozilla/5.0 (Linux; Android ${androidVersion}; ${modelIdentifier} Build/${buildNumber}) ` +
        `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 ` +
        `Chrome/${chromeVersion.version || "136.0.7195.102"} Mobile Safari/537.36 ` +
        `Instagram ${version.version || "312.0.0.37.103"} Android (${apiLevel}/${androidVersion}; ${resolutionDpi.dpi || "420"}dpi; ` +
        `${resolutionDpi.resolution || "1440x3040"}; ${manufacturer}; ${modelIdentifier}; ${doubleCodename}; ${device.locale || "en_US"}; ${version.version_code || version.unique_id || "312001103"})`

      console.log("[v0] Generated Pixel Instagram user agent:", userAgent)
      return userAgent
    } catch (error) {
      console.error("Error generating Pixel Instagram user agent:", error)
      return null
    }
  }

  const generateUserAgent = (
    platform,
    appType,
    deviceModels,
    iosVersions,
    appVersions,
    configurations,
    blacklistedUAs,
    androidDeviceModels,
    androidBuildNumbers,
    androidAppVersions,
    instagramDeviceModels,
    instagramVersions,
    chromeVersions,
    resolutionDpis,
  ) => {
    if (platform === "pixel") {
      return generatePixelUserAgent()
    } else if (platform === "android") {
      return generateAndroidUserAgent()
    } else {
      try {
        const device = getRandomElement(deviceModels)
        if (!device) throw new Error("No device models available")

        const validIOSVersions = iosVersions.filter((ios) => {
          const versionCompareMin = compareVersions(ios.version, device.min_ios_version)
          const versionCompareMax = compareVersions(ios.version, device.max_ios_version)
          return versionCompareMin >= 0 && versionCompareMax <= 0
        })

        if (validIOSVersions.length === 0) {
          return generateUserAgent(
            platform,
            appType,
            deviceModels,
            iosVersions,
            appVersions,
            configurations,
            blacklistedUAs,
            androidDeviceModels,
            androidBuildNumbers,
            androidAppVersions,
            instagramDeviceModels,
            instagramVersions,
            chromeVersions,
            resolutionDpis,
          )
        }

        const iosVersion = getRandomElement(validIOSVersions)
        const appVersionsForType = appVersions.filter((app) => app.app_type === appType)

        if (appVersionsForType.length === 0) {
          throw new Error(`No app versions available for ${appType}`)
        }

        const appVersion = getRandomElement(appVersionsForType)

        const languageConfig = configurations.languages
        if (!languageConfig) {
          throw new Error("Language configuration not found in database. Please configure languages in admin panel.")
        }

        let languagePercentages: { [key: string]: number }
        try {
          languagePercentages = typeof languageConfig === "string" ? JSON.parse(languageConfig) : languageConfig
        } catch (error) {
          throw new Error("Invalid language configuration format in database")
        }

        const language = getWeightedRandomLanguage(languagePercentages)

        const deviceResolutions = device.resolutions && device.resolutions.length > 0 ? device.resolutions : []
        const deviceScaling = device.screen_scaling && device.screen_scaling.length > 0 ? device.screen_scaling : []

        if (deviceResolutions.length === 0) {
          throw new Error(`Device ${device.model_name} has no resolution data in database`)
        }
        if (deviceScaling.length === 0) {
          throw new Error(`Device ${device.model_name} has no scaling data in database`)
        }

        let userAgent

        const modelIdentifier = extractModelIdentifier(device.model_name)

        if (appType === "instagram") {
          console.log("[v0] Generating Instagram iOS user agent...")
          console.log("[v0] Device resolutions:", deviceResolutions)
          console.log("[v0] Device scaling:", deviceScaling)
          console.log("[v0] Selected resolution:", getRandomElement(deviceResolutions))
          console.log("[v0] Selected scaling:", getRandomElement(deviceScaling))

          userAgent =
            `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersion.version.replace(/\./g, "_")} like Mac OS X) ` +
            `AppleWebKit/${iosVersion.webkit_version} (KHTML, like Gecko) Mobile/${iosVersion.build_number} ` +
            `Instagram ${appVersion.version} (${modelIdentifier}; iOS ${iosVersion.version.replace(/\./g, "_")}; ${language}; ` +
            `scale=${getRandomElement(deviceScaling)}; ${getRandomElement(deviceResolutions)}; ${appVersion.build_number})`

          console.log("[v0] Generated Instagram iOS user agent:", userAgent)
        } else {
          const fbss = getRandomElement(deviceScaling.map((s) => s.replace(".00", "")))
          const extra = Math.random() < 0.1 ? ";FBOP/80" : ""

          let fbrv = appVersion.fbrv
          if (fbrv) {
            fbrv = fbrv.toString()
          } else {
            fbrv = (Math.floor(Math.random() * 999999) + 700000000).toString()
          }

          const fbrv_part = extra ? "" : `;FBOP/5;FBRV/${fbrv}`
          const iabmv = Math.random() < 0.9 ? ";IABMV/1" : ""

          userAgent =
            `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersion.version.replace(/\./g, "_")} like Mac OS X) ` +
            `AppleWebKit/${iosVersion.webkit_version} (KHTML, like Gecko) Mobile/${iosVersion.build_number} ` +
            `[FBAN/FBIOS;FBAV/${appVersion.version};FBBV/${appVersion.build_number};FBDV/${modelIdentifier};FBMD/iPhone;FBSN/iOS;` +
            `FBSV/${iosVersion.version};FBSS/${fbss};FBID/phone;FBLC/${language}${extra}${fbrv_part}${iabmv}]`
        }

        return userAgent
      } catch (error) {
        console.error("Error generating user agent:", error)
        return null
      }
    }
  }

  // Renamed generateUserAgents to handleGenerate and adjusted parameters
  const handleGenerate = useCallback(async () => {
    if (!supabaseModules || connectionError) {
      showModal("❌ Database Connection Error!", "No database connection. Please refresh the page.", "error")
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setUserAgents([])

    showProgressModal("🚀 User Agent Generation Started", "Processing started...", 0, "info", true)

    try {
      const newUserAgents = []
      const usedUserAgents = new Set()

      const maxAttempts = Math.max(quantity * 100, 50000)
      let attempts = 0
      let consecutiveFailures = 0
      const maxConsecutiveFailures = 500
      let lastProgressUpdate = 0

      let cachedInstagramBuildNumbers = null
      if (platform === "android" && appType === "instagram") {
        const { InstagramBuildNumber } = supabaseModules
        cachedInstagramBuildNumbers = (await InstagramBuildNumber?.list()) || []
        console.log(`[v0] Cached ${cachedInstagramBuildNumbers.length} Instagram build numbers`)
      }

      console.log(`[v0] Starting generation: ${quantity} requested`)
      console.log(`[v0] Blacklisted UAs: ${blacklistedUAs.size}`)

      while (
        newUserAgents.length < quantity &&
        attempts < maxAttempts &&
        consecutiveFailures < maxConsecutiveFailures
      ) {
        attempts++

        let userAgent = null

        try {
          if (platform === "android") {
            if (appType === "instagram") {
              userAgent = await generateAndroidInstagramUserAgent(cachedInstagramBuildNumbers)
            } else if (appType === "facebook") {
              if (deviceType === "samsung") {
                userAgent = await generateSamsungFacebookUserAgent()
              } else {
                userAgent = await generateAndroidUserAgent()
              }
            } else {
              userAgent = await generateAndroidUserAgent()
            }
          } else if (platform === "ios") {
            userAgent = generateUserAgent(
              platform,
              appType,
              deviceModels,
              iosVersions,
              appVersions,
              configurations,
              blacklistedUAs,
              androidDeviceModels,
              androidBuildNumbers,
              androidAppVersions,
              instagramDeviceModels,
              instagramVersions,
              chromeVersions,
              resolutionDpis,
            )
          } else if (platform === "pixel") {
            userAgent = await generatePixelUserAgent()
          }

          if (userAgent && !newUserAgents.includes(userAgent)) {
            newUserAgents.push(userAgent)
            consecutiveFailures = 0
          } else {
            consecutiveFailures++
          }
        } catch (error) {
          console.error("Error generating user agent:", error)
          consecutiveFailures++
        }

        const now = Date.now()
        if (now - lastProgressUpdate > 100) {
          lastProgressUpdate = now
          const progress = Math.round((newUserAgents.length / quantity) * 100)
          const successRate = attempts > 0 ? Math.round((newUserAgents.length / attempts) * 100) : 0

          startTransition(() => {
            setGenerationProgress(progress)
            setProgressModal((prev) => ({
              ...prev,
              progress,
              message: `⚡ ${newUserAgents.length}/${quantity} unique user agents generated\n📊 Success rate: ${successRate}%\n🔄 Attempts: ${attempts}/${maxAttempts}`,
            }))
          })

          await new Promise((resolve) => setTimeout(resolve, 1))
        }

        if (newUserAgents.length < quantity && attempts < maxAttempts && consecutiveFailures < maxConsecutiveFailures) {
          if (platform === "android" && appType === "instagram") {
            // No delay needed since we're using cached data
          } else if (consecutiveFailures > 50) {
            await new Promise((resolve) => setTimeout(resolve, 200))
          } else if (consecutiveFailures > 20) {
            await new Promise((resolve) => setTimeout(resolve, 50))
          } else {
            await new Promise((resolve) => setTimeout(resolve, 10))
          }
        }
      }

      const finalUserAgents = newUserAgents.slice(0, quantity)
      const actualGenerated = finalUserAgents.length

      startTransition(() => {
        setUserAgents(finalUserAgents)
      })

      if (actualGenerated === quantity) {
        setProgressModal((prev) => ({
          ...prev,
          progress: 100,
          title: "✅ Job Successful",
          message: `🎉 ${quantity} unique user agents generated successfully!\n⚡ Total attempts: ${attempts}\n✨ Job completed!`,
          type: "success",
          showCancel: false,
        }))

        // Auto close after 2 seconds
        setTimeout(() => {
          hideProgressModal()
        }, 2000)
      } else if (actualGenerated > 0) {
        setProgressModal((prev) => ({
          ...prev,
          progress: Math.round((actualGenerated / quantity) * 100),
          title: "⚠️ Job Partially Successful",
          message: `📊 ${actualGenerated} out of ${quantity} unique user agents generated\nWarning: Could not generate more due to blacklist and duplicate avoidance`,
          type: "warning",
          showCancel: false,
        }))

        setTimeout(() => {
          hideProgressModal()
        }, 3000)
      } else {
        setProgressModal((prev) => ({
          ...prev,
          progress: 0,
          title: "❌ Job Failed",
          message: `💥 No unique user agents could be generated\n🚫 All possible combinations may be blacklisted or used`,
          type: "error",
          showCancel: false,
        }))

        setTimeout(() => {
          hideProgressModal()
        }, 3000)
      }

      console.log(`[v0] Generation completed: ${actualGenerated}/${quantity} generated in ${attempts} attempts`)
    } catch (error) {
      console.error("Error generating user agents:", error)
      setProgressModal((prev) => ({
        ...prev,
        progress: 0,
        title: "❌ Job Failed",
        message: `💥 Error occurred while generating user agents\n🔄 Please try again`,
        type: "error",
        showCancel: false,
      }))

      setTimeout(() => {
        hideProgressModal()
      }, 3000)
    } finally {
      setIsGenerating(false)
    }
  }, [
    platform,
    appType,
    quantity,
    supabaseModules,
    connectionError,
    deviceModels,
    iosVersions,
    appVersions,
    configurations,
    blacklistedUAs,
    androidDeviceModels,
    androidBuildNumbers,
    androidAppVersions,
    instagramDeviceModels,
    instagramVersions,
    chromeVersions,
    resolutionDpis,
    deviceType,
    showModal,
    showProgressModal,
    hideProgressModal,
    setUserAgents,
    setGenerationProgress,
    setIsGenerating,
    startTransition,
    setProgressModal,
  ])

  const handleLogout = async () => {
    console.log("[v0] Starting logout process...")
    await signOut()
    console.log("[v0] Logout completed, redirecting to auth...")
    router.push("/auth")
  }

  const addToBlacklist = async () => {
    if (!userAgents.length) return false

    try {
      console.log(`Adding ${userAgents.length} user agents to blacklist...`)

      showProgressModal("⚙️ Processing", "Blacklisting user agents...", 0, "info", false)

      const finalAppType = platform === "android" ? `android_${appType}` : appType
      const { BlacklistedUserAgent } = supabaseModules

      const batchSize = 50 // Increased batch size for better performance
      const totalBatches = Math.ceil(userAgents.length / batchSize)

      for (let batch = 0; batch < totalBatches; batch++) {
        const batchStart = batch * batchSize
        const batchEnd = Math.min(batchStart + batchSize, userAgents.length)
        const batchUAs = userAgents.slice(batchStart, batchEnd)

        const batchDataMap = new Map()

        batchUAs.forEach((ua) => {
          const hash = btoa(ua)
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 32)

          // Only add if hash doesn't exist in this batch
          if (!batchDataMap.has(hash)) {
            batchDataMap.set(hash, {
              user_agent: ua,
              hash,
              downloaded_by: "anonymous@example.com",
              app_type: finalAppType,
            })
          }
        })

        // Convert map to array for bulk upsert
        const batchData = Array.from(batchDataMap.values())

        try {
          // Use bulk upsert for much better performance
          await BlacklistedUserAgent.bulkCreateOrUpdate(batchData)
        } catch (error) {
          console.error(`Error blacklisting batch ${batch + 1}:`, error)
          throw error
        }

        const progress = Math.round(((batch + 1) / totalBatches) * 100)
        startTransition(() => {
          setProgressModal((prev) => ({
            ...prev,
            progress,
            message: `🔒 ${batchEnd}/${userAgents.length} user agents processed...`,
          }))
        })

        // No delay needed with bulk operations
      }

      console.log(`Successfully blacklisted ${userAgents.length} user agents`)

      await loadData()

      hideProgressModal()
      return true
    } catch (error) {
      console.error("Error during blacklisting process:", error)
      hideProgressModal()
      return false
    }
  }

  const handleDownload = useCallback(async () => {
    if (!userAgents.length) return

    try {
      // const historyId = await GenerationHistory.create({
      //   app_type: appType,
      //   quantity: userAgents.length,
      //   user_agents: userAgents,
      //   is_downloaded: true,
      //   created_by: accessKey?.access_key || "anonymous",
      // })

      const text = userAgents.join("\n")
      const blob = new Blob([text], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `user-agents-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // loadHistory()

      showModal("✅ Download Successful!", `${userAgents.length} user agents downloaded successfully.`, "success")
    } catch (error) {
      console.error("Error downloading file:", error)
      showModal("❌ Error!", "Error occurred while downloading.", "error")
    }
  }, [userAgents, showModal])

  const handleCopyAll = useCallback(async () => {
    if (userAgents.length === 0) return

    try {
      const text = userAgents.join("\n")
      await navigator.clipboard.writeText(text)

      // const historyId = await GenerationHistory.create({
      //   app_type: appType,
      //   quantity: userAgents.length,
      //   user_agents: userAgents,
      //   is_downloaded: false,
      //   created_by: accessKey?.access_key || "anonymous",
      // })

      // loadHistory()

      showModal("✅ Copy Successful!", `${userAgents.length} user agents copied successfully.`, "success")
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      showModal("❌ Error!", "Error occurred while copying.", "error")
    }
  }, [userAgents, showModal])

  const handleCopy = useCallback(
    async (text: string, index: number) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
      } catch (error) {
        console.error("Error copying to clipboard:", error)
        showModal("❌ Error!", "Error occurred while copying.", "error")
      }
    },
    [showModal],
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-100">Loading...</p>
        </div>
      </div>
    )
  }

  if (user && profile && profile.status === "pending") {
    return <AccountPending />
  }

  if (user && !profile) {
    return <AccountPending />
  }

  const renderAuthStatus = () => {
    if (!isAuthenticated) {
      return (
        <div className="mt-8">
          <p className="text-blue-200 mb-4">আরও ফিচার এবং প্রিমিয়াম সার্ভিসের জন্য লগইন করুন</p>
          <Button
            size="lg"
            className="bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30"
            asChild // Use asChild for Link
          >
            <Link href="/auth">এখনই শুরু করুন</Link>
          </Button>
        </div>
      )
    }

    if (needsApproval) {
      return (
        <div className="mt-8">
          <div className="bg-orange-500/20 backdrop-blur-md border border-orange-400/30 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 text-orange-100 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">অনুমোদনের অপেক্ষায়</span>
            </div>
            <p className="text-orange-200 text-sm">
              আপনার অ্যাকাউন্ট admin দ্বারা অনুমোদনের অপেক্ষায় রয়েছে। অনুমোদনের পর আপনি সব ফিচার ব্যবহার করতে পারবেন।
            </p>
            <div className="mt-3 text-center">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                asChild // Use asChild for Link
              >
                <Link href="/pricing">প্রাইসিং দেখুন</Link>
              </Button>
            </div>
          </div>
        </div>
      )
    }

    if (isRejected) {
      return (
        <div className="mt-8">
          <div className="bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 text-red-100 mb-2">
              <span className="font-medium">অ্যাকাউন্ট প্রত্যাখ্যাত</span>
            </div>
            <p className="text-red-200 text-sm">
              দুঃখিত, আপনার অ্যাকাউন্ট অনুমোদন করা হয়নি। আরও তথ্যের জন্য সাপোর্টের সাথে যোগাযোগ করুন।
            </p>
          </div>
        </div>
      )
    }

    if (isSuspended) {
      return (
        <div className="mt-8">
          <div className="bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 text-red-100 mb-2">
              <span className="font-medium">অ্যাকাউন্ট স্থগিত</span>
            </div>
            <p className="text-red-200 text-sm">
              আপনার অ্যাকাউন্ট সাময়িকভাবে স্থগিত করা হয়েছে। আরও তথ্যের জন্য সাপোর্টের সাথে যোগাযোগ করুন।
            </p>
          </div>
        </div>
      )
    }

    if (canUseGenerator) {
      return (
        <div className="mt-8">
          <div className="bg-green-500/20 backdrop-blur-md border border-green-400/30 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 text-green-100 mb-2">
              <Check className="w-5 h-5" />
              <span className="font-medium">স্বাগতম, {profile?.full_name}!</span>
            </div>
            <p className="text-green-200 text-sm">আপনার অ্যাকাউন্ট অনুমোদিত। আপনি সব ফিচার ব্যবহার করতে পারেন।</p>
            <div className="mt-2 text-center">
              <Badge variant="secondary" className="bg-white/20 text-white">
                Limit: {profile?.user_agent_limit || 10} per day
              </Badge>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      <NavigationHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <AppHeader />
          <GeneratorControls
            platform={platform}
            setPlatform={setPlatform}
            appType={appType}
            setAppType={setAppType}
            quantity={quantity}
            setQuantity={setQuantity}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
          {userAgents.length > 0 && (
            <Card className="bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-slate-900 dark:text-slate-100">
                    Generated User Agents ({userAgents.length})
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopyAll}
                      variant="outline"
                      size="sm"
                      className="bg-white/20 dark:bg-slate-700/20 backdrop-blur-md border-white/30 dark:border-slate-600/30"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                      className="bg-white/20 dark:bg-slate-700/20 backdrop-blur-md border-white/30 dark:border-slate-600/30"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {userAgents.map((ua, index) => (
                    <div
                      key={index}
                      className="p-3 bg-slate-50/20 dark:bg-slate-700/20 backdrop-blur-sm rounded-lg border border-slate-200/30 dark:border-slate-600/30 hover:bg-slate-100/30 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-sm text-slate-700 dark:text-slate-300 flex-1 break-all">{ua}</code>
                        <Button
                          onClick={() => handleCopy(ua, index)}
                          variant="ghost"
                          size="sm"
                          className="shrink-0 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          <GeneratedAgentsHistory />
        </div>
      </main>

      {/* Progress Modal */}
      {progressModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{progressModal.title}</h3>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progressModal.progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">
                  {progressModal.message}
                </div>
              </div>
              {progressModal.showCancel && (
                <div className="flex justify-center">
                  <Button onClick={hideProgressModal} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Regular Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{modal.title}</h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">{modal.message}</div>
              </div>
              <div className="flex justify-center gap-2">
                {modal.showCancel && (
                  <Button onClick={() => setModal((prev) => ({ ...prev, isOpen: false }))} variant="outline" size="sm">
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={() => {
                    modal.onConfirm()
                    setModal((prev) => ({ ...prev, isOpen: false }))
                  }}
                  size="sm"
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
