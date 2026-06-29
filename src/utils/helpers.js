import { SI } from './constants'

export const formatPrice = (price) => {
  return `${SI.rs} ${Number(price).toLocaleString('si-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('si-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const truncate = (text, maxLength = 80) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const classNames = (...classes) => classes.filter(Boolean).join(' ')

export const debounce = (fn, delay = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
