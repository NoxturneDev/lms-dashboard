import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useTeacherStore } from '@/stores/useTeacherStore'
import { useStatsStore } from '@/stores/useStatsStore'
import Navigation from '@/components/layout/Navigation'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  Users,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Award,
  Target,
} from 'lucide-react'

const CourseStats = () => {
  const { user } = useAuthStore()
  const { teacherCourses, fetchTeacherCourses } = useTeacherStore()
  const {
    courseStats,
    distribution,
    atRiskData,
    categoryMastery,
    isLoading,
    error,
    fetchAllStats,
    clearStats,
  } = useStatsStore()

  const [selectedCourseId, setSelectedCourseId] = useState<string>('')

  useEffect(() => {
    if (user?.id) {
      fetchTeacherCourses(user.id)
    }
  }, [user, fetchTeacherCourses])

  useEffect(() => {
    if (selectedCourseId) {
      fetchAllStats(selectedCourseId)
    } else {
      clearStats()
    }
  }, [selectedCourseId, fetchAllStats, clearStats])

  const bucketColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#14b8a6', '#06b6d4',
    '#3b82f6', '#6366f1',
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Course Analytics
          </h1>
          <p className="text-gray-600">
            View performance statistics and insights for your courses.
          </p>
        </div>

        {/* Course Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <label
            htmlFor="course-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select a Course
          </label>
          <select
            id="course-select"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Choose a course --</option>
            {teacherCourses.map((course) => (
              <option key={course.course_id || course.id} value={course.course_id || course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading stats...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 mb-8">
            {error}
          </div>
        )}

        {/* Stats Content */}
        {!isLoading && courseStats && (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {courseStats.total_students}
                    </p>
                  </div>
                  <Users className="text-blue-600" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Assignments</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {courseStats.total_assignments}
                    </p>
                  </div>
                  <BookOpen className="text-green-600" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Overall Average</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {courseStats?.overall_average?.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="text-amber-600" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">At-Risk Students</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {courseStats.at_risk_count}
                    </p>
                  </div>
                  <AlertTriangle
                    className={
                      courseStats.at_risk_count > 0
                        ? 'text-red-600'
                        : 'text-green-600'
                    }
                    size={32}
                  />
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm">Std Deviation</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {courseStats.overall_std_deviation.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm">Strongest Category</p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {courseStats.highest_performing_category || 'N/A'}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm">Weakest Category</p>
                <p className="text-2xl font-bold text-red-700 mt-1">
                  {courseStats.lowest_performing_category || 'N/A'}
                </p>
              </div>
            </div>

            {/* Performance Distribution Chart */}
            {distribution && distribution.buckets && distribution.buckets.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Score Distribution
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Mean: {distribution.mean.toFixed(1)} | Median:{' '}
                  {distribution.median.toFixed(1)} | Std Dev:{' '}
                  {distribution.std_deviation.toFixed(2)}
                </p>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distribution.buckets}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis allowDecimals={false} />
                      <Tooltip
                        formatter={(value: number, name: string) => {
                          if (name === 'count') return [value, 'Students']
                          return [value, name]
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {distribution.buckets.map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={bucketColors[index % bucketColors.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* At-Risk Students */}
            {atRiskData && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="text-red-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    At-Risk Students
                  </h2>
                  <span className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full">
                    {atRiskData.at_risk_count} of {atRiskData.total_students}
                  </span>
                </div>

                {atRiskData.at_risk_students && atRiskData.at_risk_students.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                            Student
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                            Number
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                            Average
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                            Class Mean
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                            Missing
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                            Risk Factors
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {atRiskData.at_risk_students.map((student) => (
                          <tr key={student.student_id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 text-gray-900 font-medium">
                              {student.student_name}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">
                              {student.student_number}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center text-red-600 font-semibold">
                              {student.current_average.toFixed(1)}%
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center text-gray-600">
                              {student.class_mean.toFixed(1)}%
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center text-gray-900">
                              {student.missing_assignments}/{student.total_assignments}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {student.risk_factors.map((factor, i) => (
                                  <span
                                    key={i}
                                    className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded"
                                  >
                                    {factor}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-green-700 font-medium">
                    No at-risk students detected. All students are performing well.
                  </p>
                )}
              </div>
            )}

            {/* Category Mastery */}
            {categoryMastery && categoryMastery.categories && categoryMastery.categories.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="text-blue-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Category Mastery
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryMastery.categories.map((cat) => {
                    const isStrongest =
                      cat.category === categoryMastery.strongest_category
                    const isWeakest =
                      cat.category === categoryMastery.weakest_category

                    return (
                      <div
                        key={cat.category}
                        className={`border rounded-lg p-4 ${isStrongest
                          ? 'border-green-300 bg-green-50'
                          : isWeakest
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">
                            {cat.category}
                          </h3>
                          {isStrongest && (
                            <Award className="text-green-600" size={20} />
                          )}
                          {isWeakest && (
                            <AlertTriangle className="text-red-500" size={20} />
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Avg %</span>
                            <span className="font-semibold text-gray-900">
                              {cat.average_percentage.toFixed(1)}%
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${isStrongest
                                ? 'bg-green-500'
                                : isWeakest
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                                }`}
                              style={{
                                width: `${Math.min(cat.average_percentage, 100)}%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              {cat.total_assignments} assignment
                              {cat.total_assignments !== 1 ? 's' : ''}
                            </span>
                            <span>
                              {cat.total_submissions} submission
                              {cat.total_submissions !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && !selectedCourseId && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">
              Select a course above to view analytics.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseStats
