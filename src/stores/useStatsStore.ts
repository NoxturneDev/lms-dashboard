import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'

export interface CourseStats {
  course_id: string
  total_students: number
  total_assignments: number
  overall_average: number
  overall_std_deviation: number
  at_risk_count: number
  total_grades_recorded: number
  highest_performing_category: string
  lowest_performing_category: string
}

export interface DistributionBucket {
  range: string
  min_score: number
  max_score: number
  count: number
  percentage: number
}

export interface PerformanceDistribution {
  course_id: string
  assignment_id: string
  buckets: DistributionBucket[] | null
  mean: number
  median: number
  std_deviation: number
  total_students: number
}

export interface AtRiskStudent {
  student_id: string
  student_name: string
  student_number: string
  current_average: number
  class_mean: number
  deviation_from_mean: number
  missing_assignments: number
  total_assignments: number
  risk_factors: string[]
}

export interface AtRiskData {
  course_id: string
  at_risk_students: AtRiskStudent[] | null
  class_mean: number
  class_std_deviation: number
  total_students: number
  at_risk_count: number
}

export interface CategoryMasteryItem {
  category: string
  average_score: number
  average_percentage: number
  total_assignments: number
  total_submissions: number
  std_deviation: number
}

export interface CategoryMastery {
  course_id: string
  categories: CategoryMasteryItem[] | null
  strongest_category: string
  weakest_category: string
}

export interface StatsState {
  courseStats: CourseStats | null
  distribution: PerformanceDistribution | null
  atRiskData: AtRiskData | null
  categoryMastery: CategoryMastery | null
  isLoading: boolean
  error: string | null
  fetchCourseStats: (courseId: string) => Promise<void>
  fetchDistribution: (courseId: string, assignmentId?: string) => Promise<void>
  fetchAtRisk: (courseId: string) => Promise<void>
  fetchCategoryMastery: (courseId: string) => Promise<void>
  fetchAllStats: (courseId: string) => Promise<void>
  clearStats: () => void
}

export const useStatsStore = create<StatsState>((set) => ({
  courseStats: null,
  distribution: null,
  atRiskData: null,
  categoryMastery: null,
  isLoading: false,
  error: null,

  fetchCourseStats: async (courseId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/courses/${courseId}/stats`)
      set({ courseStats: response.data, isLoading: false })
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch course stats', isLoading: false })
    }
  },

  fetchDistribution: async (courseId: string, assignmentId?: string) => {
    set({ isLoading: true, error: null })
    try {
      const params = assignmentId ? { assignment_id: assignmentId } : {}
      const response = await axiosClient.get(`/courses/${courseId}/stats/distribution`, { params })
      set({ distribution: response.data, isLoading: false })
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch distribution', isLoading: false })
    }
  },

  fetchAtRisk: async (courseId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/courses/${courseId}/stats/at-risk`)
      set({ atRiskData: response.data, isLoading: false })
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch at-risk students', isLoading: false })
    }
  },

  fetchCategoryMastery: async (courseId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosClient.get(`/courses/${courseId}/stats/category-mastery`)
      set({ categoryMastery: response.data, isLoading: false })
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch category mastery', isLoading: false })
    }
  },

  fetchAllStats: async (courseId: string) => {
    set({ isLoading: true, error: null })
    try {
      const [statsRes, distRes, riskRes, masteryRes] = await Promise.all([
        axiosClient.get(`/courses/${courseId}/stats`),
        axiosClient.get(`/courses/${courseId}/stats/distribution`),
        axiosClient.get(`/courses/${courseId}/stats/at-risk`),
        axiosClient.get(`/courses/${courseId}/stats/category-mastery`),
      ])
      set({
        courseStats: statsRes.data,
        distribution: distRes.data,
        atRiskData: riskRes.data,
        categoryMastery: masteryRes.data,
        isLoading: false,
      })
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch stats', isLoading: false })
    }
  },

  clearStats: () => {
    set({
      courseStats: null,
      distribution: null,
      atRiskData: null,
      categoryMastery: null,
      error: null,
    })
  },
}))
