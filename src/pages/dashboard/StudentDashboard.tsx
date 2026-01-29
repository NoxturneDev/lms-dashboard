

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useStudentStore } from '@/stores/useStudentStore'
import Navigation from '@/components/layout/Navigation'
import { BookOpen, FileText, Award } from 'lucide-react'

const StudentDashboard = () => {
  const { user } = useAuthStore()
  const { courses, fetchStudentCourses, isLoading } = useStudentStore()

  useEffect(() => {
    if (user?.id) {
      fetchStudentCourses(user.id)
    }
  }, [user, fetchStudentCourses])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Student ID: {user?.student_number}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to={`/student/${user?.id}/report`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <FileText className="text-blue-600 mb-4" size={32} />
            <h3 className="text-lg font-semibold text-gray-900">View Report Card</h3>
            <p className="text-gray-600 text-sm mt-2">Check your academic records</p>
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6">
            <BookOpen className="text-green-600 mb-4" size={32} />
            <h3 className="text-lg font-semibold text-gray-900">
              {courses.length} Courses
            </h3>
            <p className="text-gray-600 text-sm mt-2">Currently enrolled</p>
          </div>

          <Link
            to="/courses"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <Award className="text-amber-600 mb-4" size={32} />
            <h3 className="text-lg font-semibold text-gray-900">Browse Courses</h3>
            <p className="text-gray-600 text-sm mt-2">Explore available courses</p>
          </Link>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Courses</h2>

          {isLoading ? (
            <p className="text-gray-600">Loading your courses...</p>
          ) : courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.course_id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Instructor: {course.teacher_name}
                      </p>
                      {course.description && (
                        <p className="text-gray-600 text-sm mt-2">
                          {course.description}
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/courses/${course.course_id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              You're not enrolled in any courses yet. <Link to="/courses" className="text-blue-600 hover:text-blue-700">Browse available courses</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
