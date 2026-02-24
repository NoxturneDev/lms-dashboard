import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { useAuthStore } from '@/stores/useAuthStore'
import { Building2, Users, GraduationCap, School } from 'lucide-react'
import axiosClient from '@/api/axiosClient'

const AdminDashboard = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    schools: 0,
    classes: 0,
    teachers: 0,
    students: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [schools, classes, teachers, students] = await Promise.all([
          axiosClient.get('/schools'),
          axiosClient.get('/classes'),
          axiosClient.get('/teachers'),
          axiosClient.get('/students'),
        ])
        setStats({
          schools: schools.data.schools?.length || 0,
          classes: classes.data.classes?.length || 0,
          teachers: teachers.data.teachers?.length || 0,
          students: students.data.students?.length || 0,
        })
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Schools', value: stats.schools, icon: Building2, color: 'bg-blue-500' },
    { label: 'Classes', value: stats.classes, icon: School, color: 'bg-green-500' },
    { label: 'Teachers', value: stats.teachers, icon: Users, color: 'bg-purple-500' },
    { label: 'Students', value: stats.students, icon: GraduationCap, color: 'bg-orange-500' },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading statistics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.label} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${card.color} p-3 rounded-lg`}>
                      <Icon size={24} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
                  <p className="text-gray-600 mt-1">{card.label}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
