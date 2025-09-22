"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Key, Users, Shield, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 pt-8">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Wrench className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Our Tools</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">আমাদের সম্পূর্ণ টুলস এবং সেবাসমূহ দেখুন</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Key className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Key Management</CardTitle>
                  <CardDescription>নিরাপদ Key ব্যবস্থাপনা</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                আপনার Key গুলো নিরাপদে সংরক্ষণ এবং ব্যবস্থাপনা করুন। Expiry tracking এবং automatic renewal সুবিধা।
              </p>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/login">ব্যবহার করুন</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">User Management</CardTitle>
                  <CardDescription>ব্যবহারকারী নিয়ন্ত্রণ</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Telegram integration সহ সম্পূর্ণ user management system। IP tracking এবং device restriction।
              </p>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/key-buy">শুরু করুন</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Shield className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Security Features</CardTitle>
                  <CardDescription>নিরাপত্তা ব্যবস্থা</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Advanced security monitoring, suspicious activity alerts, এবং comprehensive logging system।
              </p>
              <Button variant="outline" className="w-full bg-transparent" disabled>
                শীঘ্রই আসছে
              </Button>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
                  <CardDescription>পরিসংখ্যান ড্যাশবোর্ড</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Real-time analytics, user activity tracking, এবং comprehensive reporting system।
              </p>
              <Button variant="outline" className="w-full bg-transparent" disabled>
                শীঘ্রই আসছে
              </Button>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Settings className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Admin Panel</CardTitle>
                  <CardDescription>প্রশাসনিক প্যানেল</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                সম্পূর্ণ admin control panel user approval, key management, এবং system monitoring এর জন্য।
              </p>
              <Button variant="outline" className="w-full bg-transparent" disabled>
                Admin Only
              </Button>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10">
                  <Wrench className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">More Tools</CardTitle>
                  <CardDescription>আরও টুলস</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                আরও অনেক দরকারী টুলস এবং ফিচার আসছে। আপডেট পেতে আমাদের সাথে যুক্ত থাকুন।
              </p>
              <Button variant="outline" className="w-full bg-transparent" disabled>
                শীঘ্রই আসছে
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="text-center space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-foreground">যোগাযোগ</h2>
          <p className="text-muted-foreground">কোন সমস্যা বা প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন</p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/login">লগইন করুন</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/key-buy">Key কিনুন</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
