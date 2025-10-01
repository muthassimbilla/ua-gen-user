"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  Edit,
  Trash2,
  Plus,
  UserCheck,
  UserX,
  Filter,
  Download,
  Calendar,
  Activity,
  Users,
  Eye,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Smartphone,
  RefreshCw,
  User,
} from "lucide-react"
import { AdminUserService, type AdminUser } from "@/lib/admin-user-service"
import { Switch } from "@/components/ui/switch"

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isSecurityDialogOpen, setIsSecurityDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "expired" | "pending">("all")
  const [isDevicesDialogOpen, setIsDevicesDialogOpen] = useState(false)
  const [userDevices, setUserDevices] = useState<any[]>([])
  const [devicesLoading, setDevicesLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    loadUsers()
  }, [])

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      loadUsers()
    }, 20000) // Refresh every 20 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  const loadUsers = async () => {
    try {
      const userData = await AdminUserService.getAllUsers()
      setUsers(userData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.telegram_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.current_status === "active") ||
      (statusFilter === "suspended" && user.current_status === "suspended") ||
      (statusFilter === "expired" && user.current_status === "expired") ||
      (statusFilter === "pending" && user.current_status === "pending")

    return matchesSearch && matchesStatus
  })

  const handleApproveUser = async (userId: string) => {
    try {
      await AdminUserService.approveUser(userId)
      await loadUsers()
    } catch (error: any) {
      console.error("Error approving user:", error)
      alert(`Failed to approve user: ${error.message}`)
    }
  }

  const handleRejectUser = async (userId: string) => {
    if (confirm("Are you sure you want to reject this user's approval?")) {
      try {
        await AdminUserService.rejectUser(userId)
        await loadUsers()
      } catch (error: any) {
        console.error("Error rejecting user:", error)
        alert(`Failed to reject user approval: ${error.message}`)
      }
    }
  }

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const handleViewDevices = async (user: AdminUser) => {
    setSelectedUser(user)
    setIsDevicesDialogOpen(true)
    setDevicesLoading(true)

    try {
      console.log("Fetching devices for user:", user.id)

      // Fetch user devices from API
      const response = await fetch(`/api/admin/user-devices?user_id=${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.id}`,
        },
      })

      console.log("API response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("API response data:", data)
        setUserDevices(data.data || [])
      } else {
        const errorData = await response.json()
        console.error("API error:", errorData)
        setUserDevices([])
      }
    } catch (error) {
      console.error("Error fetching user devices:", error)
      setUserDevices([])
    } finally {
      setDevicesLoading(false)
    }
  }

  const handleSecuritySettings = (user: AdminUser) => {
    setSelectedUser(user)
    setIsSecurityDialogOpen(true)
  }

  const handleSaveUser = async (updatedUser: AdminUser) => {
    try {
      await AdminUserService.updateUser(updatedUser.id, updatedUser)
      await loadUsers()
      setIsEditDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleSecurityUpdate = async (
    userId: string,
    data: {
      status?: "active" | "suspended"
      expirationDate?: string | null
    },
  ) => {
    try {
      console.log("[v0] handleSecurityUpdate called with:", { userId, data })

      await AdminUserService.handleSecurityUpdate(userId, {
        ...data,
        activateAccount: data.status === "active",
      })

      await loadUsers()
      setIsSecurityDialogOpen(false)
      setSelectedUser(null)

      console.log("[v0] Security settings updated successfully")
    } catch (error: any) {
      console.error("Error updating security settings:", error)
      alert(`Failed to update security settings: ${error.message}`)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await AdminUserService.deleteUser(userId)
        await loadUsers()
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      console.log("[v0] Toggling user status:", userId, "from", currentStatus, "to", !currentStatus)

      const newStatus = !currentStatus
      await AdminUserService.toggleUserStatus(userId, newStatus)

      // Reload users to get fresh data
      await loadUsers()

      // Show success message
      const statusText = newStatus ? "activated" : "deactivated"
      console.log(`[v0] User successfully ${statusText}`)
    } catch (error: any) {
      console.error("Error toggling user status:", error)
      alert(`Failed to update user status: ${error.message}`)
    }
  }

  const handleCreateUser = () => {
    console.log("[v0] Create user button clicked")
    setIsCreateDialogOpen(true)
  }

  const handleSaveNewUser = async (userData: {
    full_name: string
    email: string
    is_active: boolean
    account_status: "active" | "suspended"
    expiration_date?: string | null
  }) => {
    try {
      console.log("[v0] Saving new user:", userData)
      await AdminUserService.createUser(userData)
      await loadUsers()
      setIsCreateDialogOpen(false)
    } catch (error: any) {
      console.error("[v0] Error creating user:", error)
      alert(`Failed to create new user: ${error.message}`)
    }
  }

  const activeUsers = users.filter((user) => user.current_status === "active").length
  const suspendedUsers = users.filter((user) => user.current_status === "suspended").length
  const expiredUsers = users.filter((user) => user.current_status === "expired").length
  const pendingUsers = users.filter((user) => user.current_status === "pending").length

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return { variant: "default" as const, text: "Active", color: "text-green-600" }
      case "suspended":
        return { variant: "destructive" as const, text: "Suspended", color: "text-red-600" }
      case "expired":
        return { variant: "destructive" as const, text: "Expired", color: "text-red-600" }
      case "pending":
        return { variant: "outline" as const, text: "Pending Approval", color: "text-yellow-600" }
      default:
        return { variant: "outline" as const, text: "Unknown", color: "text-gray-600" }
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
    <div className="space-y-4 lg:space-y-6">
      {/* Header Section */}
      <div className="glass-card p-3 lg:p-4 rounded-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">User Management</h1>
            <p className="text-muted-foreground text-sm lg:text-base">
              View and manage all user information and security settings
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              {autoRefresh && (
                <Badge variant="secondary" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                id="auto-refresh-users"
              />
              <label htmlFor="auto-refresh-users" className="text-sm text-muted-foreground">
                Auto Refresh
              </label>
            </div>
            <Button 
              onClick={loadUsers} 
              variant="outline" 
              size="sm" 
              className="text-xs lg:text-sm bg-transparent"
            >
              <RefreshCw className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="text-xs lg:text-sm bg-transparent">
              <Download className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={handleCreateUser}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-xs lg:text-sm"
            >
              <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
              New User
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-4">
        <div className="glass-card p-4 lg:p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">{users.length}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-4 lg:p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">{activeUsers}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-4 lg:p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">{pendingUsers}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Pending Approval</div>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-4 lg:p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl lg:text-2xl font-bold text-red-600">{expiredUsers}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Expired Accounts</div>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-4 lg:p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">{suspendedUsers}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Suspended Users</div>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <UserX className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-4 lg:p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">{expiredUsers}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Expired Users</div>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center">
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-card p-4 lg:p-6 rounded-2xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "suspended" | "expired" | "pending")
              }
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm min-w-0"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending Approval</option>
              <option value="suspended">Suspended</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
        {filteredUsers.map((user) => {
          const statusInfo = getStatusInfo(user.current_status)
          return (
            <div
              key={user.id}
              className="glass-card p-4 lg:p-6 rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3 lg:mb-4">
                <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm lg:text-base flex-shrink-0">
                    {user.full_name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-sm lg:text-base truncate">{user.full_name}</h3>
                    <p className="text-xs lg:text-sm text-muted-foreground truncate">
                      {user.email || `@${user.telegram_username}` || 'No contact info'}
                    </p>
                  </div>
                </div>
                <Badge variant={statusInfo.variant} className="text-xs flex-shrink-0">
                  {statusInfo.text}
                </Badge>
              </div>

              <div className="space-y-1 lg:space-y-2 mb-3 lg:mb-4">
                <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3 lg:w-4 lg:w-4 flex-shrink-0" />
                  <span className="truncate">Joined: {new Date(user.created_at).toLocaleDateString("en-US")}</span>
                </div>
                {user.approved_at && (
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                    <CheckCircle className="w-3 h-3 lg:w-4 lg:w-4 flex-shrink-0" />
                    <span className="truncate">Approved: {new Date(user.approved_at).toLocaleDateString("en-US")}</span>
                  </div>
                )}
                {user.expiration_date && (
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                    <Clock className="w-3 h-3 lg:w-4 lg:w-4 flex-shrink-0" />
                    <span className="truncate">
                      Expires: {new Date(user.expiration_date).toLocaleDateString("en-US")}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                  <Activity className="w-3 h-3 lg:w-4 lg:w-4 flex-shrink-0" />
                  <span className="truncate">Updated: {new Date(user.updated_at).toLocaleDateString("en-US")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                  <Smartphone className="w-3 h-3 lg:w-4 lg:w-4 flex-shrink-0" />
                  <span className="truncate">Active Sessions: {user.device_count || 0}</span>
                </div>
                {user.last_login && (
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                    <Clock className="w-3 h-3 lg:w-4 lg:w-4 flex-shrink-0" />
                    <span className="truncate">Last Login: {new Date(user.last_login).toLocaleString("en-US")}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs lg:text-sm">
                  <div className={`w-2 h-2 rounded-full ${user.is_active ? "bg-green-500" : "bg-red-500"}`}></div>
                  <span className={user.is_active ? "text-green-600" : "text-red-600"}>
                    {user.is_active ? "Account Active" : "Account Deactivated"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {/* Primary Actions Row */}
                <div className="flex items-center gap-2">
                  {user.current_status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveUser(user.id)}
                        className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 flex-1 text-xs font-medium"
                      >
                        <CheckCircle className="h-3 w-3 mr-1.5" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectUser(user.id)}
                        className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 flex-1 text-xs font-medium"
                      >
                        <XCircle className="h-3 w-3 mr-1.5" />
                        Reject
                      </Button>
                    </>
                  )}

                  {/* Activation Toggle - Most Important Action */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("[v0] Toggle button clicked for user:", user.id, "current is_active:", user.is_active)
                      toggleUserStatus(user.id, user.is_active)
                    }}
                    className={`flex-1 text-xs font-medium transition-all duration-200 ${
                      user.is_active
                        ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
                        : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
                    }`}
                  >
                    {user.is_active ? (
                      <>
                        <UserX className="h-3 w-3 mr-1.5" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-3 w-3 mr-1.5" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>

                {/* Secondary Actions Row */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewUser(user)}
                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 flex-1 text-xs font-medium"
                  >
                    <Eye className="h-3 w-3 mr-1.5" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 p-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="glass-card p-12 rounded-2xl text-center">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
          <p className="text-muted-foreground">Try changing your search criteria.</p>
        </div>
      )}

      {/* Security Settings Dialog */}
      <Dialog open={isSecurityDialogOpen} onOpenChange={setIsSecurityDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </DialogTitle>
            <DialogDescription>Set user account status and expiration period</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <SecuritySettingsForm
              user={selectedUser}
              onSave={handleSecurityUpdate}
              onCancel={() => setIsSecurityDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              User Details - {selectedUser?.full_name}
            </DialogTitle>
            <DialogDescription>Complete user information and activity details</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Profile Header */}
              <div className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.full_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground">{selectedUser.full_name}</h3>
                  <p className="text-lg text-muted-foreground">
                    {selectedUser.email || `@${selectedUser.telegram_username}` || 'No contact info'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getStatusInfo(selectedUser.current_status).variant} className="text-sm">
                      {getStatusInfo(selectedUser.current_status).text}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      {selectedUser.device_count || 0} Active Sessions
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">User ID</span>
                      <code className="text-xs text-foreground font-mono bg-muted px-2 py-1 rounded">
                        {selectedUser.id}
                      </code>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">Full Name</span>
                      <span className="text-sm text-foreground font-medium">{selectedUser.full_name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">
                        {selectedUser.email ? 'Email Address' : 'Telegram Username'}
                      </span>
                      <span className="text-sm text-foreground font-medium">
                        {selectedUser.email || `@${selectedUser.telegram_username}` || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">Account Status</span>
                      <Badge variant={getStatusInfo(selectedUser.current_status).variant} className="text-xs">
                        {getStatusInfo(selectedUser.current_status).text}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-muted-foreground">Is Active</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${selectedUser.is_active ? "bg-green-500" : "bg-red-500"}`}></div>
                        <span className={`text-sm font-medium ${selectedUser.is_active ? "text-green-600" : "text-red-600"}`}>
                          {selectedUser.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Account Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">Join Date</span>
                      <span className="text-sm text-foreground">
                        {new Date(selectedUser.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                      <span className="text-sm text-foreground">
                        {new Date(selectedUser.updated_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    {selectedUser.approved_at && (
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm font-medium text-muted-foreground">Approved Date</span>
                        <span className="text-sm text-foreground">
                          {new Date(selectedUser.approved_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    )}
                    {selectedUser.expiration_date && (
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm font-medium text-muted-foreground">Expiration Date</span>
                        <span className="text-sm text-foreground">
                          {new Date(selectedUser.expiration_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                    )}
                    {selectedUser.last_login && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-muted-foreground">Last Login</span>
                        <span className="text-sm text-foreground">
                          {new Date(selectedUser.last_login).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Device & Session Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Device & Session Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">Active Sessions</span>
                      <Badge variant="outline" className="text-sm">
                        {selectedUser.device_count || 0} Devices
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">Approval Status</span>
                      <Badge variant={selectedUser.is_approved ? "default" : "secondary"} className="text-sm">
                        {selectedUser.is_approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                  
                  {selectedUser.user_agent && selectedUser.user_agent !== "Unknown" && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-muted-foreground">User Agent</span>
                      <div className="bg-muted p-3 rounded-lg">
                        <code className="text-xs text-foreground break-all leading-relaxed block">
                          {selectedUser.user_agent}
                        </code>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleEditUser(selectedUser)
                  }}
                  variant="outline"
                  size="sm"
                  className="bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit User
                </Button>
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleViewDevices(selectedUser)
                  }}
                  variant="outline"
                  size="sm"
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  View Devices
                </Button>
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleSecuritySettings(selectedUser)
                  }}
                  variant="outline"
                  size="sm"
                  className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security Settings
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <EditUserForm user={selectedUser} onSave={handleSaveUser} onCancel={() => setIsEditDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Provide new user information</DialogDescription>
          </DialogHeader>
          <CreateUserForm onSave={handleSaveNewUser} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* User Devices Dialog */}
      <Dialog open={isDevicesDialogOpen} onOpenChange={setIsDevicesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              User Sessions & IP Addresses
            </DialogTitle>
            <DialogDescription>
              View all active sessions and IP addresses used by {selectedUser?.full_name}
            </DialogDescription>
          </DialogHeader>

          {devicesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading sessions...</p>
              </div>
            </div>
          ) : userDevices.length > 0 ? (
            <div className="space-y-4">
              {userDevices.map((device, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{device.device_name || "Unknown Device"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {device.browser_info} • {device.os_info}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {device.is_blocked ? (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Blocked</span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">First Seen</p>
                      <p>{new Date(device.first_seen).toLocaleString("en-US")}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Last Seen</p>
                      <p>{new Date(device.last_seen).toLocaleString("en-US")}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Total Logins</p>
                      <p>{device.total_logins} times</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Screen Resolution</p>
                      <p>{device.screen_resolution || "Unknown"}</p>
                    </div>
                  </div>

                  {/* Current IP Addresses */}
                  {device.current_ips && device.current_ips.length > 0 && (
                    <div>
                      <p className="font-medium text-muted-foreground mb-2">Current IP Addresses</p>
                      <div className="flex flex-wrap gap-2">
                        {device.current_ips.map((ip: string, ipIndex: number) => (
                          <span key={ipIndex} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                            {ip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* IP History */}
                  {device.ip_history && device.ip_history.length > 0 && (
                    <div>
                      <p className="font-medium text-muted-foreground mb-2">IP History</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {device.ip_history.slice(0, 5).map((ip: any, ipIndex: number) => (
                          <div
                            key={ipIndex}
                            className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <code className="font-mono text-xs">{ip.ip_address}</code>
                              {ip.is_current && (
                                <span className="px-1 py-0.5 text-xs bg-green-100 text-green-800 rounded">Current</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              {ip.country && (
                                <span className="text-xs">{ip.city ? `${ip.city}, ${ip.country}` : ip.country}</span>
                              )}
                              <span className="text-xs">{new Date(ip.last_seen).toLocaleDateString("en-US")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active sessions found for this user</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SecuritySettingsForm({
  user,
  onSave,
  onCancel,
}: {
  user: AdminUser
  onSave: (userId: string, data: { status?: "active" | "suspended"; expirationDate?: string | null }) => void
  onCancel: () => void
}) {
  const [accountStatus, setAccountStatus] = useState<"active" | "suspended">(
    user.account_status === "suspended" ? "suspended" : "active",
  )
  const [expirationDate, setExpirationDate] = useState(user.expiration_date ? user.expiration_date.split("T")[0] : "")
  const [hasExpiration, setHasExpiration] = useState(!!user.expiration_date)

  const getCurrentStatus = () => {
    if (!user.is_approved) return "pending"
    if (user.account_status === "suspended") return "suspended"
    if (user.expiration_date && new Date(user.expiration_date) < new Date()) return "expired"
    if (!user.is_active) return "inactive"
    if (user.account_status === "active") return "active"
    return "inactive"
  }

  const currentStatus = getCurrentStatus()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data: { status?: "active" | "suspended"; expirationDate?: string | null } = {
      status: accountStatus,
    }

    if (hasExpiration && expirationDate) {
      data.expirationDate = new Date(expirationDate + "T23:59:59Z").toISOString()
    } else {
      data.expirationDate = null
    }

    console.log("[v0] SecuritySettingsForm submitting:", data)
    onSave(user.id, data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Current Status Display */}
      <div className="p-4 rounded-lg bg-muted/50">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium">Current Status</span>
        </div>
        <Badge variant={currentStatus === "active" ? "default" : "destructive"}>
          {currentStatus === "active"
            ? "Active"
            : currentStatus === "suspended"
              ? "Suspended"
              : currentStatus === "expired"
                ? "Expired"
                : currentStatus === "inactive"
                  ? "Inactive"
                  : "Pending"}
        </Badge>
        <div className="mt-2 text-xs text-muted-foreground">
          <p>is_active: {user.is_active ? "true" : "false"}</p>
          <p>account_status: {user.account_status}</p>
          {user.expiration_date && <p>expires: {new Date(user.expiration_date).toLocaleDateString()}</p>}
        </div>
      </div>

      {/* Account Status */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Account Status</Label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="active"
              checked={accountStatus === "active"}
              onChange={(e) => setAccountStatus(e.target.value as "active")}
              className="rounded border-border"
            />
            <span className="text-sm">Active - User can use the site</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="suspended"
              checked={accountStatus === "suspended"}
              onChange={(e) => setAccountStatus(e.target.value as "suspended")}
              className="rounded border-border"
            />
            <span className="text-sm">Suspended - User cannot use the site</span>
          </label>
        </div>
      </div>

      {/* Expiration Date */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasExpiration"
            checked={hasExpiration}
            onChange={(e) => setHasExpiration(e.target.checked)}
            className="rounded border-border"
          />
          <Label htmlFor="hasExpiration" className="text-base font-medium">
            মেয়াদ নির্ধারণ করুন
          </Label>
        </div>

        {hasExpiration && (
          <div className="space-y-2">
            <Label htmlFor="expirationDate" className="text-sm text-muted-foreground">
              মেয়াদ উত্তীর্ণের তারিখ
            </Label>
            <Input
              type="date"
              id="expirationDate"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required={hasExpiration}
            />
            <p className="text-xs text-muted-foreground">এই তারিখের পর ইউজার আর লগইন করতে পারবে না</p>
          </div>
        )}
      </div>

      {/* Warning Message */}
      <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
          <div className="text-xs text-orange-700">
            <p className="font-medium mb-1">সতর্কতা:</p>
            <p>এই পরিবর্তনগুলি সঙ্গে সঙ্গেই কার্যকর হবে। যদি ইউজার বর্তমানে লগইন করা থাকে, তাহলে সে তৎক্ষণাৎ লগআউট হয়ে যাবে।</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
        >
          সিকিউরিটি সেটিংস আপডেট করুন
        </Button>
      </div>
    </form>
  )
}

function EditUserForm({
  user,
  onSave,
  onCancel,
}: {
  user: AdminUser
  onSave: (user: AdminUser) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    email: user.email,
    is_active: user.is_active,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...user,
      ...formData,
      updated_at: new Date().toISOString(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">পূর্ণ নাম</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">ইমেইল ঠিকানা</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="user@gmail.com"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
          className="rounded border-border"
        />
        <Label htmlFor="is_active">ইউজার সক্রিয়</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          সংরক্ষণ করুন
        </Button>
      </div>
    </form>
  )
}

function CreateUserForm({
  onSave,
  onCancel,
}: {
  onSave: (userData: {
    full_name: string
    email: string
    is_active: boolean
    account_status: "active" | "suspended"
    expiration_date?: string | null
  }) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    is_active: true,
    account_status: "active" as "active" | "suspended",
    hasExpiration: false,
    expiration_date: "",
  })

  const [errors, setErrors] = useState<string[]>([])

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.full_name.trim()) {
      newErrors.push("Full name is required")
    }

    if (!formData.email.trim()) {
      newErrors.push("Email address is required")
    } else if (!/^[^\s@]+@gmail\.com$/.test(formData.email.toLowerCase())) {
      newErrors.push("Only Gmail addresses (@gmail.com) are accepted")
    }

    if (formData.hasExpiration && !formData.expiration_date) {
      newErrors.push("Expiration date is required")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const userData = {
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      is_active: formData.is_active,
      account_status: formData.account_status,
      expiration_date:
        formData.hasExpiration && formData.expiration_date
          ? new Date(formData.expiration_date + "T23:59:59Z").toISOString()
          : null,
    }

    console.log("[v0] Submitting new user form:", userData)
    onSave(userData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-medium mb-1">ত্রুটি:</p>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="create_full_name">পূর্ণ নাম *</Label>
          <Input
            id="create_full_name"
            value={formData.full_name}
            onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
            placeholder="ইউজারের পূর্ণ নাম লিখুন"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="create_email">ইমেইল ঠিকানা (শুধুমাত্র Gmail) *</Label>
          <Input
            id="create_email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="yourname@gmail.com"
            required
          />
          <p className="text-xs text-muted-foreground">শুধুমাত্র Gmail ঠিকানা (@gmail.com) গ্রহণযোগ্য</p>
        </div>
      </div>

      {/* Account Settings */}
      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-base font-medium">অ্যাকাউন্ট স্ট্যাটাস</Label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="active"
                checked={formData.account_status === "active"}
                onChange={(e) => setFormData((prev) => ({ ...prev, account_status: e.target.value as "active" }))}
                className="rounded border-border"
              />
              <span className="text-sm">সক্রিয় - ইউজার সাইট ব্যবহার করতে পারবে</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="suspended"
                checked={formData.account_status === "suspended"}
                onChange={(e) => setFormData((prev) => ({ ...prev, account_status: e.target.value as "suspended" }))}
                className="rounded border-border"
              />
              <span className="text-sm">সাসপেন্ড - ইউজার সাইট ব্যবহার করতে পারবে না</span>
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="create_is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
            className="rounded border-border"
          />
          <Label htmlFor="create_is_active">ইউজার সক্রিয় রাখুন</Label>
        </div>
      </div>

      {/* Expiration Settings */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="create_hasExpiration"
            checked={formData.hasExpiration}
            onChange={(e) => setFormData((prev) => ({ ...prev, hasExpiration: e.target.checked }))}
            className="rounded border-border"
          />
          <Label htmlFor="create_hasExpiration" className="text-base font-medium">
            মেয়াদ নির্ধারণ করুন
          </Label>
        </div>

        {formData.hasExpiration && (
          <div className="space-y-2">
            <Label htmlFor="create_expirationDate" className="text-sm text-muted-foreground">
              মেয়াদ উত্তীর্ণের তারিখ
            </Label>
            <Input
              type="date"
              id="create_expirationDate"
              value={formData.expiration_date}
              onChange={(e) => setFormData((prev) => ({ ...prev, expiration_date: e.target.value }))}
              min={new Date().toISOString().split("T")[0]}
              required={formData.hasExpiration}
            />
            <p className="text-xs text-muted-foreground">এই তারিখের পর ইউজার আর লগইন করতে পারবে না</p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          ইউজার তৈরি করুন
        </Button>
      </div>
    </form>
  )
}
