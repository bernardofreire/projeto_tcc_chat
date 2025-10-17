'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProfileInfo } from '@/types/ranking'

interface ProfileCardProps {
  profile: ProfileInfo
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'ocupado':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online'
      case 'ocupado':
        return 'Ocupado'
      case 'offline':
        return 'Offline'
      default:
        return 'Offline'
    }
  }

  const tempoTrabalho = Math.floor(
    (new Date().getTime() - profile.dataAdmissao.getTime()) / (1000 * 60 * 60 * 24 * 30)
  )

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -translate-y-16 -translate-x-16"></div>
      
      <CardHeader className="relative">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profile.nome.split(' ').map(n => n[0]).join('')}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(profile.status)} rounded-full border-2 border-white`}></div>
          </div>
          
          <div className="flex-1">
            <CardTitle className="text-xl">{profile.nome}</CardTitle>
            <CardDescription>{profile.cargo}</CardDescription>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-green-600 border-green-200">
                {getStatusText(profile.status)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {tempoTrabalho} meses na empresa
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Bio */}
        <div>
          <h4 className="text-sm font-medium mb-2">Sobre</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {profile.bio}
          </p>
        </div>

        {/* Especialidades */}
        <div>
          <h4 className="text-sm font-medium mb-2">Especialidades</h4>
          <div className="flex flex-wrap gap-2">
            {profile.especialidades.map((especialidade, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {especialidade}
              </Badge>
            ))}
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">📧</span>
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">📅</span>
            <span>Admitido em {profile.dataAdmissao.toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">🕒</span>
            <span>Última atividade: {profile.ultimaAtividade.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
