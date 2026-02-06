import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCourseStore } from '@/stores/useCourseStore'
import { useAssignmentStore, Assignment } from '@/stores/useAssignmentStore'
import { useEnrollmentStore } from '@/stores/useEnrollmentStore'
import Navigation from '@/components/layout/Navigation'
import { ArrowLeft, Users, BookOpen, Plus, Trash2, ClipboardList } from 'lucide-react'

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const { selectedCourse, fetchCourseById, isLoading } = useCourseStore()
  const { assignments, listAssignments, createAssignment, deleteAssignment } = useAssignmentStore()
  const { enrollStudent, studentCourses, fetchStudentEnrollments } = useEnrollmentStore()

  const [enrolling, setEnrolling] = useState(false)
  const [checkingEnrollment, setCheckingEnrollment] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if current student is enrolled in this course
  const enrolled = user?.userType === 'student' && studentCourses.some((course) => course.id === id)

  // Create assignment form
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newMaxScore, setNewMaxScore] = useState(100)
  const [creating, setCreating] = useState(false)

  const isOwner = user?.userType === 'teacher' && (selectedCourse?.teacher_ids?.includes(user.id) ?? false)

  useEffect(() => {
    if (id) {
      fetchCourseById(id)
      listAssignments(id)
    }
  }, [id, fetchCourseById, listAssignments])

  // Check enrollment status for students
  useEffect(() => {
    const checkEnrollment = async () => {
      if (user?.userType === 'student' && user.id) {
        setCheckingEnrollment(true)
        await fetchStudentEnrollments(user.id)
        setCheckingEnrollment(false)
      } else {
        setCheckingEnrollment(false)
      }
    }
    checkEnrollment()
  }, [user, fetchStudentEnrollments])

  const handleEnroll = async () => {
    if (!id || !user?.id) return
    setEnrolling(true)
    setError(null)
    try {
      await enrollStudent(user.id, id)
      // Refresh enrollments to update the enrolled state
      await fetchStudentEnrollments(user.id)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to enroll in course')
    } finally {
      setEnrolling(false)
    }
  }

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !newTitle.trim()) return
    setCreating(true)
    setError(null)
    try {
      await createAssignment(id, newTitle.trim(), newDescription.trim(), newMaxScore)
      setNewTitle('')
      setNewDescription('')
      setNewMaxScore(100)
      setShowCreateForm(false)
      await listAssignments(id)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create assignment')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteAssignment = async (assignment: Assignment) => {
    if (!id) return
    if (!window.confirm(`Delete "${assignment.title}"? This cannot be undone.`)) return
    setError(null)
    try {
      await deleteAssignment(assignment.id)
      await listAssignments(id)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete assignment')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          to="/courses"
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Courses
        </Link>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading course details...</p>
          </div>
        ) : selectedCourse ? (
          <div className="space-y-8">
            {/* Course Info */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {selectedCourse.title}
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <BookOpen size={18} />
                  {selectedCourse.teacher_names?.length > 0
                    ? `Instructor${selectedCourse.teacher_names.length > 1 ? 's' : ''}: ${selectedCourse.teacher_names.join(', ')}`
                    : 'No instructor assigned'}
                </p>
              </div>

              <div className="prose max-w-none mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {/* Student: Enroll */}
              {user?.userType === 'student' && (
                <div className="pt-6 border-t border-gray-200">
                  {checkingEnrollment ? (
                    <p className="text-gray-500">Checking enrollment status...</p>
                  ) : enrolled ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">
                      You are enrolled in this course
                    </div>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll in Course'}
                    </button>
                  )}
                </div>
              )}

              {/* Teacher: Quick Actions */}
              {isOwner && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex gap-4">
                    <Link
                      to={`/courses/${id}/gradebook`}
                      className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Users size={20} className="mr-2" />
                      View Gradebook
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Assignments Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ClipboardList size={22} className="text-gray-700" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Assignments
                  </h2>
                </div>
                {isOwner && !showCreateForm && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Plus size={18} className="mr-1" />
                    New Assignment
                  </button>
                )}
              </div>

              {/* Create Assignment Form */}
              {showCreateForm && (
                <form onSubmit={handleCreateAssignment} className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Create Assignment
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Midterm Exam"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="What this assignment covers..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Score
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newMaxScore}
                        onChange={(e) => setNewMaxScore(parseInt(e.target.value) || 100)}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={creating || !newTitle.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        {creating ? 'Creating...' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Assignment List */}
              {assignments.length > 0 ? (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {assignment.title}
                        </h3>
                        {assignment.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {assignment.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Max score: {assignment.max_score}
                        </p>
                      </div>
                      {isOwner && (
                        <button
                          onClick={() => handleDeleteAssignment(assignment)}
                          className="text-red-500 hover:text-red-700 p-2 rounded transition-colors"
                          title="Delete assignment"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  No assignments yet.{isOwner ? ' Create one above.' : ''}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Course not found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseDetails
