import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'

export interface StudentProfile {
  id: string
  full_name: string
  email: string
  student_number: string
}

export interface AcademicRecord {
  course_title: string
  score: number
  assignment_title: string
  max_score: number
  assignment_id: string
}

export interface ReportCard {
  student_info: StudentProfile
  academic_record: AcademicRecord[]
  generated_at: string
}

export interface StudentCourse {
  course_id: string
  title: string
  description: string
  teacher_name: string
}

export interface StudentState {
  students: any[]
  reportCard: ReportCard | null
  courses: StudentCourse[]
  isLoading: boolean
  error: string | null
  fetchStudents: (classId?: string) => Promise<void>
  fetchStudentById: (id: string) => Promise<void>
  fetchStudentReportCard: (studentId: string) => Promise<void>
  fetchStudentCourses: (studentId: string) => Promise<void>
  createStudent: (email: string, fullName: string, password: string, studentNumber: string) => Promise<void>
  updateStudent: (id: string, data: Partial<any>) => Promise<void>
  deleteStudent: (id: string) => Promise<void>
  clearError: () => void
}

export const useStudentStore = create<StudentState>((set) => ({
  students: [],
  reportCard: null,
  courses: [],
  isLoading: false,
  error: null,

  fetchStudents: async (classId?: string) => {
    set({ isLoading: true, error: null })
    try {
      const params = classId ? { class_id: classId } : {}
      const response = await axiosClient.get('/students', { params })
      set({
        students: response.data.students || [],
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch students'
      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  fetchStudentById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.get(`/students/${id}`)
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch student'
      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  fetchStudentReportCard: async (studentId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/students/${studentId}/report-card`)
      set({
        reportCard: response.data,
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch report card'
      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  fetchStudentCourses: async (studentId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/students/${studentId}/courses`)
      set({
        courses: response.data.courses || [],
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch student courses'
      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  createStudent: async (email: string, fullName: string, password: string, studentNumber: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.post('/students', {
        email,
        full_name: fullName,
        password,
        student_number: studentNumber,
      })
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create student'
      set({
        error: errorMessage,
        isLoading: false,
      })
      throw err
    }
  },

  updateStudent: async (id: string, data: Partial<any>) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.put(`/students/${id}`, data)
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update student'
      set({
        error: errorMessage,
        isLoading: false,
      })
      throw err
    }
  },

  deleteStudent: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.delete(`/students/${id}`)
      set((state) => ({
        students: state.students.filter((s) => s.id !== id),
        isLoading: false,
      }))
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete student'
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
