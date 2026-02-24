import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { useStudentStore } from '@/stores/useStudentStore'
import { Plus, Trash2, Edit2 } from 'lucide-react'

const AdminStudents = () => {
  const { students, fetchStudents, createStudent, updateStudent, deleteStudent, isLoading, error } = useStudentStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [studentNumber, setStudentNumber] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        const data: any = { email, full_name: fullName, student_number: studentNumber }
        if (password) data.password = password
        await updateStudent(editingId, data)
      } else {
        await createStudent(email, fullName, password, studentNumber)
      }
      setEmail('')
      setFullName('')
      setStudentNumber('')
      setPassword('')
      setShowForm(false)
      setEditingId(null)
      await fetchStudents()
    } catch (err) {
      // Error handled by store
    }
  }

  const handleEdit = (student: any) => {
    setEditingId(student.id)
    setEmail(student.email)
    setFullName(student.full_name)
    setStudentNumber(student.student_number)
    setPassword('')
    setShowForm(true)
  }

  const handleDelete = async (student: any) => {
    if (!window.confirm(`Delete "${student.full_name}"? This cannot be undone.`)) return
    try {
      await deleteStudent(student.id)
      await fetchStudents()
    } catch (err) {
      // Error handled by store
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setEmail('')
    setFullName('')
    setStudentNumber('')
    setPassword('')
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-2">Manage student accounts</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Student
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingId ? 'Edit Student' : 'Add New Student'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Number
                </label>
                <input
                  type="text"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. STD-2026-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="student@school.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingId && '(leave blank to keep unchanged)'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editingId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isLoading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {isLoading && !showForm ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading students...</p>
          </div>
        ) : students.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student Number</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">{student.full_name}</td>
                    <td className="px-6 py-4 text-gray-600">{student.student_number}</td>
                    <td className="px-6 py-4 text-gray-600">{student.email}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 hover:text-blue-700 mr-3"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(student)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No students yet. Add one above.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminStudents
