"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, CheckCircle, XCircle, Calendar, MessageCircle, User, Clock, AlertTriangle, Users } from "lucide-react"
import { AdminUserService, type AdminUser } from "@/lib/admin-user-service"

export default function PendingUsersPage() {
  const [pendingUsers, setPendingUsers] = useState<AdminUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [processingUsers, setProcessingUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadPendingUsers()
  }, [])

  const loadPendingUsers = async () => {
    try {
      const users = await AdminUserService.getPendingUsers()
      setPendingUsers(users)
    } catch (error) {
      console.error("Error loading pending users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = pendingUsers.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.telegram_username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleApproveUser = async (userId: string) => {
    setProcessingUsers((prev) => new Set(prev).add(userId))
    try {
      await AdminUserService.approveUser(userId)
      await loadPendingUsers()
    } catch (error: any) {
      console.error("Error approving user:", error)
      alert(`Failed to approve user: ${error.message}`)
    } finally {
      setProcessingUsers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const handleRejectUser = async (userId: string) => {
    if (confirm("Are you sure you want to reject this user's approval?")) {
      setProcessingUsers((prev) => new Set(prev).add(userId))
      try {
        await AdminUserService.rejectUser(userId)
        await loadPendingUsers()
      } catch (error: any) {
        console.error("Error rejecting user:", error)
        alert(`Failed to reject user: ${error.message}`)
      } finally {
        setProcessingUsers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(userId)
          return newSet
        })
      }
    }
  }

  const handleBulkApprove = async () => {
    if (filteredUsers.length === 0) return

    if (confirm(`Are you sure you want to approve ${filteredUsers.length} users at once?`)) {
      setIsLoading(true)
      try {
        for (const user of filteredUsers) {
          await AdminUserService.approveUser(user.id)
        }
        await loadPendingUsers()
      } catch (error: any) {
        console.error("Error bulk approving users:", error)
        alert(`Bulk approval failed: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="glass-card p-8 rounded-2xl">
          <div className="text-lg text-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="glass-card p-4 lg:p-6 rounded-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Pending Users</h1>
            <p className="text-muted-foreground text-sm lg:text-base">Approve or reject new user registrations</p>
          </div>
          {filteredUsers.length > 0 && (
            <Button
              onClick={handleBulkApprove}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-xs lg:text-sm"
            >
              <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
              Approve All ({filteredUsers.length})
            </Button>
          )}
        </div>
      </div>

      {/* Stats Card */}
      <div className="glass-card p-4 lg:p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-foreground">{pendingUsers.length}</div>
            <div className="text-sm lg:text-base text-muted-foreground">Pending Users</div>
          </div>
          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
            <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Search */}
      {pendingUsers.length > 0 && (
        <div className="glass-card p-4 lg:p-6 rounded-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or telegram username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </div>
      )}

      {/* Pending Users List */}
      {pendingUsers.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">All Users Approved!</h3>
          <p className="text-muted-foreground">Currently no users are waiting for approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="glass-card hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {user.full_name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base lg:text-lg truncate">{user.full_name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs lg:text-sm">
                      <MessageCircle className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">@{user.telegram_username}</span>
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="w-fit text-yellow-600 border-yellow-600">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending Approval
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span>Registered: {new Date(user.created_at).toLocaleDateString("en-US")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                    <User className="w-3 h-3 flex-shrink-0" />
                    <span>User ID: {user.id.substring(0, 8)}...</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApproveUser(user.id)}
                    disabled={processingUsers.has(user.id)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-xs lg:text-sm"
                  >
                    <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                    {processingUsers.has(user.id) ? "Approving..." : "Approve"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRejectUser(user.id)}
                    disabled={processingUsers.has(user.id)}
                    className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700 text-xs lg:text-sm"
                  >
                    <XCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && pendingUsers.length > 0 && (
        <div className="glass-card p-12 rounded-2xl text-center">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
          <p className="text-muted-foreground">Try changing your search criteria.</p>
        </div>
      )}

      {/* Information Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> New users wait for approval after registration. After approval, they can log in. If approval is rejected, they cannot log in.
        </AlertDescription>
      </Alert>
    </div>
  )
}
