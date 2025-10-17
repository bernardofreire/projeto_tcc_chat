'use client'

import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        // Redireciona baseado no tipo de usuário
        const redirectPath = user.role === 'admin' ? '/admin/dashboard' :
                           user.role === 'atendente' ? '/atendente/painel' :
                           user.role === 'cliente' ? '/cliente/chat' : '/auth/login'
        router.push(redirectPath)
      } else {
        router.push('/auth/login')
      }
    }
  }, [isAuthenticated, user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Carregando...</h1>
        </div>
      </div>
    )
  }

  return null
}
