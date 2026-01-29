import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'

export interface EnrollmentItem {
  student_id: string
  student_name: string
  student_number: string
}

export interface EnrollmentState {
  enrollments: EnrollmentItem[]
  isLoading: boolean
  error: string | null
  enrollStudent: (studentId: string, courseId: string) => Promise<void>
  fetchCourseEnrollments: (courseId: string) => Promise<void>
  clearError: () => void
}

export const useEnrollmentStore = create<EnrollmentState>((set) => ({
  enrollments: [],
  isLoading: false,
  error: null,

  enrollStudent: async (studentId: string, courseId: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.post('/enrollments', {
        student_id: studentId,
        course_id: courseId,
      })
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to enroll student'
      set({
        error: errorMessage,
        isLoading: false,
      })
      throw err
    }
  },

  fetchCourseEnrollments: async (courseId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/courses/${courseId}/enrollments`)
      set({
        enrollments: response.data.enrollments || [],
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch enrollments'
      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
