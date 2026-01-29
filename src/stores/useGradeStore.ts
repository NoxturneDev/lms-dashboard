import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'

export interface Grade {
  grade_id: string
  student_id: string
  student_name: string
  student_number: string
  score: number
  assignment_title: string
  max_score: number
  assignment_id: string
}

export interface Gradebook {
  course_id: string
  course_title: string
  grades: Grade[]
}

export interface AssignmentGradeItem {
  assignment_id: string
  assignment_title: string
  score: number
  max_score: number
}

export interface StudentCourseGrade {
  course_id: string
  course_title: string
  student_id: string
  overall_score: number
  total_score: number
  total_max_score: number
  assignments: AssignmentGradeItem[]
}

export interface GradeState {
  gradebook: Gradebook | null
  studentCourseGrade: StudentCourseGrade | null
  isLoading: boolean
  error: string | null
  fetchGradebook: (courseId: string) => Promise<void>
  assignGrade: (teacherId: string, assignmentId: string, studentId: string, score: number) => Promise<void>
  fetchStudentCourseGrade: (courseId: string, studentId: string) => Promise<void>
  clearError: () => void
}

export const useGradeStore = create<GradeState>((set) => ({
  gradebook: null,
  studentCourseGrade: null,
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
      set({ error: errorMessage, isLoading: false })
    }
  },

  assignGrade: async (teacherId: string, assignmentId: string, studentId: string, score: number) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.post('/grades', {
        teacher_id: teacherId,
        assignment_id: assignmentId,
        student_id: studentId,
        score,
      })
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to assign grade'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  fetchStudentCourseGrade: async (courseId: string, studentId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/courses/${courseId}/student-grade`, {
        params: { student_id: studentId },
      })
      set({
        studentCourseGrade: response.data,
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch student course grade'
      set({ error: errorMessage, isLoading: false })
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
