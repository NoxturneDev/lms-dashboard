

import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCourseStore } from '@/stores/useCourseStore'
import axiosClient from '@/api/axiosClient'
import Navigation from '@/components/layout/Navigation'
import { ArrowLeft, Users, BookOpen } from 'lucide-react'
import { useState } from 'react'

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const { selectedCourse, fetchCourseById, isLoading } = useCourseStore()
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchCourseById(id)
    }
  }, [id, fetchCourseById])

  const handleEnroll = async () => {
    if (!id || !user?.id) return

    setEnrolling(true)
    setError(null)

    try {
      await axiosClient.post('/enrollments', {
        student_id: user.id,
        course_id: id,
      })
      setEnrolled(true)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to enroll in course')
    } finally {
      setEnrolling(false)
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

        {/* Course Details */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading course details...</p>
          </div>
        ) : selectedCourse ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {selectedCourse.title}
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <BookOpen size={18} />
                Instructor: {selectedCourse.teacher_name}
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

            {/* Enrollment Section */}
            {user?.userType === 'student' && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}

                {enrolled ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">
                    ✓ You are enrolled in this course
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

            {/* Teacher View */}
            {user?.userType === 'teacher' && user.id === selectedCourse.teacher_id && (
              <div className="mt-8 pt-8 border-t border-gray-200">
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
