import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  console.log("CartProvider mounted")
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('watahapath_cart')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('watahapath_cart', JSON.stringify(items))
  }, [items])

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id)
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, { product, quantity: qty }]
    })
  }

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId))
  }

  const updateQuantity = (productId, qty) => {
    if (qty < 1) return removeItem(productId)
    setItems((prev) =>
      prev.map((i) => (i.product._id === productId ? { ...i, quantity: qty } : i))
    )
  }

  const clearCart = () => setItems([])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
