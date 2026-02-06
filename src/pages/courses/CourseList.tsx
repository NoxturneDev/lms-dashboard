import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useTeacherStore } from '@/stores/useTeacherStore'
import { useCourseStore } from '@/stores/useCourseStore'
import { useEnrollmentStore } from '@/stores/useEnrollmentStore'
import Navigation from '@/components/layout/Navigation'
import { Plus, CheckCircle } from 'lucide-react'

const CourseList = () => {
  const { user } = useAuthStore()
  const { teacherCourses, fetchTeacherCourses, isLoading: teacherLoading } = useTeacherStore()
  const { courses, fetchCourses, isLoading: coursesLoading } = useCourseStore()
  const { studentCourses, fetchStudentEnrollments } = useEnrollmentStore()

  const isTeacher = user?.userType === 'teacher'
  const isStudent = user?.userType === 'student'
  const isLoading = isTeacher ? teacherLoading : coursesLoading

  const enrolledCourseIds = new Set(studentCourses.map((c) => c.id))

  useEffect(() => {
    if (isTeacher && user?.id) {
      fetchTeacherCourses(user.id)
    } else {
      fetchCourses()
    }
  }, [user?.id, user?.userType, fetchTeacherCourses, fetchCourses])

  useEffect(() => {
    if (isStudent && user?.id) {
      fetchStudentEnrollments(user.id)
    }
  }, [user?.id, isStudent, fetchStudentEnrollments])

  const displayCourses = isTeacher
    ? teacherCourses.map((c) => ({ ...c, id: c.course_id }))
    : courses

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {isTeacher ? 'My Courses' : 'Available Courses'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isTeacher
                ? 'Courses you are assigned to teach'
                : 'Browse and enroll in courses'}
            </p>
          </div>
          {isTeacher && (
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
        ) : displayCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCourses.map((course) => {
              const isEnrolled = isStudent && enrolledCourseIds.has(course.id)
              return (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 relative"
                >
                  {/* Enrolled Badge for Students */}
                  {isEnrolled && (
                    <div className="absolute top-4 right-4 flex items-center text-green-600 text-sm font-medium">
                      <CheckCircle size={16} className="mr-1" />
                      Enrolled
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 pr-20">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <p className="text-gray-700 font-medium text-sm">
                    {course.teacher_names?.length > 0
                      ? `Instructor${course.teacher_names.length > 1 ? 's' : ''}: ${course.teacher_names.join(', ')}`
                      : 'No instructor assigned'}
                  </p>
                  {course.school_name && (
                    <p className="text-gray-500 text-xs mt-2">
                      {course.school_name}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">
              {isTeacher
                ? 'You have no courses assigned yet.'
                : 'No courses available yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseList
