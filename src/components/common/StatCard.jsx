const StatCard = ({ icon, label, value, color = 'primary', trend }) => {
  const colorMap = {
    primary: { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
    gold: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100' },
  }
  const c = colorMap[color] || colorMap.primary

  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.border} border flex items-center justify-center text-xl shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 mb-0.5">{label}</p>
        <p className={`text-2xl font-bold ${c.text}`} style={{ fontFamily: 'Yaldevi' }}>{value}</p>
        {trend && (
          <p className={`text-xs mt-1 ${trend.positive ? 'text-green-600' : 'text-red-500'}`}>
            {trend.positive ? '↑' : '↓'} {trend.label}
          </p>
        )}
      </div>
    </div>
  )
}

export default StatCard
