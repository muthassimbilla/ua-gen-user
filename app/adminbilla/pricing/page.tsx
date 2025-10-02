"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Trash2, Plus, Save, X, DollarSign, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PricingPlan {
  id: string
  name: string
  price: string
  duration?: string
  original_price?: string
  discount?: string
  description?: string
  features: string[]
  is_popular: boolean
  icon?: string
  gradient: string
  display_order: number
  is_active: boolean
  plan_type: "landing" | "premium"
}

export default function AdminPricingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { admin, isLoading: authLoading } = useAdminAuth()
  const [allPlans, setAllPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (!authLoading && !admin) {
      router.push("/adminbilla/login")
      return
    }

    if (admin) {
      fetchPlans()
    }
  }, [admin, authLoading, router])

  async function fetchPlans() {
    try {
      setError(null)
      setLoading(true)

      const response = await fetch("/api/pricing-plans/admin")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setAllPlans(data.plans || [])
    } catch (error) {
      console.error("[v0] Error fetching plans:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setError(errorMessage)
      setAllPlans([])

      toast({
        title: "Error",
        description: `Failed to load pricing plans: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(plan: PricingPlan) {
    try {
      const method = isCreating ? "POST" : "PUT"
      const response = await fetch("/api/pricing-plans/admin", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save plan")
      }

      toast({
        title: "Success",
        description: `Pricing plan ${isCreating ? "created" : "updated"} successfully`,
      })

      setIsDialogOpen(false)
      setEditingPlan(null)
      setIsCreating(false)
      fetchPlans()
    } catch (error) {
      console.error("[v0] Error saving plan:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : `Failed to ${isCreating ? "create" : "update"} pricing plan`,
        variant: "destructive",
      })
    }
  }

  async function handleDelete(planId: string) {
    if (!confirm("Are you sure you want to delete this plan?")) return

    try {
      const response = await fetch(`/api/pricing-plans/admin?id=${planId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete plan")
      }

      toast({
        title: "Success",
        description: "Pricing plan deleted successfully",
      })

      fetchPlans()
    } catch (error) {
      console.error("[v0] Error deleting plan:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete pricing plan",
        variant: "destructive",
      })
    }
  }

  function openEditDialog(plan: PricingPlan) {
    setEditingPlan({ ...plan })
    setIsCreating(false)
    setIsDialogOpen(true)
  }

  function openCreateDialog() {
    setEditingPlan({
      id: "",
      name: "",
      price: "",
      duration: "month",
      original_price: "",
      discount: "",
      description: "",
      features: [""],
      is_popular: false,
      icon: "Zap",
      gradient: "from-blue-500 to-cyan-500",
      display_order: allPlans.length + 1,
      is_active: true,
      plan_type: "premium",
    })
    setIsCreating(true)
    setIsDialogOpen(true)
  }

  function updateEditingPlan(field: keyof PricingPlan, value: any) {
    if (!editingPlan) return
    setEditingPlan({ ...editingPlan, [field]: value })
  }

  function addFeature() {
    if (!editingPlan) return
    setEditingPlan({
      ...editingPlan,
      features: [...editingPlan.features, ""],
    })
  }

  function updateFeature(index: number, value: string) {
    if (!editingPlan) return
    const newFeatures = [...editingPlan.features]
    newFeatures[index] = value
    setEditingPlan({ ...editingPlan, features: newFeatures })
  }

  function removeFeature(index: number) {
    if (!editingPlan) return
    const newFeatures = editingPlan.features.filter((_, i) => i !== index)
    setEditingPlan({ ...editingPlan, features: newFeatures })
  }

  const PlanCard = ({ plan }: { plan: PricingPlan }) => (
    <Card className="relative">
      {plan.is_popular && <Badge className="absolute -top-2 -right-2 bg-purple-500">Most Popular</Badge>}
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{plan.name}</span>
            <Badge
              variant="outline"
              className={`text-xs ${
                plan.plan_type === "landing"
                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                  : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
              }`}
            >
              {plan.plan_type === "landing" ? "Landing" : "Premium"}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => openEditDialog(plan)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(plan.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{plan.price}</span>
            {plan.duration && <span className="text-muted-foreground">/ {plan.duration}</span>}
          </div>
          {plan.original_price && (
            <div className="flex items-center gap-2">
              <span className="text-sm line-through text-muted-foreground">{plan.original_price}</span>
              {plan.discount && (
                <Badge variant="secondary" className="text-xs">
                  {plan.discount}
                </Badge>
              )}
            </div>
          )}
          {plan.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}
          <div className="pt-4">
            <p className="text-sm font-semibold mb-2">Features:</p>
            <ul className="space-y-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <Badge variant={plan.is_active ? "default" : "secondary"}>{plan.is_active ? "Active" : "Inactive"}</Badge>
            <span className="text-xs text-muted-foreground">Order: {plan.display_order}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <p>Loading pricing plans...</p>
        <Button onClick={fetchPlans} variant="outline" disabled={loading}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="w-8 h-8" />
            Pricing Plans Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage all pricing plans from one place</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreateDialog} variant="default">
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
          <Button onClick={fetchPlans} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-500 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-red-700 dark:text-red-400">Error Loading Plans</p>
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
              </div>
              <Button onClick={fetchPlans} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Plans</p>
              <p className="text-2xl font-bold">{allPlans.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold">✓</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Plans</p>
              <p className="text-2xl font-bold">{allPlans.filter((p) => p.is_active).length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Pricing Plans</h2>
            <p className="text-sm text-muted-foreground">Manage pricing for landing page and premium tools</p>
          </div>
          <Badge variant="outline" className="ml-auto">
            {allPlans.length} plans
          </Badge>
        </div>
        {allPlans.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No pricing plans found</p>
            <Button onClick={openCreateDialog} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create First Plan
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Create New" : "Edit"} Pricing Plan</DialogTitle>
            <DialogDescription>
              {isCreating ? "Create a new pricing plan" : "Update the pricing plan details below"}
            </DialogDescription>
          </DialogHeader>

          {editingPlan && (
            <div className="space-y-4">
              <div>
                <Label>Plan Type</Label>
                <Select value={editingPlan.plan_type} onValueChange={(value) => updateEditingPlan("plan_type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landing">Landing Page</SelectItem>
                    <SelectItem value="premium">Premium Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Plan Name</Label>
                  <Input value={editingPlan.name} onChange={(e) => updateEditingPlan("name", e.target.value)} />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input value={editingPlan.price} onChange={(e) => updateEditingPlan("price", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration</Label>
                  <Input
                    value={editingPlan.duration || ""}
                    onChange={(e) => updateEditingPlan("duration", e.target.value)}
                    placeholder="e.g., month, 1 মাস"
                  />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={editingPlan.display_order}
                    onChange={(e) => updateEditingPlan("display_order", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Original Price (optional)</Label>
                  <Input
                    value={editingPlan.original_price || ""}
                    onChange={(e) => updateEditingPlan("original_price", e.target.value)}
                    placeholder="e.g., $99"
                  />
                </div>
                <div>
                  <Label>Discount (optional)</Label>
                  <Input
                    value={editingPlan.discount || ""}
                    onChange={(e) => updateEditingPlan("discount", e.target.value)}
                    placeholder="e.g., 20% off"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingPlan.description || ""}
                  onChange={(e) => updateEditingPlan("description", e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label>Gradient Classes</Label>
                <Input
                  value={editingPlan.gradient}
                  onChange={(e) => updateEditingPlan("gradient", e.target.value)}
                  placeholder="e.g., from-blue-500 to-cyan-500"
                />
              </div>

              <div>
                <Label>Icon (for landing page)</Label>
                <Input
                  value={editingPlan.icon || ""}
                  onChange={(e) => updateEditingPlan("icon", e.target.value)}
                  placeholder="e.g., Zap, Sparkles, Crown"
                />
              </div>

              <div>
                <Label className="mb-2 block">Features</Label>
                <div className="space-y-2">
                  {editingPlan.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(idx, e.target.value)}
                        placeholder="Feature description"
                      />
                      <Button size="sm" variant="destructive" onClick={() => removeFeature(idx)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={addFeature}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingPlan.is_popular}
                    onCheckedChange={(checked) => updateEditingPlan("is_popular", checked)}
                  />
                  <Label>Mark as Popular</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingPlan.is_active}
                    onCheckedChange={(checked) => updateEditingPlan("is_active", checked)}
                  />
                  <Label>Active</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleSave(editingPlan)} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {isCreating ? "Create Plan" : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingPlan(null)
                    setIsCreating(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
