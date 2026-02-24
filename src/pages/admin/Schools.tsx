import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { useSchoolStore, School } from '@/stores/useSchoolStore'
import { Plus, Trash2, Edit2 } from 'lucide-react'

const Schools = () => {
  const { schools, fetchSchools, createSchool, updateSchool, deleteSchool, isLoading, error } = useSchoolStore()
  const [showForm, setShowForm] = useState(false)
  const [editingSchool, setEditingSchool] = useState<School | null>(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    fetchSchools()
  }, [fetchSchools])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingSchool) {
        await updateSchool(editingSchool.id, { name, address })
      } else {
        await createSchool(name, address)
      }
      setName('')
      setAddress('')
      setShowForm(false)
      setEditingSchool(null)
      await fetchSchools()
    } catch (err) {
      // Error handled by store
    }
  }

  const handleEdit = (school: School) => {
    setEditingSchool(school)
    setName(school.name)
    setAddress(school.address)
    setShowForm(true)
  }

  const handleDelete = async (school: School) => {
    if (!window.confirm(`Delete "${school.name}"? This cannot be undone.`)) return
    try {
      await deleteSchool(school.id)
      await fetchSchools()
    } catch (err) {
      // Error handled by store
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingSchool(null)
    setName('')
    setAddress('')
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schools</h1>
            <p className="text-gray-600 mt-2">Manage school information</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add School
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
              {editingSchool ? 'Edit School' : 'Add New School'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Central High School"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full address..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isLoading ? 'Saving...' : editingSchool ? 'Update' : 'Create'}
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
            <p className="text-gray-600">Loading schools...</p>
          </div>
        ) : schools.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Address</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schools.map((school) => (
                  <tr key={school.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">{school.name}</td>
                    <td className="px-6 py-4 text-gray-600">{school.address}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(school)}
                        className="text-blue-600 hover:text-blue-700 mr-3"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(school)}
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
            <p className="text-gray-600">No schools yet. Add one above.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Schools
