'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Settings, Users, Activity, Database, Box, Code, BarChart, FileText, ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Application {
  id: string
  name: string
  description: string
  url: string
  icon: string
  category: string
  status: 'running' | 'stopped'
  container: string
}

interface MockUser {
  email: string
  name: string
  groups: string[]
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<MockUser | null>(null)
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    // Check if user is authenticated and is admin
    const mockUserData = localStorage.getItem('mockUser')
    if (!mockUserData) {
      router.push('/')
      return
    }
    
    try {
      const userData = JSON.parse(mockUserData)
      if (!userData.groups.includes('admin')) {
        router.push('/dashboard')
        return
      }
      setUser(userData)
      
      // Load applications from backend
      loadApplications()
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/')
    }
  }, [router])

  const loadApplications = async () => {
    // In production, this would call the backend API
    const apps: Application[] = [
      {
        id: 'app1',
        name: 'Echo Server',
        description: 'HTTP echo server for testing',
        url: 'http://localhost:8080',
        icon: '📡',
        category: 'Testing',
        status: 'running',
        container: 'test-app1'
      },
      {
        id: 'app2',
        name: 'Static Site',
        description: 'Nginx static web application',
        url: 'http://localhost:8081',
        icon: '🌐',
        category: 'Web Apps',
        status: 'running',
        container: 'test-app2'
      },
      {
        id: 'whoami',
        name: 'Identity Checker',
        description: 'Check your identity and headers',
        url: 'http://localhost:8082',
        icon: '🔍',
        category: 'Testing',
        status: 'running',
        container: 'test-whoami'
      },
      {
        id: 'filebrowser',
        name: 'File Browser',
        description: 'Browse and manage files',
        url: 'http://localhost:8083',
        icon: '📁',
        category: 'Tools',
        status: 'running',
        container: 'test-filebrowser'
      },
      {
        id: 'code-server',
        name: 'VS Code',
        description: 'Web-based code editor',
        url: 'http://localhost:8084',
        icon: '💻',
        category: 'Development',
        status: 'running',
        container: 'test-code-server'
      },
      {
        id: 'grafana',
        name: 'Grafana',
        description: 'Metrics and dashboards',
        url: 'http://localhost:8085',
        icon: '📊',
        category: 'Monitoring',
        status: 'running',
        container: 'test-grafana'
      },
      {
        id: 'portainer',
        name: 'Portainer',
        description: 'Container management interface',
        url: 'http://localhost:8086',
        icon: '🐳',
        category: 'Infrastructure',
        status: 'running',
        container: 'test-portainer'
      },
      {
        id: 'uptime-kuma',
        name: 'Uptime Kuma',
        description: 'Uptime monitoring',
        url: 'http://localhost:8087',
        icon: '📈',
        category: 'Monitoring',
        status: 'running',
        container: 'test-uptime-kuma'
      },
      {
        id: 'wekan',
        name: 'Wekan',
        description: 'Kanban project management',
        url: 'http://localhost:8088',
        icon: '📋',
        category: 'Collaboration',
        status: 'running',
        container: 'test-wekan'
      },
      {
        id: 'drawio',
        name: 'Draw.io',
        description: 'Diagram and flowchart editor',
        url: 'http://localhost:8089',
        icon: '✏️',
        category: 'Tools',
        status: 'running',
        container: 'test-drawio'
      }
    ]
    setApplications(apps)
  }

  const getIconComponent = (category: string) => {
    const icons: { [key: string]: any } = {
      'Testing': Activity,
      'Web Apps': Box,
      'Tools': FileText,
      'Development': Code,
      'Monitoring': BarChart,
      'Infrastructure': Database,
      'Collaboration': Users
    }
    return icons[category] || Box
  }

  const categories = Array.from(new Set(applications.map(app => app.category)))

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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Admin Console
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Gestión de aplicaciones y configuración</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-red-600" />
              <span className="font-medium">{user.email}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Apps</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
              <Box className="w-10 h-10 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Running</p>
                <p className="text-2xl font-bold text-green-600">
                  {applications.filter(a => a.status === 'running').length}
                </p>
              </div>
              <Activity className="w-10 h-10 text-green-600" />
            </div>
          </Card>
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <Database className="w-10 h-10 text-purple-600" />
            </div>
          </Card>
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admin Users</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <Users className="w-10 h-10 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Applications by Category */}
        {categories.map(category => {
          const categoryApps = applications.filter(app => app.category === category)
          const IconComponent = getIconComponent(category)
          
          return (
            <div key={category} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <IconComponent className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold">{category}</h2>
                <span className="text-sm text-gray-500">({categoryApps.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryApps.map(app => (
                  <Card
                    key={app.id}
                    className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{app.icon}</div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === 'running'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                      }`}>
                        {app.status}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{app.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {app.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-4 font-mono">
                      {app.container}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 flex items-center gap-2"
                        onClick={() => window.open(app.url, '_blank')}
                        disabled={app.status !== 'running'}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Abrir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}

        {/* Docker Info */}
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Información de Docker
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Network:</span>
              <span className="font-mono">pomerium-network</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Compose File:</span>
              <span className="font-mono">/configs/test-apps/docker-compose.yml</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Containers:</span>
              <span className="font-mono">{applications.length + 1} (+ MongoDB)</span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
