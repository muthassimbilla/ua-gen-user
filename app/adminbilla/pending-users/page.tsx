"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Users, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface PendingUser {
  id: string
  full_name: string
  telegram_username: string
  account_status: string
  is_approved: boolean
  created_at: string
}

export default function PendingUsersPage() {
  const [users, setUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchPendingUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/pending-users")
      const result = await response.json()

      if (result.success) {
        setUsers(result.data.users)
      } else {
        toast.error("Failed to fetch pending users")
      }
    } catch (error) {
      console.error("Error fetching pending users:", error)
      toast.error("Failed to fetch pending users")
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: "approve" | "reject") => {
    try {
      setActionLoading(userId)
      const response = await fetch("/api/admin/approve-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          action: action
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success(result.data.message)
        // Remove user from list
        setUsers(users.filter(user => user.id !== userId))
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error("Error performing action:", error)
      toast.error("Failed to perform action")
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Pending Users
              </h1>
              <p className="text-muted-foreground">
                Manage user approval requests
              </p>
            </div>
            <Button
              onClick={fetchPendingUsers}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Approved Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Rejected Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading pending users...</span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Pending Users</h3>
              <p className="text-muted-foreground">
                All users have been processed or there are no new requests.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {user.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user.full_name}</h3>
                        <p className="text-muted-foreground">@{user.telegram_username}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Pending Approval
                      </Badge>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUserAction(user.id, "approve")}
                          disabled={actionLoading === user.id}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {actionLoading === user.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Approve
                        </Button>
                        
                        <Button
                          onClick={() => handleUserAction(user.id, "reject")}
                          disabled={actionLoading === user.id}
                          size="sm"
                          variant="destructive"
                        >
                          {actionLoading === user.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}