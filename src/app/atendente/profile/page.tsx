'use client'

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RankingCard } from "@/components/ranking/RankingCard"
import { RankingList } from "@/components/ranking/RankingList"
import { ProfileCard } from "@/components/ranking/ProfileCard"
import { AchievementsCard } from "@/components/ranking/AchievementsCard"
import { RankingService } from "@/services/ranking"
import { AtendenteStats, RankingPeriodo, ProfileInfo } from "@/types/ranking"
import { useRouter } from "next/navigation"

export default function AtendenteProfile() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<AtendenteStats | null>(null)
  const [ranking, setRanking] = useState<RankingPeriodo | null>(null)
  const [profile, setProfile] = useState<ProfileInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'atendente') {
      router.push('/auth/login')
      return
    }

    loadProfileData()
  }, [isAuthenticated, user, router])

  const loadProfileData = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [statsData, rankingData, profileData] = await Promise.all([
        RankingService.getAtendenteStats(user.id),
        RankingService.getRanking('geral'),
        RankingService.getProfileInfo(user.id)
      ])
      
      setStats(statsData)
      setRanking(rankingData)
      setProfile(profileData)
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || user?.role !== 'atendente') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Carregando...</h1>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando perfil...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Meu Perfil</h1>
            <p className="text-muted-foreground text-sm lg:text-base">Acompanhe seu desempenho e conquistas</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Button 
              onClick={() => router.push('/atendente/painel')} 
              variant="outline"
              className="cursor-pointer text-sm"
            >
              ← Voltar ao Painel
            </Button>
            <Button onClick={logout} variant="outline" className="cursor-pointer text-sm">
              Sair
            </Button>
          </div>
        </div>

        {/* Layout Principal - Baseado no wireframe */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Coluna Esquerda - Sobre o Atendente (1/4 da largura) */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Sobre o atendente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Informações básicas do perfil */}
                {profile && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#0891b2' }}>
                        {profile.nome.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold">{profile.nome}</h3>
                        <p className="text-sm text-muted-foreground">{profile.cargo}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">📧</span>
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">📅</span>
                        <span>Admitido em {profile.dataAdmissao.toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">🕒</span>
                        <span>Última atividade: {profile.ultimaAtividade.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* Especialidades */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Especialidades</h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.especialidades.map((especialidade, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {especialidade}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Sobre</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {profile.bio}
                      </p>
                    </div>
                  </div>
                )}

                {/* Estatísticas resumidas */}
                {stats && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Atendimentos realizados</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total:</span>
                        <span className="font-semibold">{stats.atendimentosRealizados}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avaliação:</span>
                        <span className="font-semibold">{stats.avaliacaoMedia.toFixed(1)} ⭐</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tempo médio:</span>
                        <span className="font-semibold">{stats.tempoMedioResposta}min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Satisfação:</span>
                        <span className="font-semibold">{stats.satisfacaoCliente}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Ranking (3/4 da largura) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Posição Atual do Atendente */}
            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Posição atual desse atendente no ranking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-6 rounded-lg border-2" style={{ backgroundColor: '#0891b210', borderColor: '#0891b2' }}>
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl font-bold" style={{ color: '#0891b2' }}>#{stats.posicaoRanking}</div>
                      <div>
                        <h3 className="text-xl font-semibold">{stats.name}</h3>
                        <p className="text-muted-foreground">{stats.nivel} • {stats.pontos.toLocaleString()} pontos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: '#0891b2' }}>{stats.avaliacaoMedia.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">Avaliação média</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ranking Principal */}
            {ranking && (
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <CardTitle>Ranking principal</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {ranking.ranking.length} atendentes no ranking
                  </p>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto space-y-3 pr-2">
                    {ranking.ranking.map((item) => (
                      <div
                        key={item.atendenteId}
                        className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 transition-colors ${
                          item.atendenteId === user.id
                            ? 'shadow-sm'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        style={item.atendenteId === user.id ? { backgroundColor: '#0891b210', borderColor: '#0891b2' } : {}}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                          <div className="text-lg sm:text-2xl font-bold text-gray-600 min-w-[30px] sm:min-w-[40px] text-center flex-shrink-0">
                            {item.posicao === 1 ? '🥇' : item.posicao === 2 ? '🥈' : item.posicao === 3 ? '🥉' : `#${item.posicao}`}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.nome}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {item.nivel} • {item.atendimentosRealizados} atendimentos
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="text-sm sm:text-lg font-bold" style={{ color: '#0891b2' }}>
                            {item.pontos.toLocaleString()}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {item.avaliacaoMedia.toFixed(1)} ⭐
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
