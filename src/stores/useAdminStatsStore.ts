import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'

export interface AtRiskStudent {
  student_id: string
  student_name: string
  course_id: string
  risk_level: 'CRITICAL' | 'WARNING'
  warning_reason: string
  current_average: number
  class_average: number
  detected_at: string
}

export interface AtRiskData {
  at_risk_students: AtRiskStudent[] | null
  total_critical: number
  total_warning: number
}

export interface EnrollmentProjection {
  year: number
  projected_students: number
  confidence_level: number
  trend: 'GROWING' | 'STABLE' | 'DECLINING'
}

export interface EnrollmentForecast {
  projections: EnrollmentProjection[] | null
  growth_rate: number
  forecast_accuracy: 'HIGH' | 'MEDIUM' | 'LOW'
  historical_data_points: number
}

export interface AdminStatsState {
  atRiskData: AtRiskData | null
  enrollmentForecast: EnrollmentForecast | null
  isLoading: boolean
  error: string | null
  fetchAtRiskStudents: () => Promise<void>
  fetchEnrollmentForecast: (years?: number) => Promise<void>
  fetchAllStudentAnalytics: (years?: number) => Promise<void>
  clearStats: () => void
}

export const useAdminStatsStore = create<AdminStatsState>((set) => ({
  atRiskData: null,
  enrollmentForecast: null,
  isLoading: false,
  error: null,

  fetchAtRiskStudents: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get('/stats/students/at-risk')
      set({ atRiskData: response.data, isLoading: false })
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Failed to fetch at-risk students',
        isLoading: false,
      })
    }
  },

  fetchEnrollmentForecast: async (years = 1) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get('/stats/students/enrollment-forecast', {
        params: { years },
      })
      set({ enrollmentForecast: response.data, isLoading: false })
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Failed to fetch enrollment forecast',
        isLoading: false,
      })
    }
  },

  fetchAllStudentAnalytics: async (years = 1) => {
    set({ isLoading: true, error: null })
    try {
      const [riskRes, forecastRes] = await Promise.all([
        axiosClient.get('/stats/students/at-risk'),
        axiosClient.get('/stats/students/enrollment-forecast', { params: { years } }),
      ])
      set({
        atRiskData: riskRes.data,
        enrollmentForecast: forecastRes.data,
        isLoading: false,
      })
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Failed to fetch student analytics',
        isLoading: false,
      })
    }
  },

  clearStats: () => {
    set({
      atRiskData: null,
      enrollmentForecast: null,
      error: null,
    })
  },
}))
