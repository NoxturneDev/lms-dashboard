import { useEffect, useState } from 'react'
import { useAdminStatsStore } from '@/stores/useAdminStatsStore'
import AdminLayout from '@/components/layout/AdminLayout'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { AlertTriangle, TrendingUp, Users } from 'lucide-react'

const StudentAnalytics = () => {
  const {
    atRiskData,
    enrollmentForecast,
    isLoading,
    error,
    fetchAllStudentAnalytics,
  } = useAdminStatsStore()

  const [forecastYears, setForecastYears] = useState(1)

  useEffect(() => {
    fetchAllStudentAnalytics(forecastYears)
  }, [forecastYears, fetchAllStudentAnalytics])

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            System-wide student insights and enrollment forecasting.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading analytics...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 mb-8">
            {error}
          </div>
        )}

        {/* Stats Content */}
        {!isLoading && !error && (
          <div className="space-y-8">
            {/* Overview Cards */}
            {atRiskData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total At-Risk</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {atRiskData.at_risk_students?.length || 0}
                      </p>
                    </div>
                    <AlertTriangle className="text-orange-600" size={32} />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Critical Level</p>
                      <p className="text-3xl font-bold text-red-600">
                        {atRiskData.total_critical}
                      </p>
                    </div>
                    <AlertTriangle className="text-red-600" size={32} />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Warning Level</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {atRiskData.total_warning}
                      </p>
                    </div>
                    <AlertTriangle className="text-yellow-600" size={32} />
                  </div>
                </div>
              </div>
            )}

            {/* At-Risk Students Section */}
            {atRiskData && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="text-orange-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    At-Risk Students
                  </h2>
                  <span className="bg-orange-100 text-orange-700 text-sm font-medium px-3 py-1 rounded-full">
                    {atRiskData.at_risk_students?.length || 0} total
                  </span>
                </div>

                {atRiskData.at_risk_students && atRiskData.at_risk_students.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                            Student Name
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                            Course
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                            Risk Level
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                            Current Avg
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                            Class Avg
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                            Reason
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                            Detected
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {atRiskData.at_risk_students.map((student, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 text-gray-900 font-medium">
                              {student.student_name}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600 text-sm">
                              {student.course_id}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  student.risk_level === 'CRITICAL'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {student.risk_level}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center text-red-600 font-semibold">
                              {student.current_average.toFixed(1)}%
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center text-gray-600">
                              {student.class_average.toFixed(1)}%
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600 text-sm">
                              {student.warning_reason}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600 text-xs">
                              {new Date(student.detected_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-green-700 font-medium">
                    No at-risk students detected across the system.
                  </p>
                )}
              </div>
            )}

            {/* Enrollment Forecast Section */}
            {enrollmentForecast && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Enrollment Forecast
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        enrollmentForecast.forecast_accuracy === 'HIGH'
                          ? 'bg-green-100 text-green-700'
                          : enrollmentForecast.forecast_accuracy === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {enrollmentForecast.forecast_accuracy} Accuracy
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div>
                      <p className="text-gray-600 text-sm">Growth Rate</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {enrollmentForecast.growth_rate.toFixed(1)}%/year
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Historical Data Points</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {enrollmentForecast.historical_data_points}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <label
                      htmlFor="forecast-years"
                      className="text-sm font-medium text-gray-700"
                    >
                      Forecast Years:
                    </label>
                    <select
                      id="forecast-years"
                      value={forecastYears}
                      onChange={(e) => setForecastYears(parseInt(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={1}>1 year</option>
                      <option value={2}>2 years</option>
                      <option value={3}>3 years</option>
                      <option value={4}>4 years</option>
                      <option value={5}>5 years</option>
                    </select>
                  </div>
                </div>

                {enrollmentForecast.projections &&
                  enrollmentForecast.projections.length > 0 && (
                    <>
                      {/* Chart */}
                      <div className="h-80 mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={enrollmentForecast.projections}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="year"
                              label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }}
                            />
                            <YAxis label={{ value: 'Students', angle: -90, position: 'insideLeft' }} />
                            <Tooltip
                              formatter={(value) => [
                                typeof value === 'number' ? value.toFixed(0) : value,
                                'Projected Students',
                              ]}
                            />
                            <Line
                              type="monotone"
                              dataKey="projected_students"
                              stroke="#3b82f6"
                              dot={{ r: 5 }}
                              activeDot={{ r: 7 }}
                              strokeWidth={2}
                              name="Projected Students"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                                Year
                              </th>
                              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                                Projected Students
                              </th>
                              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                                Confidence
                              </th>
                              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                                Trend
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {enrollmentForecast.projections.map((proj) => (
                              <tr key={proj.year} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-3 text-gray-900 font-semibold">
                                  {proj.year}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center text-gray-900 font-semibold">
                                  {Math.round(proj.projected_students)}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center text-gray-600">
                                  {(proj.confidence_level * 100).toFixed(1)}%
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                      proj.trend === 'GROWING'
                                        ? 'bg-green-100 text-green-700'
                                        : proj.trend === 'STABLE'
                                          ? 'bg-blue-100 text-blue-700'
                                          : 'bg-red-100 text-red-700'
                                    }`}
                                  >
                                    {proj.trend}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && !atRiskData && !enrollmentForecast && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">No analytics data available yet.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default StudentAnalytics
