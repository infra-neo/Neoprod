'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Shield, Users, ArrowLeft, Save, Key, Bell, Globe, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

interface MockUser {
  email: string
  name: string
  groups: string[]
  authMethod: string
}

interface ProfileSettings {
  notifications: boolean
  darkMode: boolean
  language: string
  twoFactor: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<MockUser | null>(null)
  const [settings, setSettings] = useState<ProfileSettings>({
    notifications: true,
    darkMode: false,
    language: 'es',
    twoFactor: false
  })
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

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
      setFormData({
        name: userData.name,
        email: userData.email
      })
      
      // Load settings from localStorage
      const savedSettings = localStorage.getItem('profileSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/')
    }
  }, [router])

  const handleSaveProfile = () => {
    if (!user) return
    
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email
    }
    
    localStorage.setItem('mockUser', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
  }

  const handleSettingChange = (key: keyof ProfileSettings, value: boolean | string) => {
    const newSettings = {
      ...settings,
      [key]: value
    }
    setSettings(newSettings)
    localStorage.setItem('profileSettings', JSON.stringify(newSettings))
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Mi Perfil
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Gestiona tu información personal</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Info Card */}
        <Card className="mb-6 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Información Personal
            </h2>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Guardar cambios
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
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
            </div>
          )}
        </Card>

        {/* Groups Card */}
        <Card className="mb-6 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Grupos y Permisos
          </h2>
          <div className="flex flex-wrap gap-2">
            {user.groups.map((group, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                {group}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Los grupos determinan a qué aplicaciones y recursos tienes acceso dentro del sistema.
          </p>
        </Card>

        {/* Settings Card */}
        <Card className="mb-6 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Configuración de Preferencias
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Notificaciones</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Recibir notificaciones del sistema
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {settings.darkMode ? (
                  <Moon className="w-5 h-5 text-gray-500" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-500" />
                )}
                <div>
                  <p className="font-medium">Modo Oscuro</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Usar tema oscuro
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Idioma</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Idioma de la interfaz
                  </p>
                </div>
              </div>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Autenticación de dos factores</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seguridad adicional para tu cuenta
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.twoFactor}
                onCheckedChange={(checked) => handleSettingChange('twoFactor', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Security Info */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Seguridad de tu cuenta
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
            Tu cuenta está protegida mediante {user.authMethod === 'mock' ? 'autenticación de desarrollo' : 'Zitadel OIDC'}. 
            Todos los accesos son monitoreados y registrados.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white dark:bg-gray-800">
              Ver historial de acceso
            </Button>
            <Button variant="outline" size="sm" className="bg-white dark:bg-gray-800">
              Cambiar contraseña
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
