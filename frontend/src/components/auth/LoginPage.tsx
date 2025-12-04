'use client'

import { useState } from 'react'
import { Shield, Fingerprint, Mail, Lock, Eye, EyeOff, Key, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'password' | 'sso' | 'webauthn'>('password')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // This will integrate with Zitadel OIDC
    // For now, just simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleSSOLogin = async (provider: string) => {
    setIsLoading(true)
    // Redirect to Zitadel SSO
    window.location.href = `${process.env.NEXT_PUBLIC_ZITADEL_DOMAIN}/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/callback&response_type=code&scope=openid%20profile%20email%20groups`
  }

  const handleWebAuthn = async () => {
    setIsLoading(true)
    // Implement WebAuthn authentication
    // This would call the backend API to initiate WebAuthn challenge
    try {
      // Placeholder for WebAuthn implementation
      console.log('WebAuthn authentication')
    } catch (error) {
      console.error('WebAuthn error:', error)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px]" />
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
        <div className="p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Neogenesys
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Zero Trust Access Portal
            </p>
          </div>

          {/* Login Method Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => setLoginMethod('password')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                loginMethod === 'password'
                  ? 'bg-white dark:bg-gray-800 shadow-sm'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Password</span>
            </button>
            <button
              onClick={() => setLoginMethod('sso')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                loginMethod === 'sso'
                  ? 'bg-white dark:bg-gray-800 shadow-sm'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <Key className="w-4 h-4" />
              <span className="text-sm font-medium">SSO</span>
            </button>
            <button
              onClick={() => setLoginMethod('webauthn')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                loginMethod === 'webauthn'
                  ? 'bg-white dark:bg-gray-800 shadow-sm'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <Fingerprint className="w-4 h-4" />
              <span className="text-sm font-medium">WebAuthn</span>
            </button>
          </div>

          {/* Password Login Form */}
          {loginMethod === 'password' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-6"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          )}

          {/* SSO Login Options */}
          {loginMethod === 'sso' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                Sign in with your organization account
              </p>
              <Button
                onClick={() => handleSSOLogin('zitadel')}
                disabled={isLoading}
                className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 py-6"
              >
                <Shield className="w-5 h-5 mr-2" />
                Continue with Zitadel SSO
              </Button>
              
              <Button
                onClick={() => handleSSOLogin('google')}
                disabled={isLoading}
                className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 py-6"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button
                onClick={() => handleSSOLogin('microsoft')}
                disabled={isLoading}
                className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 py-6"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23">
                  <path fill="#f25022" d="M0 0h11v11H0z"/>
                  <path fill="#00a4ef" d="M12 0h11v11H12z"/>
                  <path fill="#7fba00" d="M0 12h11v11H0z"/>
                  <path fill="#ffb900" d="M12 12h11v11H12z"/>
                </svg>
                Continue with Microsoft
              </Button>
            </div>
          )}

          {/* WebAuthn Login */}
          {loginMethod === 'webauthn' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full mb-4">
                  <Fingerprint className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Passwordless Authentication</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use your security key, fingerprint, or face recognition to sign in
                </p>
              </div>

              <Button
                onClick={handleWebAuthn}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-6"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5 mr-2" />
                    Authenticate with WebAuthn
                  </>
                )}
              </Button>

              <div className="text-center">
                <button
                  onClick={() => setLoginMethod('password')}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Use password instead
                </button>
              </div>
            </div>
          )}

          {/* MFA Notice */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Multi-Factor Authentication Required
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  After signing in, you'll be prompted for a second authentication factor for enhanced security.
                </p>
              </div>
            </div>
          </div>

          {/* Network Status Notice */}
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Netbird Connection Required
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Ensure your Netbird client is active and connected to access the dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>© 2024 Neogenesys. All rights reserved.</p>
            <p className="mt-1">Protected by Zero Trust architecture</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
