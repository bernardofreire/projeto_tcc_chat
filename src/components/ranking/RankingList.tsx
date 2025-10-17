'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RankingItem } from '@/types/ranking'

interface RankingListProps {
  ranking: RankingItem[]
  currentUserId: string
}

export function RankingList({ ranking, currentUserId }: RankingListProps) {
  const getPosicaoIcon = (posicao: number) => {
    switch (posicao) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${posicao}`
    }
  }

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
    <div className="space-y-3">
      {ranking.map((item) => (
        <div
          key={item.atendenteId}
          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
            item.atendenteId === currentUserId
              ? 'bg-blue-50 border-blue-200 shadow-sm'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-gray-600 min-w-[40px] text-center">
              {getPosicaoIcon(item.posicao)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">{item.nome}</h4>
                {item.atendenteId === currentUserId && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    Você
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`${getNivelColor(item.nivel)} text-white border-0 text-xs`}>
                  {item.nivel}
                </Badge>
                <span className="text-sm text-gray-500">
                  {item.atendimentosRealizados} atendimentos
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              {item.pontos.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              {item.avaliacaoMedia.toFixed(1)} ⭐
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
