'use client'

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { FeedbackModal } from "@/components/feedback/FeedbackModal"
import { ChatService } from "@/services/chat"
import { Chat, Message } from "@/types/chat"
import { useRouter } from "next/navigation"

export default function ClienteChat() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [loading, setLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackLoading, setFeedbackLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'cliente') {
      router.push('/auth/login')
      return
    }

    // Carrega ou cria chat para o cliente
    loadOrCreateChat()
  }, [isAuthenticated, user, router])

  const loadOrCreateChat = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Busca chats existentes do cliente
      const existingChats = await ChatService.getChatsByCliente(user.id)
      
      if (existingChats.length > 0) {
        // Usa o chat mais recente
        const latestChat = existingChats.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0]
        setCurrentChat(latestChat)
      } else {
        // Cria novo chat
        const newChat = await ChatService.createChat(user.id, user.name)
        setCurrentChat(newChat)
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
        'cliente',
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
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseChat = async () => {
    if (!currentChat) return

    setLoading(true)
    try {
      await ChatService.closeChat(currentChat.id)
      setCurrentChat(prev => prev ? { ...prev, status: 'fechado' } : null)
      setShowFeedback(true)
    } catch (error) {
      console.error('Erro ao fechar chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitFeedback = async (rating: number, comment: string) => {
    if (!currentChat || !user) return

    setFeedbackLoading(true)
    try {
      await ChatService.submitFeedback(
        currentChat.id,
        user.id,
        currentChat.atendenteId || '',
        rating,
        comment
      )
      setShowFeedback(false)
      
      // Mostra mensagem de sucesso
      alert('Obrigado pelo seu feedback!')
    } catch (error) {
      console.error('Erro ao enviar feedback:', error)
      alert('Erro ao enviar feedback. Tente novamente.')
    } finally {
      setFeedbackLoading(false)
    }
  }

  if (!isAuthenticated || user?.role !== 'cliente') {
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Suporte ao Cliente</h1>
            <p className="text-muted-foreground">Olá, {user.name}! Como podemos ajudar?</p>
          </div>
          <div className="flex space-x-2">
            {currentChat && currentChat.status === 'em_atendimento' && (
              <Button 
                onClick={handleCloseChat} 
                variant="outline"
                disabled={loading}
              >
                Finalizar Atendimento
              </Button>
            )}
            <Button onClick={logout} variant="outline">
              Sair
            </Button>
          </div>
        </div>

        {/* Chat Interface */}
        {loading && !currentChat ? (
          <Card className="h-[600px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando chat...</p>
            </div>
          </Card>
        ) : currentChat ? (
          <ChatInterface
            messages={currentChat.messages}
            onSendMessage={handleSendMessage}
            loading={loading}
            disabled={currentChat.status === 'fechado'}
            currentUserId={user.id}
            title="Chat de Suporte"
            subtitle={
              currentChat.status === 'fechado' 
                ? 'Atendimento finalizado' 
                : currentChat.atendenteName 
                  ? `Atendente: ${currentChat.atendenteName}`
                  : 'Aguardando atendente...'
            }
          />
        ) : (
          <Card className="h-[600px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Erro ao carregar chat</p>
              <Button onClick={loadOrCreateChat} className="mt-4">
                Tentar Novamente
              </Button>
            </div>
          </Card>
        )}       
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={handleSubmitFeedback}
        loading={feedbackLoading}
      />
    </div>
  )
}
