'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AtendenteStats } from '@/types/ranking'

interface RankingCardProps {
  stats: AtendenteStats
  showDetails?: boolean
}

export function RankingCard({ stats, showDetails = false }: RankingCardProps) {
  const getNivelColor = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case 'especialista':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 'avançado':
        return 'bg-gradient-to-r from-blue-400 to-blue-600'
      case 'intermediário':
        return 'bg-gradient-to-r from-green-400 to-green-600'
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600'
    }
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-16 translate-x-16"></div>
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{stats.name}</CardTitle>
            <CardDescription>Seu desempenho atual</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">#{stats.posicaoRanking}</div>
            <div className="text-sm text-muted-foreground">Posição</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Nível e Pontos */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={`${getNivelColor(stats.nivel)} text-white border-0`}>
              {stats.nivel}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">{stats.pontos.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Pontos</div>
          </div>
        </div>

        {showDetails && (
          <>
            {/* Estatísticas Detalhadas */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{stats.atendimentosRealizados}</div>
                <div className="text-xs text-muted-foreground">Atendimentos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-600">{stats.avaliacaoMedia.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Avaliação</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">{stats.tempoMedioResposta}min</div>
                <div className="text-xs text-muted-foreground">Tempo Médio</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-cyan-600">{stats.satisfacaoCliente}%</div>
                <div className="text-xs text-muted-foreground">Satisfação</div>
              </div>
            </div>

            {/* Badges */}
            {stats.badges.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Conquistas Recentes</h4>
                <div className="flex flex-wrap gap-2">
                  {stats.badges.slice(0, 3).map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs"
                      style={{ backgroundColor: `${badge.cor}20`, color: badge.cor }}
                    >
                      <span>{badge.icone}</span>
                      <span className="font-medium">{badge.nome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
