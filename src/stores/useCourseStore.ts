import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'

export interface Course {
  id: string
  school_id: string
  school_name: string
  title: string
  description: string
  teacher_ids: string[]
  teacher_names: string[]
}

export interface CourseTeacher {
  teacher_id: string
  teacher_name: string
  teacher_email: string
}

export interface CourseState {
  courses: Course[]
  selectedCourse: Course | null
  courseTeachers: CourseTeacher[]
  isLoading: boolean
  error: string | null
  fetchCourses: (schoolId?: string) => Promise<void>
  fetchCourseById: (id: string) => Promise<void>
  createCourse: (schoolId: string, title: string, description: string) => Promise<void>
  updateCourse: (id: string, title: string, description: string) => Promise<void>
  deleteCourse: (id: string) => Promise<void>
  fetchCourseTeachers: (courseId: string) => Promise<void>
  assignTeacher: (courseId: string, teacherId: string) => Promise<void>
  unassignTeacher: (courseId: string, teacherId: string) => Promise<void>
  clearError: () => void
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  selectedCourse: null,
  courseTeachers: [],
  isLoading: false,
  error: null,

  fetchCourses: async (schoolId?: string) => {
    set({ isLoading: true, error: null })
    try {
      const params = schoolId ? { school_id: schoolId } : {}
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

  createCourse: async (schoolId: string, title: string, description: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.post('/courses', {
        school_id: schoolId,
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

  fetchCourseTeachers: async (courseId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/courses/${courseId}/teachers`)
      set({
        courseTeachers: response.data.teachers || [],
        isLoading: false,
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch course teachers'
      set({ error: errorMessage, isLoading: false })
    }
  },

  assignTeacher: async (courseId: string, teacherId: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.post(`/courses/${courseId}/teachers`, {
        teacher_id: teacherId,
      })
      set({ isLoading: false })
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to assign teacher'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  unassignTeacher: async (courseId: string, teacherId: string) => {
    set({ isLoading: true, error: null })
    try {
      await axiosClient.delete(`/courses/${courseId}/teachers/${teacherId}`)
      set((state) => ({
        courseTeachers: state.courseTeachers.filter((t) => t.teacher_id !== teacherId),
        isLoading: false,
      }))
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to unassign teacher'
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
