

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCourseStore } from '@/stores/useCourseStore'
import Navigation from '@/components/layout/Navigation'
import { Plus } from 'lucide-react'

const CourseList = () => {
  const { user } = useAuthStore()
  const { courses, fetchCourses, isLoading } = useCourseStore()

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600 mt-2">Browse all available courses</p>
          </div>
          {user?.userType === 'teacher' && (
            <Link
              to="/create-course"
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Create Course
            </Link>
          )}
        </div>

        {/* Courses List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading courses...</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {course.description}
                </p>
                <p className="text-gray-700 font-medium text-sm">
                  Instructor: {course.teacher_name}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">No courses available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseList
