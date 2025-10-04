import { AdminConditionalLayout } from "@/components/admin-conditional-layout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminConditionalLayout>
      {children}
    </AdminConditionalLayout>
  )
}
