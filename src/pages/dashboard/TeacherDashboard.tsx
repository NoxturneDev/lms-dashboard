
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCourseStore } from '@/stores/useCourseStore'
import axiosClient from '@/api/axiosClient'
import Navigation from '@/components/layout/Navigation'
import { BookOpen, Users, TrendingUp } from 'lucide-react'

interface TeacherDashboardData {
  teacher_id: string
  teacher_name: string
  total_courses: number
  total_students_enrolled: number
  courses: Array<{
    course_id: string
    title: string
    enrolled_count: number
  }>
}

const TeacherDashboard = () => {
  const { user } = useAuthStore()
  const { courses, fetchCourses, isLoading } = useCourseStore()
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return
      try {
        console.log(user.id)
        const response = await axiosClient.get(`/dashboard/teacher/${user.id}`)
        setDashboardData(response.data)
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load dashboard')
      }
    }

    fetchDashboardData()
    fetchCourses()
  }, [user, fetchCourses])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your courses.</p>
        </div>

        {/* Stats Cards */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Courses</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.total_courses}
                  </p>
                </div>
                <BookOpen className="text-blue-600" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Students Enrolled</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.total_students_enrolled}
                  </p>
                </div>
                <Users className="text-green-600" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Average Enrollment</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.total_courses > 0
                      ? Math.round(
                        dashboardData.total_students_enrolled /
                        dashboardData.total_courses,
                      )
                      : 0}
                  </p>
                </div>
                <TrendingUp className="text-amber-600" size={32} />
              </div>
            </div>
          </div>
        )}

        {/* Courses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
            <Link
              to="/courses"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              View All
            </Link>
          </div>

          {isLoading ? (
            <p className="text-gray-600">Loading courses...</p>
          ) : courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {course.description}
                      </p>
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No courses yet. Create one to get started!</p>
          )}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherDashboard
