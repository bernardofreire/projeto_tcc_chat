'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { User, LoginCredentials } from '@/types/user'
import { AuthService } from '@/services/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verifica se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setLoading(true)
    try {
      const response = await AuthService.login(credentials)
      
      if (response.error) {
        setLoading(false)
        return { success: false, error: response.error }
      }
      
      if (response.user) {
        setUser(response.user)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        // Redireciona baseado no tipo de usuário
        const redirectPath = AuthService.getRedirectPath(response.user.role)
        router.push(redirectPath)
        
        setLoading(false)
        return { success: true }
      }
      
      setLoading(false)
      return { success: false, error: 'Erro desconhecido' }
    } catch (error) {
      setLoading(false)
      return { success: false, error: 'Erro de conexão. Tente novamente.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
