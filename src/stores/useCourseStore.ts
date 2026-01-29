import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'

export interface Course {
  id: string
  title: string
  description: string
  teacher_id: string
  teacher_name: string
}

export interface CourseState {
  courses: Course[]
  selectedCourse: Course | null
  isLoading: boolean
  error: string | null
  fetchCourses: (teacherId?: string) => Promise<void>
  fetchCourseById: (id: string) => Promise<void>
  createCourse: (teacherId: string, title: string, description: string) => Promise<void>
  updateCourse: (id: string, title: string, description: string) => Promise<void>
  deleteCourse: (id: string) => Promise<void>
  clearError: () => void
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  selectedCourse: null,
  isLoading: false,
  error: null,

  fetchCourses: async (teacherId?: string) => {
    set({ isLoading: true, error: null })
    try {
      const params = teacherId ? { teacher_id: teacherId } : {}
      const response = await axiosClient.get('/courses', { params })
      set({
        courses: response.data.courses || [],
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch courses'
      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  fetchCourseById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/courses/${id}`)
      set({
        selectedCourse: response.data,
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch course'
      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  createCourse: async (teacherId: string, title: string, description: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.post('/courses', {
        teacher_id: teacherId,
        title,
        description,
      })
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create course'
      set({
        error: errorMessage,
        isLoading: false,
      })
      throw err
    }
  },

  updateCourse: async (id: string, title: string, description: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.put(`/courses/${id}`, {
        title,
        description,
      })
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update course'
      set({
        error: errorMessage,
        isLoading: false,
      })
      throw err
    }
  },

  deleteCourse: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.delete(`/courses/${id}`)
      set((state) => ({
        courses: state.courses.filter((c) => c.id !== id),
        isLoading: false,
      }))
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete course'
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
