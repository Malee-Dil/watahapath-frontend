import { ORDER_STATUS_SI, ORDER_STATUS_COLORS } from '../../utils/constants'

const OrderStatusBadge = ({ status }) => {
  const colorClass = ORDER_STATUS_COLORS[status] || 'badge-gray'
  const label = ORDER_STATUS_SI[status] || status

  return <span className={colorClass}>{label}</span>
}

export default OrderStatusBadge
