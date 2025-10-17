import { Chat, Message, Feedback, ChatSummary } from '@/types/chat'
import { User } from '@/types/user'

// Mock de dados para desenvolvimento
let mockChats: Chat[] = [
  {
    id: 'chat-1',
    clienteId: '4',
    clienteName: 'Pedro Costa',
    atendenteId: '2',
    atendenteName: 'João Silva',
    status: 'em_atendimento',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
    messages: [
      {
        id: 'msg-1',
        chatId: 'chat-1',
        senderId: '4',
        senderName: 'Pedro Costa',
        senderRole: 'cliente',
        content: 'Olá! Preciso de ajuda com o sistema de contabilidade.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: 'msg-2',
        chatId: 'chat-1',
        senderId: '2',
        senderName: 'João Silva',
        senderRole: 'atendente',
        content: 'Olá Pedro! Claro, estou aqui para ajudar. Qual é sua dúvida específica?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
        isRead: true
      },
      {
        id: 'msg-3',
        chatId: 'chat-1',
        senderId: '4',
        senderName: 'Pedro Costa',
        senderRole: 'cliente',
        content: 'Como faço para gerar um relatório de vendas no sistema?',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: 'msg-4',
        chatId: 'chat-1',
        senderId: '2',
        senderName: 'João Silva',
        senderRole: 'atendente',
        content: 'Para gerar o relatório de vendas, vá em Relatórios > Vendas > Período desejado. Precisa de mais detalhes?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false
      }
    ]
  }
]

let mockFeedbacks: Feedback[] = []

export class ChatService {
  // Buscar chats de um cliente
  static async getChatsByCliente(clienteId: string): Promise<Chat[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockChats.filter(chat => chat.clienteId === clienteId)
  }

  // Buscar chats de um atendente
  static async getChatsByAtendente(atendenteId: string): Promise<ChatSummary[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockChats
      .filter(chat => chat.atendenteId === atendenteId)
      .map(chat => ({
        id: chat.id,
        clienteName: chat.clienteName,
        status: chat.status,
        lastMessage: chat.messages[chat.messages.length - 1]?.content,
        lastMessageTime: chat.messages[chat.messages.length - 1]?.timestamp,
        unreadCount: chat.messages.filter(msg => 
          msg.senderRole === 'cliente' && !msg.isRead
        ).length
      }))
  }

  // Buscar chat específico
  static async getChatById(chatId: string): Promise<Chat | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockChats.find(chat => chat.id === chatId) || null
  }

  // Criar novo chat
  static async createChat(clienteId: string, clienteName: string): Promise<Chat> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      clienteId,
      clienteName,
      status: 'aberto',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    }
    
    mockChats.push(newChat)
    return newChat
  }

  // Enviar mensagem
  static async sendMessage(
    chatId: string, 
    senderId: string, 
    senderName: string, 
    senderRole: 'cliente' | 'atendente',
    content: string
  ): Promise<Message> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const chat = mockChats.find(c => c.id === chatId)
    if (!chat) {
      throw new Error('Chat não encontrado')
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${senderId}`,
      chatId,
      senderId,
      senderName,
      senderRole,
      content,
      timestamp: new Date(),
      isRead: false
    }

    // Não adiciona a mensagem aqui - deixa o estado local fazer isso
    // chat.messages.push(newMessage)
    chat.updatedAt = new Date()
    chat.lastMessage = newMessage

    // Se é mensagem do cliente e não há atendente, atribui um automaticamente
    if (senderRole === 'cliente' && !chat.atendenteId) {
      chat.atendenteId = '2' // João Silva
      chat.atendenteName = 'João Silva'
      chat.status = 'em_atendimento'
    }

    return newMessage
  }

  // Marcar mensagens como lidas
  static async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const chat = mockChats.find(c => c.id === chatId)
    if (chat) {
      chat.messages.forEach(msg => {
        if (msg.senderId !== userId) {
          msg.isRead = true
        }
      })
    }
  }

  // Fechar chat
  static async closeChat(chatId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const chat = mockChats.find(c => c.id === chatId)
    if (chat) {
      chat.status = 'fechado'
      chat.updatedAt = new Date()
    }
  }

  // Enviar feedback
  static async submitFeedback(
    chatId: string,
    clienteId: string,
    atendenteId: string,
    rating: number,
    comment: string
  ): Promise<Feedback> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newFeedback: Feedback = {
      id: `feedback-${Date.now()}`,
      chatId,
      clienteId,
      atendenteId,
      rating,
      comment,
      createdAt: new Date()
    }
    
    mockFeedbacks.push(newFeedback)
    return newFeedback
  }

  // Buscar feedbacks de um atendente
  static async getFeedbacksByAtendente(atendenteId: string): Promise<Feedback[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockFeedbacks.filter(feedback => feedback.atendenteId === atendenteId)
  }
}
