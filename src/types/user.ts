export type UserRole = 'admin' | 'atendente' | 'cliente'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface AuthUser extends User {
  // Campos específicos para autenticação
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user?: AuthUser
  error?: string
}
