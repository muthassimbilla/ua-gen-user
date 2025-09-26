import { redirect } from "next/navigation"

export default function HomePage() {
  // Middleware will handle the redirect logic
  // This page should not be reached due to middleware redirects
  redirect("/login")
}
