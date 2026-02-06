import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'

export interface EnrollmentItem {
  student_id: string
  student_name: string
  student_number: string
}

export interface StudentEnrollmentCourse {
  id: string
  school_id: string
  school_name: string
  title: string
  description: string
  teacher_ids: string[]
  teacher_names: string[]
}

export interface EnrollmentState {
  enrollments: EnrollmentItem[]
  studentCourses: StudentEnrollmentCourse[]
  isLoading: boolean
  error: string | null
  enrollStudent: (studentId: string, courseId: string) => Promise<void>
  unenrollStudent: (studentId: string, courseId: string) => Promise<void>
  fetchCourseEnrollments: (courseId: string) => Promise<void>
  fetchStudentEnrollments: (studentId: string) => Promise<void>
  clearError: () => void
}

export const useEnrollmentStore = create<EnrollmentState>((set) => ({
  enrollments: [],
  studentCourses: [],
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

  unenrollStudent: async (studentId: string, courseId: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.delete('/enrollments', {
        data: {
          student_id: studentId,
          course_id: courseId,
        },
      })
      set((state) => ({
        enrollments: state.enrollments.filter((e) => e.student_id !== studentId),
        isLoading: false,
      }))
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to unenroll student'
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
        enrollments: response.data.students || [],
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

  fetchStudentEnrollments: async (studentId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/students/${studentId}/enrollments`)
      set({
        studentCourses: response.data.courses || [],
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch student enrollments'
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
