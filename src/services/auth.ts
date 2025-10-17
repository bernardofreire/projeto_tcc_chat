import { User, UserRole, LoginCredentials, AuthResponse } from '@/types/user'

// Mock de usuários para desenvolvimento
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@empresa.com',
    name: 'Administrador',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    email: 'atendente1@empresa.com',
    name: 'João Silva',
    role: 'atendente',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    email: 'atendente2@empresa.com',
    name: 'Maria Santos',
    role: 'atendente',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    email: 'cliente1@empresa.com',
    name: 'Pedro Costa',
    role: 'cliente',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    email: 'cliente2@empresa.com',
    name: 'Ana Oliveira',
    role: 'cliente',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = mockUsers.find(
      u => u.email === credentials.email && 
      credentials.password === '123456' // Senha padrão para todos os usuários mock
    )
    
    if (!user) {
      return {
        error: 'Credenciais inválidas. Verifique seu e-mail e senha.'
      }
    }
    
    return { user }
  }
  
  static async getUserById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockUsers.find(u => u.id === id) || null
  }
  
  static async getAllUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockUsers
  }
  
  static getRedirectPath(role: UserRole): string {
    switch (role) {
      case 'admin':
        return '/admin/dashboard'
      case 'atendente':
        return '/atendente/painel'
      case 'cliente':
        return '/cliente/chat'
      default:
        return '/'
    }
  }
}
