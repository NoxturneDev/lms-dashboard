

import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useStudentStore } from '@/stores/useStudentStore'
import Navigation from '@/components/layout/Navigation'
import { Download, ArrowLeft } from 'lucide-react'

const StudentReport = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const { reportCard, fetchStudentReportCard, isLoading, error } = useStudentStore()

  const studentId = id || user?.id

  useEffect(() => {
    if (studentId) {
      fetchStudentReportCard(studentId)
    }
  }, [studentId, fetchStudentReportCard])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download size={20} className="mr-2" />
            Download / Print
          </button>
        </div>

        {/* Report Card */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading report card...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
            {error}
          </div>
        ) : reportCard ? (
          <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
            {/* Student Info */}
            <div className="mb-8 pb-8 border-b-2 border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Report Card
              </h1>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-gray-600 text-sm">Student Name</p>
                  <p className="text-gray-900 font-semibold">
                    {reportCard.student_info.full_name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Student ID</p>
                  <p className="text-gray-900 font-semibold">
                    {reportCard.student_info.student_number}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="text-gray-900 font-semibold">
                    {reportCard.student_info.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Generated</p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(reportCard.generated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Records */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Academic Records
              </h2>

              {reportCard.academic_record.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-900">
                          Course
                        </th>
                        <th className="border border-gray-300 px-6 py-3 text-center font-semibold text-gray-900">
                          Score
                        </th>
                        <th className="border border-gray-300 px-6 py-3 text-center font-semibold text-gray-900">
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportCard.academic_record.map((record, idx) => {
                        const score = record.score
                        let grade = 'F'
                        let gradeColor = 'text-red-600'

                        if (score >= 90) {
                          grade = 'A'
                          gradeColor = 'text-green-600'
                        } else if (score >= 80) {
                          grade = 'B'
                          gradeColor = 'text-blue-600'
                        } else if (score >= 70) {
                          grade = 'C'
                          gradeColor = 'text-yellow-600'
                        } else if (score >= 60) {
                          grade = 'D'
                          gradeColor = 'text-orange-600'
                        }

                        return (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-6 py-3 text-gray-900">
                              {record.course_title}
                            </td>
                            <td className="border border-gray-300 px-6 py-3 text-center text-gray-900 font-semibold">
                              {score}
                            </td>
                            <td className={`border border-gray-300 px-6 py-3 text-center font-bold text-lg ${gradeColor}`}>
                              {grade}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">No academic records found.</p>
              )}

              {/* Summary Stats */}
              {reportCard.academic_record.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm">Average Score</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {(
                          reportCard.academic_record.reduce(
                            (sum, r) => sum + r.score,
                            0,
                          ) / reportCard.academic_record.length
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm">Highest Score</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {Math.max(
                          ...reportCard.academic_record.map((r) => r.score),
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm">Lowest Score</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {Math.min(
                          ...reportCard.academic_record.map((r) => r.score),
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No report card data available.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentReport
