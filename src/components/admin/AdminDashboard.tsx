'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { UserService } from '@/services/user'

interface DashboardStats {
  totalUsers: number
  admins: number
  atendentes: number
  clientes: number
  atendentesAtivos: number
  chatsAtivos: number
  avaliacaoMedia: number
  satisfacaoGeral: number
  tempoMedioResposta: number
  atendimentosHoje: number
  atendimentosSemana: number
  atendimentosMes: number
}

interface RecentActivity {
  id: string
  type: 'user_created' | 'user_updated' | 'chat_started' | 'chat_ended' | 'rating_given'
  description: string
  timestamp: Date
  user?: string
}

// Mock data para atividades recentes
const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'user_created',
    description: 'Novo atendente cadastrado',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
    user: 'Maria Santos'
  },
  {
    id: '2',
    type: 'rating_given',
    description: 'Avaliação 5 estrelas recebida',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min atrás
    user: 'João Silva'
  },
  {
    id: '3',
    type: 'chat_ended',
    description: 'Chat finalizado com sucesso',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1h atrás
    user: 'Pedro Costa'
  },
  {
    id: '4',
    type: 'user_updated',
    description: 'Perfil de usuário atualizado',
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5h atrás
    user: 'Ana Oliveira'
  }
]

interface AdminDashboardProps {
  onStatsUpdate?: () => void
}

export function AdminDashboard({ onStatsUpdate }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    admins: 0,
    atendentes: 0,
    clientes: 0,
    atendentesAtivos: 2,
    chatsAtivos: 3,
    avaliacaoMedia: 4.8,
    satisfacaoGeral: 94,
    tempoMedioResposta: 2.8,
    atendimentosHoje: 12,
    atendimentosSemana: 78,
    atendimentosMes: 324
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Carrega estatísticas de usuários
      const userStats = await UserService.getUsersStats()
      
      // Simula carregamento de outras estatísticas
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setStats(prev => ({
        ...prev,
        ...userStats
      }))
      
      setRecentActivity(mockRecentActivity)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created': return '👤'
      case 'user_updated': return '✏️'
      case 'chat_started': return '💬'
      case 'chat_ended': return '✅'
      case 'rating_given': return '⭐'
      default: return '📝'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_created': return 'text-green-600'
      case 'user_updated': return 'text-blue-600'
      case 'chat_started': return 'text-purple-600'
      case 'chat_ended': return 'text-green-600'
      case 'rating_given': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Agora mesmo'
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d atrás`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Administrativo</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.atendentes} atendentes, {stats.clientes} clientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendentes Ativos</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.atendentesAtivos}</div>
            <p className="text-xs text-muted-foreground">
              de {stats.atendentes} cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chats Ativos</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.chatsAtivos}</div>
            <p className="text-xs text-muted-foreground">
              Conversas em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avaliacaoMedia}</div>
            <p className="text-xs text-muted-foreground">
              Nota média dos atendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Geral</CardTitle>
            <CardDescription>Métricas de qualidade do atendimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Satisfação do Cliente</span>
                <span>{stats.satisfacaoGeral}%</span>
              </div>
              <Progress value={stats.satisfacaoGeral} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tempo Médio de Resposta</span>
                <span>{stats.tempoMedioResposta}min</span>
              </div>
              <Progress value={Math.max(100 - (stats.tempoMedioResposta * 20), 0)} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Atendimentos Hoje</span>
                <span>{stats.atendimentosHoje}</span>
              </div>
              <Progress value={(stats.atendimentosHoje / 20) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atendimentos por Período</CardTitle>
            <CardDescription>Volume de atendimentos realizados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Hoje</span>
              <Badge variant="outline">{stats.atendimentosHoje}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Esta Semana</span>
              <Badge variant="outline">{stats.atendimentosSemana}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Este Mês</span>
              <Badge variant="outline">{stats.atendimentosMes}</Badge>
            </div>
            <div className="pt-2">
              <div className="text-xs text-muted-foreground mb-1">Média Diária (30 dias)</div>
              <div className="text-lg font-semibold">
                {Math.round(stats.atendimentosMes / 30)} atendimentos/dia
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas ações no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="text-lg">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  {activity.user && (
                    <p className="text-xs text-muted-foreground">
                      Usuário: {activity.user}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className={`text-xs font-medium ${getActivityColor(activity.type)}`}>
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


