export interface Message {
  id: string
  chatId: string
  senderId: string
  senderName: string
  senderRole: 'cliente' | 'atendente'
  content: string
  timestamp: Date
  isRead: boolean
}

export interface Chat {
  id: string
  clienteId: string
  clienteName: string
  atendenteId?: string
  atendenteName?: string
  status: 'aberto' | 'em_atendimento' | 'fechado'
  createdAt: Date
  updatedAt: Date
  lastMessage?: Message
  messages: Message[]
}

export interface Feedback {
  id: string
  chatId: string
  clienteId: string
  atendenteId: string
  rating: number // 1-5
  comment: string
  createdAt: Date
}

export interface ChatSummary {
  id: string
  clienteName: string
  status: Chat['status']
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
}
