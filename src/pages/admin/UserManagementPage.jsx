import { useEffect, useState } from 'react'
import { Search, CheckCircle, XCircle, ShieldOff, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { SI } from '../../utils/constants'
import { formatDate } from '../../utils/helpers'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { authService } from '../../services/authService'


const ROLE_TABS = [
  { value: 'all', label: 'සියල්ල' },
  { value: 'customer', label: SI.customers },
  { value: 'producer', label: SI.producers },
]

const UserManagementPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [confirm, setConfirm] = useState(null)
  
  useEffect(() => {
    fetchUsers()
      }, [])

      const fetchUsers = async () => {
        try {
          setLoading(true)

          const res = await authService.getAllUsers()

          setUsers(res.data.data || res.data)
        } catch (err) {
          toast.error('Users load කරන්න බැරි වුණා')
          console.error(err)
        } finally {
          setLoading(false)
        }
      }// { id, action, label }

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

 const handleAction = async () => {
  try {
    const { id, action } = confirm

    if (action === 'approve') {
      await authService.approveProducer(id)
    }

    if (action === 'reject') {
      await authService.rejectProducer(id)
    }

    if (action === 'activate') {
      await authService.activateUser(id)
    }

    if (action === 'deactivate') {
      await authService.deactivateUser(id)
    }

    toast.success('Updated successfully')

    fetchUsers() // 🔥 always sync with DB
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error occurred')
  } finally {
    setConfirm(null)
  }
}

  const getStatusBadge = (status) => {
    const map = {
      active: 'badge-green',
      approved: 'badge-green',
      inactive: 'badge-gray',
      pending: 'badge-yellow',
      rejected: 'badge-red',
    }
    const labels = {
      active: SI.active,
      approved: SI.approved,
      inactive: SI.inactive,
      pending: SI.pending_approval,
      rejected: SI.rejected,
    }
    return <span className={map[status] || 'badge-gray'}>{labels[status] || status}</span>
  }

  if (loading) {
    return (
      <div className="card p-10 text-center">
        Loading users...
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">{SI.userManagement}</h1>
        <span className="badge-blue">{users.length} {SI.totalUsers}</span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: SI.allUsers, count: users.length, icon: '👥', color: 'bg-blue-50 text-blue-700' },
          { label: SI.customers, count: users.filter(u => u.role === 'customer').length, icon: '🛒', color: 'bg-primary-50 text-primary-700' },
          { label: SI.producers, count: users.filter(u => u.role === 'producer').length, icon: '🌾', color: 'bg-green-50 text-green-700' },
          { label: SI.pending_approval, count: users.filter(u => u.status === 'pending').length, icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Yaldevi' }}>{s.count}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="නම හෝ ඊමේල් සොයන්න..."
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {ROLE_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setRoleFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                roleFilter === tab.value
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">{SI.name}</th>
                <th className="table-header">{SI.email}</th>
                <th className="table-header">භූමිකාව</th>
                <th className="table-header">{SI.status}</th>
                <th className="table-header">{SI.createdAt}</th>
                <th className="table-header">{SI.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="table-cell text-gray-500 text-xs">{user.email}</td>
                  <td className="table-cell">
                    <span className={`badge ${user.role === 'producer' ? 'badge-green' : user.role === 'admin' ? 'badge-blue' : 'badge-gray'}`}>
                      {user.role === 'producer' ? SI.producer : user.role === 'admin' ? SI.admin : SI.customer}
                    </span>
                  </td>
                  <td className="table-cell">{getStatusBadge(user.status)}</td>
                  <td className="table-cell text-xs text-gray-400">{formatDate(user.createdAt)}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                      {user.role === 'producer' && user.status === 'pending' && (
                        <>
                          <button
                            onClick={() => setConfirm({ id: user._id, action: 'approve', label: SI.approveProducer, danger: false })}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title={SI.approveProducer}
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => setConfirm({ id: user._id, action: 'reject', label: SI.rejectProducer, danger: true })}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title={SI.rejectProducer}
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      {user.status === 'active' || user.status === 'approved' ? (
                        <button
                          onClick={() => setConfirm({ id: user._id, action: 'deactivate', label: SI.deactivate, danger: true })}
                          className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                          title={SI.deactivate}
                        >
                          <ShieldOff size={16} />
                        </button>
                      ) : user.status === 'inactive' ? (
                        <button
                          onClick={() => setConfirm({ id: user._id, action: 'activate', label: SI.activate, danger: false })}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title={SI.activate}
                        >
                          <Shield size={16} />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">{SI.noData}</div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleAction}
        title={confirm?.label}
        message="ඔබට මෙම ක්‍රියාව සිදු කිරීමට අවශ්‍ය බව ඔබට විශ්වාසද?"
        confirmLabel={confirm?.label}
        danger={confirm?.danger !== false}
      />
    </div>
  )
}

export default UserManagementPage
