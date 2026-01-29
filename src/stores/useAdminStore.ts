import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'

export interface Admin {
  id: string
  email: string
  full_name: string
  school_id: string
  school_name: string
}

export interface AdminState {
  admins: Admin[]
  admin: Admin | null
  isLoading: boolean
  error: string | null
  fetchAdmins: () => Promise<void>
  fetchAdminById: (id: string) => Promise<void>
  createAdmin: (email: string, password: string, fullName: string, schoolId: string) => Promise<void>
  updateAdmin: (id: string, data: { email?: string; full_name?: string; password?: string; school_id?: string }) => Promise<void>
  deleteAdmin: (id: string) => Promise<void>
  clearError: () => void
}

export const useAdminStore = create<AdminState>((set) => ({
  admins: [],
  admin: null,
  isLoading: false,
  error: null,

  fetchAdmins: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get('/admins')
      set({
        admins: response.data.admins || [],
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch admins'
      set({ error: errorMessage, isLoading: false })
    }
  },

  fetchAdminById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/admins/${id}`)
      set({
        admin: response.data,
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch admin'
      set({ error: errorMessage, isLoading: false })
    }
  },

  createAdmin: async (email: string, password: string, fullName: string, schoolId: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.post('/admins', {
        email,
        password,
        full_name: fullName,
        school_id: schoolId,
      })
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create admin'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  updateAdmin: async (id: string, data: { email?: string; full_name?: string; password?: string; school_id?: string }) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.put(`/admins/${id}`, data)
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update admin'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  deleteAdmin: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.delete(`/admins/${id}`)
      set((state) => ({
        admins: state.admins.filter((a) => a.id !== id),
        isLoading: false,
      }))
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete admin'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
