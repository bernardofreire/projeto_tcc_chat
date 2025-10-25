import { User, UserRole } from '@/types/user'

// Mock de usuários para desenvolvimento
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@empresa.com',
    name: 'Administrador',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'atendente1@empresa.com',
    name: 'João Silva',
    role: 'atendente',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '3',
    email: 'atendente2@empresa.com',
    name: 'Maria Santos',
    role: 'atendente',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '4',
    email: 'cliente1@empresa.com',
    name: 'Pedro Costa',
    role: 'cliente',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '5',
    email: 'cliente2@empresa.com',
    name: 'Ana Oliveira',
    role: 'cliente',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
]

export interface CreateUserData {
  name: string
  email: string
  role: UserRole
  password: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  role?: UserRole
}

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [...mockUsers]
  }

  static async getUserById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockUsers.find(u => u.id === id) || null
  }

  static async createUser(userData: CreateUserData): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    mockUsers.push(newUser)
    return newUser
  }

  static async updateUser(id: string, userData: UpdateUserData): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const userIndex = mockUsers.findIndex(u => u.id === id)
    if (userIndex === -1) return null
    
    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      updatedAt: new Date()
    }
    
    mockUsers[userIndex] = updatedUser
    return updatedUser
  }

  static async deleteUser(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const userIndex = mockUsers.findIndex(u => u.id === id)
    if (userIndex === -1) return false
    
    mockUsers.splice(userIndex, 1)
    return true
  }

  static async getUsersByRole(role: UserRole): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockUsers.filter(u => u.role === role)
  }

  static async getUsersStats(): Promise<{
    total: number
    admins: number
    atendentes: number
    clientes: number
  }> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return {
      total: mockUsers.length,
      admins: mockUsers.filter(u => u.role === 'admin').length,
      atendentes: mockUsers.filter(u => u.role === 'atendente').length,
      clientes: mockUsers.filter(u => u.role === 'cliente').length
    }
  }
}

