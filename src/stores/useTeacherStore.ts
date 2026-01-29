import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'

export interface Teacher {
  id: string
  email: string
  full_name: string
}

export interface TeacherState {
  teachers: Teacher[]
  selectedTeacher: Teacher | null
  isLoading: boolean
  error: string | null
  fetchTeachers: () => Promise<void>
  fetchTeacherById: (id: string) => Promise<void>
  createTeacher: (email: string, fullName: string, password: string) => Promise<void>
  updateTeacher: (id: string, data: { email?: string; full_name?: string; password?: string }) => Promise<void>
  deleteTeacher: (id: string) => Promise<void>
  clearError: () => void
}

export const useTeacherStore = create<TeacherState>((set) => ({
  teachers: [],
  selectedTeacher: null,
  isLoading: false,
  error: null,

  fetchTeachers: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get('/teachers')
      set({
        teachers: response.data.teachers || [],
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch teachers'
      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  fetchTeacherById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/teachers/${id}`)
      set({
        selectedTeacher: response.data,
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch teacher'
      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  createTeacher: async (email: string, fullName: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.post('/teachers', {
        email,
        full_name: fullName,
        password,
      })
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create teacher'
      set({
        error: errorMessage,
        isLoading: false,
      })
      throw err
    }
  },

  updateTeacher: async (id: string, data: { email?: string; full_name?: string; password?: string }) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.put(`/teachers/${id}`, data)
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update teacher'
      set({
        error: errorMessage,
        isLoading: false,
      })
      throw err
    }
  },

  deleteTeacher: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.delete(`/teachers/${id}`)
      set((state) => ({
        teachers: state.teachers.filter((t) => t.id !== id),
        isLoading: false,
      }))
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete teacher'
      set({
        error: errorMessage,
        isLoading: false,
      })
      throw err
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
