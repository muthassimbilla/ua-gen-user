"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"

const DashboardPage = () => {
  const [users, setUsers] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [securityAlerts, setSecurityAlerts] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/adminbilla/login")
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("admin_token")

      // Fetch users
      const usersResponse = await fetch("/api/adminbilla/users", {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Fetch analytics
      const analyticsResponse = await fetch("/api/adminbilla/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const alertsResponse = await fetch("/api/adminbilla/security-alerts", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (usersResponse.ok && analyticsResponse.ok && alertsResponse.ok) {
        const usersData = await usersResponse.json()
        const analyticsData = await analyticsResponse.json()
        const alertsData = await alertsResponse.json()

        setUsers(usersData.users)
        setAnalytics(analyticsData)
        setSecurityAlerts(alertsData.alerts)
      } else {
        setError("ডেটা লোড করতে ব্যর্থ")
      }
    } catch (error) {
      setError("সার্ভার এরর")
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: "approve" | "reject") => {
    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch("/api/adminbilla/user-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, action }),
      })

      if (response.ok) {
        fetchData() // Refresh data
      } else {
        setError("অ্যাকশন সম্পন্ন করতে ব্যর্থ")
      }
    } catch (error) {
      setError("সার্ভার এরর")
    }
  }

  const logout = () => {
    localStorage.removeItem("admin_token")
    router.push("/adminbilla/login")
  }

  return (
    <div>
      {/* Dashboard content here */}
      {loading && <p>Loading...</p>}
      {error && <Alert>{error}</Alert>}
      {/* Users, Analytics, Security Alerts components here */}
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}

export default DashboardPage
