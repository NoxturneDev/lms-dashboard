import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'

export interface Grade {
  grade_id: string
  student_id: string
  student_name: string
  student_number: string
  score: number
}

export interface Gradebook {
  course_id: string
  course_title: string
  grades: Grade[]
}

export interface GradeState {
  gradebook: Gradebook | null
  isLoading: boolean
  error: string | null
  fetchGradebook: (courseId: string) => Promise<void>
  assignGrade: (teacherId: string, courseId: string, studentId: string, score: number) => Promise<void>
  clearError: () => void
}

export const useGradeStore = create<GradeState>((set) => ({
  gradebook: null,
  isLoading: false,
  error: null,

  fetchGradebook: async (courseId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/courses/${courseId}/grades`)
      set({
        gradebook: response.data,
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch gradebook'
      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  assignGrade: async (teacherId: string, courseId: string, studentId: string, score: number) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.post('/grades', {
        teacher_id: teacherId,
        course_id: courseId,
        student_id: studentId,
        score,
      })
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to assign grade'
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
