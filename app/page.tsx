import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to landing page as default
  redirect("/landing")
}
