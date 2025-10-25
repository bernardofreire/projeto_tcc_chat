'use client'

import { useState, useEffect } from 'react'
import { AtendenteStats, RankingItem } from '@/types/ranking'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

// Mock data para o ranking
const mockRankingData: AtendenteStats[] = [
  {
    id: '2',
    name: 'João Silva',
    nivel: 'Expert',
    pontos: 2450,
    posicaoRanking: 1,
    atendimentosRealizados: 156,
    avaliacaoMedia: 4.9,
    totalAvaliacoes: 142,
    tempoMedioResposta: 2.5,
    satisfacaoCliente: 96,
    badges: [
      {
        id: '1',
        nome: 'Atendimento Excelente',
        descricao: 'Manteve avaliação 5 estrelas por 30 dias',
        icone: '⭐',
        cor: 'gold',
        dataConquista: new Date('2024-01-15')
      },
      {
        id: '2',
        nome: 'Resposta Rápida',
        descricao: 'Tempo médio de resposta abaixo de 3 minutos',
        icone: '⚡',
        cor: 'blue',
        dataConquista: new Date('2024-02-01')
      }
    ],
    conquistas: [
      {
        id: '1',
        titulo: '100 Atendimentos',
        descricao: 'Realize 100 atendimentos',
        progresso: 156,
        meta: 100,
        tipo: 'atendimentos',
        icone: '💬'
      }
    ]
  },
  {
    id: '3',
    name: 'Maria Santos',
    nivel: 'Avançado',
    pontos: 1980,
    posicaoRanking: 2,
    atendimentosRealizados: 98,
    avaliacaoMedia: 4.7,
    totalAvaliacoes: 89,
    tempoMedioResposta: 3.2,
    satisfacaoCliente: 92,
    badges: [
      {
        id: '3',
        nome: 'Cliente Satisfeito',
        descricao: 'Taxa de satisfação acima de 90%',
        icone: '😊',
        cor: 'green',
        dataConquista: new Date('2024-01-20')
      }
    ],
    conquistas: [
      {
        id: '2',
        titulo: '50 Atendimentos',
        descricao: 'Realize 50 atendimentos',
        progresso: 98,
        meta: 50,
        tipo: 'atendimentos',
        icone: '💬'
      }
    ]
  }
]

interface AdminRankingProps {
  onStatsUpdate?: () => void
}

export function AdminRanking({ onStatsUpdate }: AdminRankingProps) {
  const [rankingData, setRankingData] = useState<AtendenteStats[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'semanal' | 'mensal' | 'geral'>('geral')

  useEffect(() => {
    loadRankingData()
  }, [selectedPeriod])

  const loadRankingData = async () => {
    try {
      setLoading(true)
      // Simula carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 800))
      setRankingData(mockRankingData)
    } catch (error) {
      console.error('Erro ao carregar ranking:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNivelColor = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case 'expert': return 'bg-yellow-100 text-yellow-800'
      case 'avançado': return 'bg-blue-100 text-blue-800'
      case 'intermediário': return 'bg-green-100 text-green-800'
      case 'iniciante': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPosicaoIcon = (posicao: number) => {
    switch (posicao) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${posicao}`
    }
  }

  const getSatisfacaoColor = (satisfacao: number) => {
    if (satisfacao >= 90) return 'text-green-600'
    if (satisfacao >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Atendentes</CardTitle>
          <CardDescription>Carregando dados do ranking...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros de Período */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Ranking de Atendentes</CardTitle>
              <CardDescription>
                Visualize o desempenho dos atendentes baseado em avaliações e métricas
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedPeriod === 'semanal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('semanal')}
              >
                Semanal
              </Button>
              <Button
                variant={selectedPeriod === 'mensal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('mensal')}
              >
                Mensal
              </Button>
              <Button
                variant={selectedPeriod === 'geral' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('geral')}
              >
                Geral
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{rankingData.length}</div>
            <p className="text-sm text-muted-foreground">Atendentes Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {(rankingData.reduce((acc, curr) => acc + curr.avaliacaoMedia, 0) / rankingData.length).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">Avaliação Média</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {rankingData.reduce((acc, curr) => acc + curr.atendimentosRealizados, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Atendimentos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {(rankingData.reduce((acc, curr) => acc + curr.satisfacaoCliente, 0) / rankingData.length).toFixed(0)}%
            </div>
            <p className="text-sm text-muted-foreground">Satisfação Média</p>
          </CardContent>
        </Card>
      </div>

      {/* Ranking Detalhado */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking Detalhado - {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rankingData.map((atendente, index) => (
              <div key={atendente.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {getPosicaoIcon(atendente.posicaoRanking)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{atendente.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getNivelColor(atendente.nivel)}>
                          {atendente.nivel}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {atendente.pontos} pontos
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">
                      {atendente.avaliacaoMedia.toFixed(1)} ⭐
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {atendente.totalAvaliacoes} avaliações
                    </p>
                  </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Atendimentos</span>
                      <span>{atendente.atendimentosRealizados}</span>
                    </div>
                    <Progress value={Math.min((atendente.atendimentosRealizados / 200) * 100, 100)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tempo Médio</span>
                      <span>{atendente.tempoMedioResposta}min</span>
                    </div>
                    <Progress value={Math.max(100 - (atendente.tempoMedioResposta * 20), 0)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Satisfação</span>
                      <span className={getSatisfacaoColor(atendente.satisfacaoCliente)}>
                        {atendente.satisfacaoCliente}%
                      </span>
                    </div>
                    <Progress value={atendente.satisfacaoCliente} />
                  </div>
                </div>

                {/* Badges */}
                {atendente.badges.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Conquistas Recentes</h4>
                    <div className="flex flex-wrap gap-2">
                      {atendente.badges.map((badge) => (
                        <Badge key={badge.id} variant="outline" className="text-xs">
                          {badge.icone} {badge.nome}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

