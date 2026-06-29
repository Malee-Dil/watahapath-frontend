import { useState, useEffect, useCallback } from 'react'
import { productService } from '../services/productService'
import { orderService, userService } from '../services/orderService'
import toast from 'react-hot-toast'
import { SI } from '../utils/constants'

/**
 * useProducts – fetch & manage products list
 */
export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await productService.getAll(params)
      setProducts(Array.isArray(res.data) ? res.data : [])
      setPagination(res.pagination || null)
    } catch (err) {
      setError(err)
      toast.error('නිෂ්පාදන පූරණය වීමේ දෝෂය')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const deleteProduct = async (id) => {
    try {
      await productService.delete(id)
      setProducts(prev => prev.filter(p => p._id !== id))
      toast.success('නිෂ්පාදනය මකා දමන ලදී')
    } catch {
      toast.error('මකා දැමීම අසාර්ථකයි')
    }
  }

  return { products, pagination, loading, error, refetch: fetchProducts, deleteProduct }
}
/**
 * useOrders – fetch & manage orders
 */
export const useOrders = (type = 'my') => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const fetchers = {
        my: orderService.getMyOrders,
        producer: orderService.getProducerOrders,
        all: orderService.getAll,
      }
      const res = await (fetchers[type] || orderService.getMyOrders)()
      setOrders(res.data?.orders || res.data || [])
    } catch {
      toast.error('ඇණවුම් පූරණය වීමේ දෝෂය')
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const updateStatus = async (id, status) => {
    try {
      await orderService.updateStatus(id, status)
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
      toast.success(SI.updateStatus + ' ' + SI.success)
    } catch {
      toast.error('යාවත්කාලීන කිරීම අසාර්ථකයි')
    }
  }

  return { orders, loading, refetch: fetchOrders, updateStatus }
}

/**
 * useUsers – fetch & manage users (admin)
 */
export const useUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userService.getAll()
      setUsers(res.data?.users || res.data || [])
    } catch {
      toast.error('පරිශීලකයන් පූරණය වීමේ දෝෂය')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const approveProducer = async (id) => {
    try {
      await userService.approveProducer(id)
      setUsers(prev => prev.map(u => u._id === id ? { ...u, status: 'approved' } : u))
      toast.success(SI.approveProducer + ' ✓')
    } catch {
      toast.error('අනුමත කිරීම අසාර්ථකයි')
    }
  }

  const rejectProducer = async (id) => {
    try {
      await userService.rejectProducer(id)
      setUsers(prev => prev.map(u => u._id === id ? { ...u, status: 'rejected' } : u))
      toast.success('ප්‍රතික්ෂේප කළා')
    } catch {
      toast.error('ප්‍රතික්ෂේප කිරීම අසාර්ථකයි')
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    try {
      await userService.updateStatus(id, newStatus)
      setUsers(prev => prev.map(u => u._id === id ? { ...u, status: newStatus } : u))
      toast.success(`ගිණුම ${newStatus === 'active' ? 'සක්‍රිය' : 'අක්‍රිය'} කළා`)
    } catch {
      toast.error('යාවත්කාලීන කිරීම අසාර්ථකයි')
    }
  }

  return { users, loading, refetch: fetchUsers, approveProducer, rejectProducer, toggleStatus }
}
