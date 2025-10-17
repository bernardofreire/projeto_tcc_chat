export interface AtendenteStats {
  id: string
  name: string
  nivel: string
  pontos: number
  posicaoRanking: number
  atendimentosRealizados: number
  avaliacaoMedia: number
  totalAvaliacoes: number
  tempoMedioResposta: number // em minutos
  satisfacaoCliente: number // porcentagem
  badges: Badge[]
  conquistas: Conquista[]
}

export interface Badge {
  id: string
  nome: string
  descricao: string
  icone: string
  cor: string
  dataConquista: Date
}

export interface Conquista {
  id: string
  titulo: string
  descricao: string
  progresso: number
  meta: number
  tipo: 'atendimentos' | 'avaliacao' | 'tempo' | 'satisfacao'
  icone: string
}

export interface RankingItem {
  posicao: number
  atendenteId: string
  nome: string
  pontos: number
  nivel: string
  avaliacaoMedia: number
  atendimentosRealizados: number
  isCurrentUser?: boolean
}

export interface RankingPeriodo {
  titulo: string
  periodo: 'semanal' | 'mensal' | 'geral'
  ranking: RankingItem[]
  dataAtualizacao: Date
}

export interface ProfileInfo {
  id: string
  nome: string
  email: string
  cargo: string
  dataAdmissao: Date
  especialidades: string[]
  bio: string
  avatar?: string
  status: 'online' | 'offline' | 'ocupado'
  ultimaAtividade: Date
}
