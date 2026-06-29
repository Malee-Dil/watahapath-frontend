const EmptyState = ({ icon = '📭', title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-gray-700 mb-1" style={{ fontFamily: 'Yaldevi' }}>{title}</h3>
    {subtitle && <p className="text-gray-400 text-sm mb-6">{subtitle}</p>}
    {action && action}
  </div>
)

export default EmptyState
