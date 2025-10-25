'use client'

import { useState, useEffect } from 'react'
import { User, UserRole } from '@/types/user'
import { UserService, CreateUserData, UpdateUserData } from '@/services/user'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface UserManagementProps {
  onUserUpdate?: () => void
}

export function UserManagement({ onUserUpdate }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [filter, setFilter] = useState<UserRole | 'all'>('all')

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cliente' as UserRole,
    password: ''
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const usersData = await UserService.getAllUsers()
      setUsers(usersData)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await UserService.createUser(formData)
      setFormData({ name: '', email: '', role: 'cliente', password: '' })
      setShowCreateForm(false)
      loadUsers()
      onUserUpdate?.()
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      const updateData: UpdateUserData = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      }
      await UserService.updateUser(editingUser.id, updateData)
      setEditingUser(null)
      setFormData({ name: '', email: '', role: 'cliente', password: '' })
      loadUsers()
      onUserUpdate?.()
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return

    try {
      await UserService.deleteUser(id)
      loadUsers()
      onUserUpdate?.()
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
    }
  }

  const startEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
    })
    setShowCreateForm(false)
  }

  const cancelEdit = () => {
    setEditingUser(null)
    setShowCreateForm(false)
    setFormData({ name: '', email: '', role: 'cliente', password: '' })
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'atendente': return 'default'
      case 'cliente': return 'secondary'
      default: return 'outline'
    }
  }

  const filteredUsers = users.filter(user => 
    filter === 'all' || user.role === filter
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Usuários</CardTitle>
          <CardDescription>Carregando usuários...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Ações */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>
                Gerencie usuários do sistema (atendentes e clientes)
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todos ({users.length})
            </Button>
            <Button
              variant={filter === 'atendente' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('atendente')}
            >
              Atendentes ({users.filter(u => u.role === 'atendente').length})
            </Button>
            <Button
              variant={filter === 'cliente' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('cliente')}
            >
              Clientes ({users.filter(u => u.role === 'cliente').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Criação/Edição */}
      {(showCreateForm || editingUser) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Função</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="cliente">Cliente</option>
                    <option value="atendente">Atendente</option>
                  </select>
                </div>
                {!editingUser && (
                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingUser ? 'Atualizar' : 'Criar'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Criado em: {user.createdAt.toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(user)}
                  >
                    Editar
                  </Button>
                  {user.role !== 'admin' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Excluir
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhum usuário encontrado
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

