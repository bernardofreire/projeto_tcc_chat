'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Conquista } from '@/types/ranking'

interface AchievementsCardProps {
  conquistas: Conquista[]
}

export function AchievementsCard({ conquistas }: AchievementsCardProps) {
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'atendimentos':
        return '🎯'
      case 'avaliacao':
        return '⭐'
      case 'tempo':
        return '⚡'
      case 'satisfacao':
        return '😊'
      default:
        return '🏆'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'atendimentos':
        return 'text-green-600'
      case 'avaliacao':
        return 'text-yellow-600'
      case 'tempo':
        return 'text-blue-600'
      case 'satisfacao':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🏆</span>
          <span>Conquistas</span>
        </CardTitle>
        <CardDescription>
          Suas metas e progressos em andamento
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {conquistas.map((conquista) => (
          <div key={conquista.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{conquista.icone}</span>
                <div>
                  <h4 className="text-sm font-medium">{conquista.titulo}</h4>
                  <p className="text-xs text-muted-foreground">{conquista.descricao}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${getTipoColor(conquista.tipo)}`}>
                  {conquista.progresso}/{conquista.meta}
                </div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((conquista.progresso / conquista.meta) * 100)}%
                </div>
              </div>
            </div>
            
            <Progress 
              value={(conquista.progresso / conquista.meta) * 100} 
              className="h-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
