import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'

export interface Class {
  id: string
  school_id: string
  school_name: string
  name: string
  grade_level: number
}

export interface ClassState {
  classes: Class[]
  class: Class | null
  isLoading: boolean
  error: string | null
  fetchClasses: (schoolId?: string) => Promise<void>
  fetchClassById: (id: string) => Promise<void>
  createClass: (schoolId: string, name: string, gradeLevel: number) => Promise<void>
  updateClass: (id: string, data: { name?: string; grade_level?: number }) => Promise<void>
  deleteClass: (id: string) => Promise<void>
  clearError: () => void
}

export const useClassStore = create<ClassState>((set) => ({
  classes: [],
  class: null,
  isLoading: false,
  error: null,

  fetchClasses: async (schoolId?: string) => {
    set({ isLoading: true, error: null })
    try {
      const params = schoolId ? { school_id: schoolId } : {}
      const response = await axiosClient.get('/classes', { params })
      set({
        classes: response.data.classes || [],
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch classes'
      set({ error: errorMessage, isLoading: false })
    }
  },

  fetchClassById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/classes/${id}`)
      set({
        class: response.data,
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch class'
      set({ error: errorMessage, isLoading: false })
    }
  },

  createClass: async (schoolId: string, name: string, gradeLevel: number) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.post('/classes', {
        school_id: schoolId,
        name,
        grade_level: gradeLevel,
      })
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create class'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  updateClass: async (id: string, data: { name?: string; grade_level?: number }) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.put(`/classes/${id}`, data)
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update class'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  deleteClass: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.delete(`/classes/${id}`)
      set((state) => ({
        classes: state.classes.filter((c) => c.id !== id),
        isLoading: false,
      }))
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete class'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
