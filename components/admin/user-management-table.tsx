"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Search, MoreHorizontal, UserCheck, UserX, Edit, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  email: string
  full_name?: string
  telegram_username?: string
  user_agent_limit: number
  subscription_end_date?: string
  status: "pending" | "approved" | "rejected" | "suspended"
  role: "user" | "admin" | "super_admin"
  created_at: string
  approved_at?: string
  last_login?: string
}

interface UserManagementTableProps {
  statusFilter?: "pending" | "approved" | "rejected" | "suspended" | "all"
}

export function UserManagementTable({ statusFilter = "all" }: UserManagementTableProps) {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectingUser, setRejectingUser] = useState<UserProfile | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [statusFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      let query = supabase.from("user_profiles").select("*").order("created_at", { ascending: false })

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "ইউজার ডেটা লোড করতে সমস্যা হয়েছে",
          variant: "destructive",
        })
        return
      }

      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("Error approving user:", error)
        toast({
          title: "Error",
          description: "ইউজার অনুমোদনে সমস্যা হয়েছে",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "ইউজার সফলভাবে অনুমোদিত হয়েছে",
      })

      fetchUsers()
    } catch (error) {
      console.error("Error approving user:", error)
    }
  }

  const handleRejectUser = async (userId: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          status: "rejected",
          rejection_reason: reason || "No reason provided",
          rejected_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("Error rejecting user:", error)
        toast({
          title: "Error",
          description: "ইউজার প্রত্যাখ্যানে সমস্যা হয়েছে",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "ইউজার প্রত্যাখ্যাত হয়েছে",
      })

      setRejectDialogOpen(false)
      setRejectingUser(null)
      setRejectReason("")
      fetchUsers()
    } catch (error) {
      console.error("Error rejecting user:", error)
    }
  }

  const handleSuspendUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          status: "suspended",
          suspended_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("Error suspending user:", error)
        toast({
          title: "Error",
          description: "ইউজার স্থগিত করতে সমস্যা হয়েছে",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "ইউজার স্থগিত করা হয়েছে",
      })

      fetchUsers()
    } catch (error) {
      console.error("Error suspending user:", error)
    }
  }

  const handleEditUser = async () => {
    if (!editingUser) return

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          full_name: editingUser.full_name,
          telegram_username: editingUser.telegram_username,
          user_agent_limit: editingUser.user_agent_limit,
          role: editingUser.role,
        })
        .eq("id", editingUser.id)

      if (error) {
        console.error("Error updating user:", error)
        toast({
          title: "Error",
          description: "ইউজার আপডেট করতে সমস্যা হয়েছে",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "ইউজার সফলভাবে আপডেট হয়েছে",
      })

      setEditDialogOpen(false)
      setEditingUser(null)
      fetchUsers()
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleBulkAction = async (action: "approve" | "reject" | "suspend") => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Warning",
        description: "কোন ইউজার নির্বাচিত নেই",
        variant: "destructive",
      })
      return
    }

    setBulkActionLoading(true)

    try {
      let updateData: any = {}

      if (action === "approve") {
        updateData = { status: "approved", approved_at: new Date().toISOString() }
      } else if (action === "reject") {
        updateData = { status: "rejected", rejection_reason: "Bulk rejection", rejected_at: new Date().toISOString() }
      } else if (action === "suspend") {
        updateData = { status: "suspended", suspended_at: new Date().toISOString() }
      }

      const { error } = await supabase.from("user_profiles").update(updateData).in("id", selectedUsers)

      if (error) {
        console.error("Error in bulk action:", error)
        toast({
          title: "Error",
          description: "Bulk action এ সমস্যা হয়েছে",
          variant: "destructive",
        })
        return
      }

      const actionText = action === "approve" ? "অনুমোদন" : action === "reject" ? "প্রত্যাখ্যান" : "স্থগিত"
      toast({
        title: "Success",
        description: `${selectedUsers.length}টি ইউজারের জন্য ${actionText} সম্পন্ন হয়েছে`,
      })

      setSelectedUsers([])
      fetchUsers()
    } catch (error) {
      console.error("Error in bulk action:", error)
      toast({
        title: "Error",
        description: "Bulk action এ সমস্যা হয়েছে",
        variant: "destructive",
      })
    } finally {
      setBulkActionLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.telegram_username?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "অপেক্ষমান", variant: "secondary" as const },
      approved: { label: "অনুমোদিত", variant: "default" as const },
      rejected: { label: "প্রত্যাখ্যাত", variant: "destructive" as const },
      suspended: { label: "স্থগিত", variant: "outline" as const },
    }

    const statusInfo = statusMap[status as keyof typeof statusMap]
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const getRoleBadge = (role: string) => {
    const roleMap = {
      user: { label: "ইউজার", variant: "secondary" as const },
      admin: { label: "অ্যাডমিন", variant: "default" as const },
      super_admin: { label: "সুপার অ্যাডমিন", variant: "destructive" as const },
    }

    const roleInfo = roleMap[role as keyof typeof roleMap]
    return <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>ইউজার ম্যানেজমেন্ট ({filteredUsers.length})</CardTitle>

            {/* Search and bulk actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ইমেইল বা নাম দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction("approve")}
                    disabled={bulkActionLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <UserCheck className="mr-1 h-3 w-3" />
                    অনুমোদন ({selectedUsers.length})
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkAction("reject")}
                    disabled={bulkActionLoading}
                  >
                    <UserX className="mr-1 h-3 w-3" />
                    প্রত্যাখ্যান ({selectedUsers.length})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("suspend")}
                    disabled={bulkActionLoading}
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    স্থগিত ({selectedUsers.length})
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredUsers.length === 0 ? (
            <Alert>
              <AlertDescription>কোন ইউজার পাওয়া যায়নি।</AlertDescription>
            </Alert>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedUsers.length === filteredUsers.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>ইমেইল</TableHead>
                    <TableHead>নাম</TableHead>
                    <TableHead>Telegram</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead>রোল</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>তারিখ</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleSelectUser(user.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.full_name || "N/A"}</TableCell>
                      <TableCell>{user.telegram_username || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{user.user_agent_limit}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString("bn-BD")}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingUser(user)
                                setEditDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              সম্পাদনা করুন
                            </DropdownMenuItem>

                            {user.status === "pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleApproveUser(user.id)} className="text-green-600">
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  অনুমোদন করুন
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setRejectingUser(user)
                                    setRejectDialogOpen(true)
                                  }}
                                  className="text-red-600"
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  প্রত্যাখ্যান করুন
                                </DropdownMenuItem>
                              </>
                            )}

                            {user.status === "rejected" && (
                              <DropdownMenuItem onClick={() => handleApproveUser(user.id)} className="text-green-600">
                                <UserCheck className="mr-2 h-4 w-4" />
                                অনুমোদন করুন
                              </DropdownMenuItem>
                            )}

                            {user.status === "approved" && (
                              <DropdownMenuItem onClick={() => handleSuspendUser(user.id)} className="text-orange-600">
                                <Clock className="mr-2 h-4 w-4" />
                                স্থগিত করুন
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ইউজার সম্পাদনা করুন</DialogTitle>
            <DialogDescription>ইউজারের তথ্য আপডেট করুন</DialogDescription>
          </DialogHeader>

          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">পূর্ণ নাম</Label>
                <Input
                  id="fullName"
                  value={editingUser.full_name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="telegramUsername">Telegram Username</Label>
                <Input
                  id="telegramUsername"
                  value={editingUser.telegram_username || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, telegram_username: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="userAgentLimit">User Agent Limit</Label>
                <Input
                  id="userAgentLimit"
                  type="number"
                  value={editingUser.user_agent_limit}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, user_agent_limit: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <Label htmlFor="role">রোল</Label>
                <select
                  id="role"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full p-2 border rounded"
                >
                  <option value="user">ইউজার</option>
                  <option value="admin">অ্যাডমিন</option>
                  <option value="super_admin">সুপার অ্যাডমিন</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              বাতিল
            </Button>
            <Button onClick={handleEditUser}>আপডেট করুন</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ইউজার প্রত্যাখ্যান করুন</DialogTitle>
            <DialogDescription>প্রত্যাখ্যানের কারণ লিখুন (ঐচ্ছিক)</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectReason">প্রত্যাখ্যানের কারণ</Label>
              <Textarea
                id="rejectReason"
                placeholder="কারণ লিখুন..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              বাতিল
            </Button>
            <Button
              variant="destructive"
              onClick={() => rejectingUser && handleRejectUser(rejectingUser.id, rejectReason)}
            >
              প্রত্যাখ্যান করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
