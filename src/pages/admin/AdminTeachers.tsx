import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { useTeacherStore } from '@/stores/useTeacherStore'
import { Plus, Trash2, Edit2 } from 'lucide-react'

const AdminTeachers = () => {
  const { teachers, fetchTeachers, createTeacher, updateTeacher, deleteTeacher, isLoading, error } = useTeacherStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        const data: any = { email, full_name: fullName }
        if (password) data.password = password
        await updateTeacher(editingId, data)
      } else {
        await createTeacher(email, fullName, password)
      }
      setEmail('')
      setFullName('')
      setPassword('')
      setShowForm(false)
      setEditingId(null)
      await fetchTeachers()
    } catch (err) {
      // Error handled by store
    }
  }

  const handleEdit = (teacher: any) => {
    setEditingId(teacher.id)
    setEmail(teacher.email)
    setFullName(teacher.full_name)
    setPassword('')
    setShowForm(true)
  }

  const handleDelete = async (teacher: any) => {
    if (!window.confirm(`Delete "${teacher.full_name}"? This cannot be undone.`)) return
    try {
      await deleteTeacher(teacher.id)
      await fetchTeachers()
    } catch (err) {
      // Error handled by store
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setEmail('')
    setFullName('')
    setPassword('')
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
            <p className="text-gray-600 mt-2">Manage teacher accounts</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Teacher
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
              {editingId ? 'Edit Teacher' : 'Add New Teacher'}
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
                  placeholder="e.g. John Doe"
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
                  placeholder="teacher@school.edu"
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
            <p className="text-gray-600">Loading teachers...</p>
          </div>
        ) : teachers.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">{teacher.full_name}</td>
                    <td className="px-6 py-4 text-gray-600">{teacher.email}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="text-blue-600 hover:text-blue-700 mr-3"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher)}
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
            <p className="text-gray-600">No teachers yet. Add one above.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminTeachers
