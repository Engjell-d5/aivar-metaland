import { create } from 'zustand'
import { User } from 'oidc-client-ts'
import authService from '../services/authService'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: () => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
  getUserInfo: () => Record<string, unknown> | null
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: user !== null && !user.expired 
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  login: async () => {
    try {
      set({ isLoading: true, error: null })
      await authService.signin()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null })
      await authService.signout()
      set({ user: null, isAuthenticated: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  initialize: async () => {
    try {
      set({ isLoading: true, error: null })
      await authService.initialize()
      const currentUser = authService.getUser()
      set({ 
        user: currentUser, 
        isAuthenticated: currentUser !== null && !currentUser.expired,
        isLoading: false 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Initialization failed'
      set({ error: errorMessage, isLoading: false })
    }
  },

  getUserInfo: () => {
    const { user } = get()
    return user?.profile || null
  }
})) 