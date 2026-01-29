import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useGradeStore } from '@/stores/useGradeStore'
import { useEnrollmentStore } from '@/stores/useEnrollmentStore'
import { useAssignmentStore } from '@/stores/useAssignmentStore'
import Navigation from '@/components/layout/Navigation'
import { ArrowLeft, Save, UserPlus } from 'lucide-react'

const Gradebook = () => {
  const { id: courseId } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const { gradebook, fetchGradebook, assignGrade, isLoading } = useGradeStore()
  const { enrollments, fetchCourseEnrollments, error: enrollmentError } = useEnrollmentStore()
  const { assignments, listAssignments, error: assignmentError } = useAssignmentStore()
  const [editingGrades, setEditingGrades] = useState<Record<string, number>>({})
  const [newGrades, setNewGrades] = useState<Record<string, number>>({})
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (courseId) {
      fetchGradebook(courseId)
      fetchCourseEnrollments(courseId)
      listAssignments(courseId)
    }
  }, [courseId, fetchGradebook, fetchCourseEnrollments, listAssignments])

  useEffect(() => {
    if (gradebook?.grades) {
      const initialGrades: Record<string, number> = {}
      gradebook.grades.forEach((grade) => {
        initialGrades[grade.grade_id] = grade.score
      })
      setEditingGrades(initialGrades)
    }
  }, [gradebook])

  // For the selected assignment, find enrolled students who don't have a grade yet
  const ungradedStudents = selectedAssignmentId
    ? enrollments.filter(
        (enrollment) =>
          !gradebook?.grades?.some(
            (g) =>
              g.student_id === enrollment.student_id &&
              g.assignment_id === selectedAssignmentId,
          ),
      )
    : []

  const selectedAssignment = assignments.find((a) => a.id === selectedAssignmentId)

  const handleGradeChange = (gradeId: string, newScore: number) => {
    setEditingGrades((prev) => ({
      ...prev,
      [gradeId]: newScore,
    }))
  }

  const handleNewGradeChange = (studentId: string, score: number) => {
    setNewGrades((prev) => ({
      ...prev,
      [studentId]: score,
    }))
  }

  const handleSaveGrades = async () => {
    if (!courseId || !user?.id) return

    setError(null)
    setSuccess(false)
    setSaving(true)

    try {
      // Save modified existing grades (each grade has its own assignment_id)
      if (gradebook?.grades) {
        for (const grade of gradebook.grades) {
          if (editingGrades[grade.grade_id] !== grade.score) {
            await assignGrade(
              user.id,
              grade.assignment_id,
              grade.student_id,
              editingGrades[grade.grade_id],
            )
          }
        }
      }

      // Assign new grades for the selected assignment
      if (selectedAssignmentId) {
        for (const [studentId, score] of Object.entries(newGrades)) {
          await assignGrade(user.id, selectedAssignmentId, studentId, score)
        }
      }

      setSuccess(true)
      setNewGrades({})
      await fetchGradebook(courseId)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save grades')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges =
    Object.keys(newGrades).length > 0 ||
    (gradebook?.grades?.some(
      (grade) => editingGrades[grade.grade_id] !== grade.score,
    ) ?? false)

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          to={courseId ? `/courses/${courseId}` : '/courses'}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Course
        </Link>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading gradebook...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gradebook
              </h1>
              {gradebook && (
                <p className="text-gray-600">{gradebook.course_title}</p>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  Grades saved successfully
                </div>
              )}
            </div>

            {/* Existing Grades Table */}
            {gradebook?.grades && gradebook.grades.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  All Grades
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-900">
                          Student Name
                        </th>
                        <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-900">
                          Student Number
                        </th>
                        <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-900">
                          Assignment
                        </th>
                        <th className="border border-gray-300 px-6 py-3 text-center font-semibold text-gray-900">
                          Score
                        </th>
                        <th className="border border-gray-300 px-6 py-3 text-center font-semibold text-gray-900">
                          Max
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradebook.grades.map((grade) => {
                        const score = editingGrades[grade.grade_id] ?? grade.score
                        return (
                          <tr key={grade.grade_id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-6 py-3 text-gray-900">
                              {grade.student_name}
                            </td>
                            <td className="border border-gray-300 px-6 py-3 text-gray-900">
                              {grade.student_number}
                            </td>
                            <td className="border border-gray-300 px-6 py-3 text-gray-900">
                              {grade.assignment_title}
                            </td>
                            <td className="border border-gray-300 px-6 py-3 text-center">
                              <input
                                type="number"
                                min="0"
                                max={grade.max_score}
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
                            <td className="border border-gray-300 px-6 py-3 text-center text-gray-500">
                              {grade.max_score}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Assign New Grades Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-2 mb-4">
                <UserPlus size={20} className="text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Assign New Grades
                </h2>
              </div>

              {/* Show errors from assignment/enrollment fetches */}
              {assignmentError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  Assignments: {assignmentError}
                </div>
              )}
              {enrollmentError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  Enrollments: {enrollmentError}
                </div>
              )}

              {assignments.length === 0 ? (
                <p className="text-gray-600">
                  No assignments yet. Go to the course page to create one first.
                </p>
              ) : enrollments.length === 0 ? (
                <p className="text-gray-600">
                  No students enrolled in this course yet.
                </p>
              ) : (
                <>
                  {/* Assignment Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Assignment
                    </label>
                    <select
                      value={selectedAssignmentId}
                      onChange={(e) => {
                        setSelectedAssignmentId(e.target.value)
                        setNewGrades({})
                      }}
                      className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Pick an assignment --</option>
                      {assignments.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.title} (max: {a.max_score})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ungraded Students for Selected Assignment */}
                  {selectedAssignmentId && ungradedStudents.length > 0 && (
                    <>
                      <p className="text-gray-600 text-sm mb-4">
                        Students enrolled but not yet graded for{' '}
                        <span className="font-medium">{selectedAssignment?.title}</span>
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-amber-50">
                              <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-900">
                                Student Name
                              </th>
                              <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-900">
                                Student Number
                              </th>
                              <th className="border border-gray-300 px-6 py-3 text-center font-semibold text-gray-900">
                                Score
                              </th>
                              <th className="border border-gray-300 px-6 py-3 text-center font-semibold text-gray-900">
                                Max
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {ungradedStudents.map((student) => {
                              const score = newGrades[student.student_id]
                              const hasScore = score !== undefined
                              return (
                                <tr key={student.student_id} className="hover:bg-amber-50/50">
                                  <td className="border border-gray-300 px-6 py-3 text-gray-900">
                                    {student.student_name}
                                  </td>
                                  <td className="border border-gray-300 px-6 py-3 text-gray-900">
                                    {student.student_number}
                                  </td>
                                  <td className="border border-gray-300 px-6 py-3 text-center">
                                    <input
                                      type="number"
                                      min="0"
                                      max={selectedAssignment?.max_score ?? 100}
                                      placeholder="--"
                                      value={hasScore ? score : ''}
                                      onChange={(e) =>
                                        handleNewGradeChange(
                                          student.student_id,
                                          parseInt(e.target.value) || 0,
                                        )
                                      }
                                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                  </td>
                                  <td className="border border-gray-300 px-6 py-3 text-center text-gray-500">
                                    {selectedAssignment?.max_score ?? 100}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {selectedAssignmentId && ungradedStudents.length === 0 && (
                    <p className="text-gray-600">
                      All enrolled students already have a grade for this assignment.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Save Button */}
            {hasChanges && (
              <div className="flex justify-end">
                <button
                  onClick={handleSaveGrades}
                  disabled={saving}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Save size={20} className="mr-2" />
                  {saving ? 'Saving...' : 'Save Grades'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Gradebook
