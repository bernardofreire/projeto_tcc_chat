import { AtendenteStats, RankingItem, RankingPeriodo, Badge, Conquista, ProfileInfo } from '@/types/ranking'

// Mock de dados para desenvolvimento
const mockBadges: Badge[] = [
  {
    id: '1',
    nome: 'Primeiro Atendimento',
    descricao: 'Realizou seu primeiro atendimento',
    icone: '🎯',
    cor: '#10b981',
    dataConquista: new Date('2024-01-15')
  },
  {
    id: '2',
    nome: 'Especialista em Vendas',
    descricao: 'Atendeu 50+ clientes com foco em vendas',
    icone: '💼',
    cor: '#3b82f6',
    dataConquista: new Date('2024-02-20')
  },
  {
    id: '3',
    nome: 'Resposta Rápida',
    descricao: 'Tempo médio de resposta abaixo de 2 minutos',
    icone: '⚡',
    cor: '#f59e0b',
    dataConquista: new Date('2024-03-10')
  }
]

const mockConquistas: Conquista[] = [
  {
    id: '1',
    titulo: '100 Atendimentos',
    descricao: 'Realize 100 atendimentos para desbloquear',
    progresso: 75,
    meta: 100,
    tipo: 'atendimentos',
    icone: '🎯'
  },
  {
    id: '2',
    titulo: 'Avaliação 5 Estrelas',
    descricao: 'Mantenha avaliação média de 5.0 por 30 dias',
    progresso: 15,
    meta: 30,
    tipo: 'avaliacao',
    icone: '⭐'
  },
  {
    id: '3',
    titulo: 'Resposta Express',
    descricao: 'Tempo médio de resposta abaixo de 1 minuto',
    progresso: 80,
    meta: 100,
    tipo: 'tempo',
    icone: '⚡'
  }
]

const mockRanking: RankingItem[] = [
  {
    posicao: 1,
    atendenteId: '2',
    nome: 'João Silva',
    pontos: 2847,
    nivel: 'Especialista',
    avaliacaoMedia: 4.9,
    atendimentosRealizados: 156
  },
  {
    posicao: 2,
    atendenteId: '3',
    nome: 'Maria Santos',
    pontos: 2654,
    nivel: 'Avançado',
    avaliacaoMedia: 4.8,
    atendimentosRealizados: 142
  },
  {
    posicao: 3,
    atendenteId: '6',
    nome: 'Carlos Oliveira',
    pontos: 2432,
    nivel: 'Avançado',
    avaliacaoMedia: 4.7,
    atendimentosRealizados: 128
  },
  {
    posicao: 4,
    atendenteId: '7',
    nome: 'Ana Costa',
    pontos: 2210,
    nivel: 'Intermediário',
    avaliacaoMedia: 4.6,
    atendimentosRealizados: 115
  },
  {
    posicao: 5,
    atendenteId: '8',
    nome: 'Pedro Lima',
    pontos: 1987,
    nivel: 'Intermediário',
    avaliacaoMedia: 4.5,
    atendimentosRealizados: 98
  },
  {
    posicao: 6,
    atendenteId: '9',
    nome: 'Fernanda Alves',
    pontos: 1856,
    nivel: 'Intermediário',
    avaliacaoMedia: 4.4,
    atendimentosRealizados: 87
  },
  {
    posicao: 7,
    atendenteId: '10',
    nome: 'Roberto Mendes',
    pontos: 1723,
    nivel: 'Intermediário',
    avaliacaoMedia: 4.3,
    atendimentosRealizados: 76
  },
  {
    posicao: 8,
    atendenteId: '11',
    nome: 'Juliana Rocha',
    pontos: 1598,
    nivel: 'Iniciante',
    avaliacaoMedia: 4.2,
    atendimentosRealizados: 65
  },
  {
    posicao: 9,
    atendenteId: '12',
    nome: 'Marcos Pereira',
    pontos: 1456,
    nivel: 'Iniciante',
    avaliacaoMedia: 4.1,
    atendimentosRealizados: 54
  },
  {
    posicao: 10,
    atendenteId: '13',
    nome: 'Camila Souza',
    pontos: 1324,
    nivel: 'Iniciante',
    avaliacaoMedia: 4.0,
    atendimentosRealizados: 43
  },
  {
    posicao: 11,
    atendenteId: '14',
    nome: 'Diego Ferreira',
    pontos: 1198,
    nivel: 'Iniciante',
    avaliacaoMedia: 3.9,
    atendimentosRealizados: 38
  },
  {
    posicao: 12,
    atendenteId: '15',
    nome: 'Larissa Martins',
    pontos: 1087,
    nivel: 'Iniciante',
    avaliacaoMedia: 3.8,
    atendimentosRealizados: 32
  },
  {
    posicao: 13,
    atendenteId: '16',
    nome: 'Thiago Barbosa',
    pontos: 976,
    nivel: 'Iniciante',
    avaliacaoMedia: 3.7,
    atendimentosRealizados: 28
  },
  {
    posicao: 14,
    atendenteId: '17',
    nome: 'Patricia Nunes',
    pontos: 865,
    nivel: 'Iniciante',
    avaliacaoMedia: 3.6,
    atendimentosRealizados: 24
  },
  {
    posicao: 15,
    atendenteId: '18',
    nome: 'Rafael Gomes',
    pontos: 754,
    nivel: 'Iniciante',
    avaliacaoMedia: 3.5,
    atendimentosRealizados: 20
  }
]

