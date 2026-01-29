

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useGradeStore } from '@/stores/useGradeStore'
import Navigation from '@/components/layout/Navigation'
import { ArrowLeft, Save } from 'lucide-react'

const Gradebook = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const { gradebook, fetchGradebook, assignGrade, isLoading } = useGradeStore()
  const [editingGrades, setEditingGrades] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (id) {
      fetchGradebook(id)
    }
  }, [id, fetchGradebook])

  useEffect(() => {
    if (gradebook?.grades) {
      const initialGrades: Record<string, number> = {}
      gradebook.grades.forEach((grade) => {
        initialGrades[grade.grade_id] = grade.score
      })
      setEditingGrades(initialGrades)
    }
  }, [gradebook])

  const handleGradeChange = (gradeId: string, newScore: number) => {
    setEditingGrades((prev) => ({
      ...prev,
      [gradeId]: newScore,
    }))
  }

  const handleSaveGrades = async () => {
    if (!id || !user?.id || !gradebook) return

    setError(null)
    setSuccess(false)

    try {
      // Save each modified grade
      for (const grade of gradebook.grades) {
        if (editingGrades[grade.grade_id] !== grade.score) {
          await assignGrade(
            user.id,
            id,
            grade.student_id,
            editingGrades[grade.grade_id],
          )
        }
      }
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save grades')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          to={id ? `/courses/${id}` : '/courses'}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Course
        </Link>

        {/* Gradebook */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading gradebook...</p>
          </div>
        ) : gradebook ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gradebook
              </h1>
              <p className="text-gray-600">{gradebook.course_title}</p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                ✓ Grades saved successfully
              </div>
            )}

            {gradebook.grades && gradebook.grades.length > 0 ? (
              <>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-900">
                          Student Name
                        </th>
                        <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-900">
                          Student ID
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
                      {gradebook.grades.map((grade) => {
                        const score = editingGrades[grade.grade_id] ?? grade.score
                        let gradeLabel = 'F'

                        if (score >= 90) gradeLabel = 'A'
                        else if (score >= 80) gradeLabel = 'B'
                        else if (score >= 70) gradeLabel = 'C'
                        else if (score >= 60) gradeLabel = 'D'

                        return (
                          <tr key={grade.grade_id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-6 py-3 text-gray-900">
                              {grade.student_name}
                            </td>
                            <td className="border border-gray-300 px-6 py-3 text-gray-900">
                              {grade.student_number}
                            </td>
                            <td className="border border-gray-300 px-6 py-3 text-center">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={score}
                                onChange={(e) =>
                                  handleGradeChange(
                                    grade.grade_id,
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                            <td className="border border-gray-300 px-6 py-3 text-center font-bold text-lg">
                              {gradeLabel}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleSaveGrades}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    <Save size={20} className="mr-2" />
                    Save Grades
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-600">No grades found for this course.</p>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Gradebook not found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Gradebook
