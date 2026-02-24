import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { useAdminStore, Admin } from '@/stores/useAdminStore'
import { useSchoolStore } from '@/stores/useSchoolStore'
import { Plus, Trash2, Edit2 } from 'lucide-react'

const Admins = () => {
  const { admins, fetchAdmins, createAdmin, updateAdmin, deleteAdmin, isLoading, error } = useAdminStore()
  const { schools, fetchSchools } = useSchoolStore()
  const [showForm, setShowForm] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [schoolId, setSchoolId] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    fetchAdmins()
    fetchSchools()
  }, [fetchAdmins, fetchSchools])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingAdmin) {
        const data: any = { email, full_name: fullName, school_id: schoolId }
        if (password) data.password = password
        await updateAdmin(editingAdmin.id, data)
      } else {
        await createAdmin(email, password, fullName, schoolId)
      }
      setEmail('')
      setFullName('')
      setSchoolId('')
      setPassword('')
      setShowForm(false)
      setEditingAdmin(null)
      await fetchAdmins()
    } catch (err) {
      // Error handled by store
    }
  }

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin)
    setEmail(admin.email)
    setFullName(admin.full_name)
    setSchoolId(admin.school_id)
    setPassword('')
    setShowForm(true)
  }

  const handleDelete = async (admin: Admin) => {
    if (!window.confirm(`Delete "${admin.full_name}"? This cannot be undone.`)) return
    try {
      await deleteAdmin(admin.id)
      await fetchAdmins()
    } catch (err) {
      // Error handled by store
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingAdmin(null)
    setEmail('')
    setFullName('')
    setSchoolId('')
    setPassword('')
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admins</h1>
            <p className="text-gray-600 mt-2">Manage admin accounts</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Admin
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
              {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
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
                  placeholder="e.g. Admin User"
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
                  placeholder="admin@school.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School
                </label>
                <select
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select School --</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingAdmin && '(leave blank to keep unchanged)'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editingAdmin}
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
                  {isLoading ? 'Saving...' : editingAdmin ? 'Update' : 'Create'}
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
            <p className="text-gray-600">Loading admins...</p>
          </div>
        ) : admins.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">School</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">{admin.full_name}</td>
                    <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                    <td className="px-6 py-4 text-gray-600">{admin.school_name}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-blue-600 hover:text-blue-700 mr-3"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(admin)}
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
            <p className="text-gray-600">No admins yet. Add one above.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Admins
