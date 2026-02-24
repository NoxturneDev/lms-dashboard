import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { useClassStore, Class } from '@/stores/useClassStore'
import { useSchoolStore } from '@/stores/useSchoolStore'
import { Plus, Trash2, Edit2 } from 'lucide-react'

const Classes = () => {
  const { classes, fetchClasses, createClass, updateClass, deleteClass, isLoading, error } = useClassStore()
  const { schools, fetchSchools } = useSchoolStore()
  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [schoolId, setSchoolId] = useState('')
  const [name, setName] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')

  useEffect(() => {
    fetchClasses()
    fetchSchools()
  }, [fetchClasses, fetchSchools])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingClass) {
        await updateClass(editingClass.id, { name, grade_level: gradeLevel })
      } else {
        await createClass(schoolId, name, gradeLevel)
      }
      setSchoolId('')
      setName('')
      setGradeLevel('')
      setShowForm(false)
      setEditingClass(null)
      await fetchClasses()
    } catch (err) {
      // Error handled by store
    }
  }

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem)
    setName(classItem.name)
    setGradeLevel(classItem.grade_level)
    setShowForm(true)
  }

  const handleDelete = async (classItem: Class) => {
    if (!window.confirm(`Delete "${classItem.name}"? This cannot be undone.`)) return
    try {
      await deleteClass(classItem.id)
      await fetchClasses()
    } catch (err) {
      // Error handled by store
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingClass(null)
    setSchoolId('')
    setName('')
    setGradeLevel('')
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
            <p className="text-gray-600 mt-2">Manage class information</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Class
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
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </h2>
            <div className="space-y-4">
              {!editingClass && (
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
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Class 10-A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Level
                </label>
                <input
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 10th Grade"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isLoading ? 'Saving...' : editingClass ? 'Update' : 'Create'}
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
            <p className="text-gray-600">Loading classes...</p>
          </div>
        ) : classes.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">School</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Grade Level</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {classes.map((classItem) => (
                  <tr key={classItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">{classItem.name}</td>
                    <td className="px-6 py-4 text-gray-600">{classItem.school_name}</td>
                    <td className="px-6 py-4 text-gray-600">{classItem.grade_level}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(classItem)}
                        className="text-blue-600 hover:text-blue-700 mr-3"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(classItem)}
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
            <p className="text-gray-600">No classes yet. Add one above.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Classes
