import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'

export interface School {
  id: string
  name: string
  address: string
}

export interface SchoolState {
  schools: School[]
  school: School | null
  isLoading: boolean
  error: string | null
  fetchSchools: () => Promise<void>
  fetchSchoolById: (id: string) => Promise<void>
  createSchool: (name: string, address: string) => Promise<void>
  updateSchool: (id: string, data: { name?: string; address?: string }) => Promise<void>
  deleteSchool: (id: string) => Promise<void>
  clearError: () => void
}

export const useSchoolStore = create<SchoolState>((set) => ({
  schools: [],
  school: null,
  isLoading: false,
  error: null,

  fetchSchools: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get('/schools')
      set({
        schools: response.data.schools || [],
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch schools'
      set({ error: errorMessage, isLoading: false })
    }
  },

  fetchSchoolById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/schools/${id}`)
      set({
        school: response.data,
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch school'
      set({ error: errorMessage, isLoading: false })
    }
  },

  createSchool: async (name: string, address: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.post('/schools', { name, address })
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create school'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  updateSchool: async (id: string, data: { name?: string; address?: string }) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.put(`/schools/${id}`, data)
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update school'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  deleteSchool: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.delete(`/schools/${id}`)
      set((state) => ({
        schools: state.schools.filter((s) => s.id !== id),
        isLoading: false,
      }))
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete school'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
