import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'

export interface Assignment {
  id: string
  course_id: string
  course_title: string
  title: string
  description: string
  max_score: number
}

export interface AssignmentState {
  assignments: Assignment[]
  assignment: Assignment | null
  isLoading: boolean
  error: string | null
  listAssignments: (courseId: string) => Promise<void>
  getAssignment: (id: string) => Promise<void>
  createAssignment: (courseId: string, title: string, description: string, maxScore: number) => Promise<void>
  updateAssignment: (id: string, data: { title?: string; description?: string; max_score?: number }) => Promise<void>
  deleteAssignment: (id: string) => Promise<void>
  clearError: () => void
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignments: [],
  assignment: null,
  isLoading: false,
  error: null,

  listAssignments: async (courseId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/courses/${courseId}/assignments`)
      set({
        assignments: response.data.assignments || [],
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch assignments'
      set({ error: errorMessage, isLoading: false })
    }
  },

  getAssignment: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/assignments/${id}`)
      set({
        assignment: response.data,
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch assignment'
      set({ error: errorMessage, isLoading: false })
    }
  },

  createAssignment: async (courseId: string, title: string, description: string, maxScore: number) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.post(`/courses/${courseId}/assignments`, {
        title,
        description,
        max_score: maxScore,
      })
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create assignment'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  updateAssignment: async (id: string, data: { title?: string; description?: string; max_score?: number }) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.put(`/assignments/${id}`, data)
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update assignment'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  deleteAssignment: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.delete(`/assignments/${id}`)
      set((state) => ({
        assignments: state.assignments.filter((a) => a.id !== id),
        isLoading: false,
      }))
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete assignment'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
