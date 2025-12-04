'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, LogOut, User, Mail, Users, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface MockUser {
  email: string
  name: string
  groups: string[]
  authenticated: boolean
  authMethod: string
  provider?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<MockUser | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const mockUserData = localStorage.getItem('mockUser')
    if (!mockUserData) {
      router.push('/')
      return
    }
    
    try {
      const userData = JSON.parse(mockUserData)
      setUser(userData)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('mockUser')
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Neogenesys Dashboard
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Zero Trust Access Portal</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Banner */}
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">
                ¡Autenticación exitosa!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Has iniciado sesión correctamente en modo {user.authMethod === 'mock' ? 'desarrollo' : user.authMethod}
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="mb-6 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Información del Usuario
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Método de Autenticación</p>
                <p className="font-medium capitalize">{user.authMethod}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-500 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Grupos</p>
                <div className="flex flex-wrap gap-2">
                  {user.groups.map((group, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Applications Grid */}
        <h2 className="text-2xl font-bold mb-4">Aplicaciones Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* System Apps */}
          {user.groups.includes('admin') && (
            <Card 
              className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push('/admin')}
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Admin Console</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Gestión de aplicaciones y configuración del sistema
              </p>
              <Button className="w-full">Acceder</Button>
            </Card>
          )}

          {/* Profile - Always show */}
          <Card 
            className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push('/profile')}
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Mi Perfil</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Gestiona tu información personal y preferencias
            </p>
            <Button className="w-full">Acceder</Button>
          </Card>

          {/* Test Apps */}
          {(user.groups.includes('app1-users') || user.groups.includes('admin')) && (
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">📡</div>
              <h3 className="text-lg font-semibold mb-2">Echo Server</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                HTTP echo server para testing
              </p>
              <Button className="w-full" onClick={() => window.open('http://localhost:8080', '_blank')}>
                Acceder
              </Button>
            </Card>
          )}

          {(user.groups.includes('app2-users') || user.groups.includes('admin')) && (
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="text-lg font-semibold mb-2">Static Site</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Aplicación web estática con Nginx
              </p>
              <Button className="w-full" onClick={() => window.open('http://localhost:8081', '_blank')}>
                Acceder
              </Button>
            </Card>
          )}

          {(user.groups.includes('pomerium-users') || user.groups.includes('admin')) && (
            <>
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">Identity Checker</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Verifica tu identidad y headers
                </p>
                <Button className="w-full" onClick={() => window.open('http://localhost:8082', '_blank')}>
                  Acceder
                </Button>
              </Card>

              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">✏️</div>
                <h3 className="text-lg font-semibold mb-2">Draw.io</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Editor de diagramas y flujos
                </p>
                <Button className="w-full" onClick={() => window.open('http://localhost:8089', '_blank')}>
                  Acceder
                </Button>
              </Card>
            </>
          )}

          {(user.groups.includes('developers') || user.groups.includes('admin')) && (
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">💻</div>
              <h3 className="text-lg font-semibold mb-2">VS Code</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Editor de código web
              </p>
              <Button className="w-full" onClick={() => window.open('http://localhost:8084', '_blank')}>
                Acceder
              </Button>
            </Card>
          )}

          {(user.groups.includes('monitoring') || user.groups.includes('admin')) && (
            <>
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">Grafana</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Métricas y dashboards
                </p>
                <Button className="w-full" onClick={() => window.open('http://localhost:8085', '_blank')}>
                  Acceder
                </Button>
              </Card>

              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">📈</div>
                <h3 className="text-lg font-semibold mb-2">Uptime Kuma</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Monitoreo de uptime
                </p>
                <Button className="w-full" onClick={() => window.open('http://localhost:8087', '_blank')}>
                  Acceder
                </Button>
              </Card>
            </>
          )}

          {(user.groups.includes('project-managers') || user.groups.includes('admin')) && (
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-lg font-semibold mb-2">Wekan</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Gestión de proyectos Kanban
              </p>
              <Button className="w-full" onClick={() => window.open('http://localhost:8088', '_blank')}>
                Acceder
              </Button>
            </Card>
          )}

          {user.groups.includes('admin') && (
            <>
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">📁</div>
                <h3 className="text-lg font-semibold mb-2">File Browser</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Gestor de archivos web
                </p>
                <Button className="w-full" onClick={() => window.open('http://localhost:8083', '_blank')}>
                  Acceder
                </Button>
              </Card>

              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">🐳</div>
                <h3 className="text-lg font-semibold mb-2">Portainer</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Gestión de contenedores
                </p>
                <Button className="w-full" onClick={() => window.open('http://localhost:8086', '_blank')}>
                  Acceder
                </Button>
              </Card>
            </>
          )}
        </div>

        {/* Development Notice */}
        {user.authMethod.includes('mock') && (
          <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              🔧 Modo Desarrollo Activo
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
              Estás usando autenticación simulada. En producción, esto usará Zitadel OIDC real.
            </p>
            <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded p-3 text-xs font-mono">
              <p>NEXT_PUBLIC_MOCK_AUTH=true</p>
              <p>Usuario: {user.email}</p>
              <p>Grupos: {user.groups.join(', ')}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