export class RankingService {
  // Buscar estatísticas do atendente
  static async getAtendenteStats(atendenteId: string): Promise<AtendenteStats> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simula dados baseados no ID do atendente
    const isJoao = atendenteId === '2'
    
    return {
      id: atendenteId,
      name: isJoao ? 'João Silva' : 'Maria Santos',
      nivel: isJoao ? 'Especialista' : 'Avançado',
      pontos: isJoao ? 2847 : 2654,
      posicaoRanking: isJoao ? 1 : 2,
      atendimentosRealizados: isJoao ? 156 : 142,
      avaliacaoMedia: isJoao ? 4.9 : 4.8,
      totalAvaliacoes: isJoao ? 89 : 76,
      tempoMedioResposta: isJoao ? 1.2 : 1.8,
      satisfacaoCliente: isJoao ? 96 : 94,
      badges: mockBadges,
      conquistas: mockConquistas
    }
  }

  // Buscar ranking geral
  static async getRanking(periodo: 'semanal' | 'mensal' | 'geral' = 'geral'): Promise<RankingPeriodo> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      titulo: `Ranking ${periodo === 'geral' ? 'Geral' : periodo === 'semanal' ? 'Semanal' : 'Mensal'}`,
      periodo,
      ranking: mockRanking,
      dataAtualizacao: new Date()
    }
  }

  // Buscar informações do perfil
  static async getProfileInfo(atendenteId: string): Promise<ProfileInfo> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const isJoao = atendenteId === '2'
    
    return {
      id: atendenteId,
      nome: isJoao ? 'João Silva' : 'Maria Santos',
      email: isJoao ? 'joao.silva@empresa.com' : 'maria.santos@empresa.com',
      cargo: 'Atendente de Suporte',
      dataAdmissao: new Date('2023-06-15'),
      especialidades: ['Sistema de Contabilidade', 'Relatórios', 'Configurações', 'Vendas'],
      bio: isJoao 
        ? 'Especialista em atendimento ao cliente com foco em soluções rápidas e eficientes. Apaixonado por tecnologia e sempre buscando melhorar a experiência do cliente.'
        : 'Atendente dedicada com experiência em suporte técnico e vendas. Comprometida em oferecer o melhor atendimento e resolver as dúvidas dos clientes.',
      status: 'online',
      ultimaAtividade: new Date()
    }
  }

  // Buscar badges do atendente
  static async getBadges(atendenteId: string): Promise<Badge[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockBadges
  }

  // Buscar conquistas do atendente
  static async getConquistas(atendenteId: string): Promise<Conquista[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockConquistas
  }
}
