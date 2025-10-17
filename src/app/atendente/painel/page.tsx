'use client'

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { ChatService } from "@/services/chat"
import { Chat, ChatSummary } from "@/types/chat"
import { useRouter } from "next/navigation"

export default function AtendentePainel() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [chats, setChats] = useState<ChatSummary[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'atendente') {
      router.push('/auth/login')
      return
    }

    loadChats()
  }, [isAuthenticated, user, router])

  const loadChats = async () => {
    if (!user) return

    setLoading(true)
    try {
      const chatSummaries = await ChatService.getChatsByAtendente(user.id)
      setChats(chatSummaries)
    } catch (error) {
      console.error('Erro ao carregar chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectChat = async (chatId: string) => {
    setLoading(true)
    try {
      const chat = await ChatService.getChatById(chatId)
      if (chat) {
        setCurrentChat(chat)
        // Marca mensagens como lidas
        if (user) {
          await ChatService.markMessagesAsRead(chatId, user.id)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!currentChat || !user) return

    setLoading(true)
    try {
      // Envia a mensagem
      const newMessage = await ChatService.sendMessage(
        currentChat.id,
        user.id,
        user.name,
        'atendente',
        content
      )
      
      // Atualiza o estado local imediatamente
      setCurrentChat(prev => {
        if (!prev) return prev
        
        // Verifica se a mensagem já existe para evitar duplicação
        const messageExists = prev.messages.some(msg => msg.id === newMessage.id)
        if (messageExists) {
          return prev
        }
        
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          updatedAt: new Date(),
          lastMessage: newMessage
        }
      })
      
      // Recarrega a lista de chats
      loadChats()
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
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

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Painel do Atendente</h1>
            <p className="text-muted-foreground">Bem-vindo, {user.name}</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => router.push('/atendente/profile')} 
              className="bg-[#0891b2] hover:bg-[#0e7490] text-white cursor-pointer"
            >
              Meu Perfil
            </Button>
            <Button onClick={logout} className="cursor-pointer" variant="outline">
              Sair
            </Button>
          </div>
        </div>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Chats */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Chats Disponíveis</CardTitle>
                <CardDescription>
                  {chats.length} conversa{chats.length !== 1 ? 's' : ''} disponível{chats.length !== 1 ? 'eis' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loading && chats.length === 0 ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                  </div>
                ) : chats.length === 0 ? (
                  <div className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-8 w-8 text-muted-foreground mx-auto mb-2"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <p className="text-sm text-muted-foreground">Nenhum chat disponível</p>
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => selectChat(chat.id)}
                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                          currentChat?.id === chat.id ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{chat.clienteName}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {chat.lastMessage || 'Nenhuma mensagem'}
                            </p>
                            {chat.lastMessageTime && (
                              <p className="text-xs text-muted-foreground">
                                {new Intl.DateTimeFormat('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }).format(new Date(chat.lastMessageTime))}
                              </p>
                            )}
                          </div>
                          {chat.unreadCount > 0 && (
                            <div className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                              {chat.unreadCount}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center mt-2">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            chat.status === 'em_atendimento' ? 'bg-green-500' :
                            chat.status === 'aberto' ? 'bg-yellow-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-xs text-muted-foreground capitalize">
                            {chat.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            {currentChat ? (
              <ChatInterface
                messages={currentChat.messages}
                onSendMessage={handleSendMessage}
                loading={loading}
                disabled={currentChat.status === 'fechado'}
                currentUserId={user.id}
                title={`Chat com ${currentChat.clienteName}`}
                subtitle={
                  currentChat.status === 'fechado' 
                    ? 'Atendimento finalizado' 
                    : 'Responda às dúvidas do cliente'
                }
              />
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-12 w-12 text-muted-foreground mx-auto mb-4"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium mb-2">Selecione um chat</h3>
                  <p className="text-muted-foreground">
                    Escolha uma conversa na lista ao lado para começar o atendimento
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
