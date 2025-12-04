import { redirect } from 'next/navigation'
import LoginPage from '@/components/auth/LoginPage'

export default function Home() {
  // This would check if user is authenticated and redirect to dashboard
  // For now, we'll show the login page
  return <LoginPage />
}
