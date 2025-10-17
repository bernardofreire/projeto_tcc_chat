'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Message } from '@/types/chat'

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  loading?: boolean
  disabled?: boolean
  currentUserId: string
  title?: string
  subtitle?: string
}

export function ChatInterface({
  messages,
  onSendMessage,
  loading = false,
  disabled = false,
  currentUserId,
  title = "Chat de Suporte",
  subtitle = "Converse com nossos atendentes"
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [isUserScrolling, setIsUserScrolling] = useState(false)

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      container.scrollTop = container.scrollHeight
    }
  }

  const scrollToBottomSmooth = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  // Scroll automático quando novas mensagens chegam
  useEffect(() => {
    // Usa requestAnimationFrame para garantir que o DOM foi atualizado
    requestAnimationFrame(() => {
      scrollToBottom()
    })
  }, [messages])

  // Detecta scroll manual do usuário
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 10
      setIsUserScrolling(!isAtBottom)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && !disabled && !loading) {
      const messageText = newMessage.trim()
      onSendMessage(messageText)
      setNewMessage('')
      
      // Scroll imediato quando o usuário envia uma mensagem
      requestAnimationFrame(() => {
        scrollToBottom()
      })
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Online</span>
            {isUserScrolling && (
              <Button
                size="sm"
                variant="outline"
                onClick={scrollToBottomSmooth}
                className="ml-2 h-6 px-2 text-xs"
              >
                ↓ Nova mensagem
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      {/* Messages Area - Ocupa todo o espaço disponível */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
      >
        {messages.length === 0 ? (
          <div className="text-center py-8">
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
            <p className="text-muted-foreground">Nenhuma mensagem ainda</p>
            <p className="text-sm text-muted-foreground">Inicie uma conversa enviando uma mensagem</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId
            return (
              <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg p-3 max-w-[70%] ${
                  isOwnMessage 
                    ? 'text-white' 
                    : 'bg-muted'
                }`} style={isOwnMessage ? { backgroundColor: '#0891b2' } : {}}>
                  <p className="text-sm">{message.content}</p>
                  <div className={`text-xs mt-1 ${
                    isOwnMessage ? 'opacity-70' : 'text-muted-foreground'
                  }`}>
                    {message.senderName} • {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixo na parte inferior */}
      <div className="border-t p-4 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            type="text"
            placeholder={disabled ? "Chat finalizado" : "Digite sua mensagem..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={disabled || loading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || disabled || loading}
          >
            {loading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22 11 13 2 9 22 2Z" />
              </svg>
            )}
          </Button>
        </form>
      </div>
    </Card>
  )
}
