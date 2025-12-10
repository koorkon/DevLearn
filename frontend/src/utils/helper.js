// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      return true
    } catch (fallbackErr) {
      return false
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Calculate reading time
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Sanitize HTML
export const sanitizeHtml = (html) => {
  const temp = document.createElement('div')
  temp.textContent = html
  return temp.innerHTML
}

// Download file
export const downloadFile = (content, filename, contentType = 'text/plain') => {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Local storage helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },

  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch {
      return false
    }
  }
}

// Color utilities
export const colors = {
  getPastelColor: (index) => {
    const pastels = [
      'bg-pastel-blue', 'bg-pastel-purple', 'bg-pastel-green',
      'bg-pastel-yellow', 'bg-pastel-pink'
    ]
    return pastels[index % pastels.length]
  },

  getGradient: (index) => {
    const gradients = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-green-400 to-green-600',
      'from-yellow-400 to-yellow-600',
      'from-pink-400 to-pink-600'
    ]
    return gradients[index % gradients.length]
  },

  getTextColor: (index) => {
    const colors = [
      'text-blue-600', 'text-purple-600', 'text-green-600',
      'text-yellow-600', 'text-pink-600'
    ]
    return colors[index % colors.length]
  }
}

// Error handling
export const handleError = (error, fallbackMessage = 'An error occurred') => {
  console.error('Error:', error)

  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || fallbackMessage
  } else if (error.request) {
    // Request made but no response received
    return 'Network error. Please check your connection.'
  } else {
    // Something else happened
    return error.message || fallbackMessage
  }
}

// Performance monitoring
export const measurePerformance = (name, fn) => {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  console.log(`${name} took ${(end - start).toFixed(2)}ms`)
  return result
}

// Array utilities
export const arrayUtils = {
  shuffle: (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  },

  chunk: (array, size) => {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  },

  unique: (array) => {
    return [...new Set(array)]
  },

  sortBy: (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]

      if (order === 'desc') {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
      }
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    })
  }
}

// String utilities
export const stringUtils = {
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },

  truncate: (str, length, suffix = '...') => {
    return str.length > length ? str.substring(0, length) + suffix : str
  },

  slugify: (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  pluralize: (count, singular, plural) => {
    return count === 1 ? singular : plural
  }
}

// Number utilities
export const numberUtils = {
  format: (num, decimals = 0) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  },

  random: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  clamp: (num, min, max) => {
    return Math.min(Math.max(num, min), max)
  }
}

// DOM utilities
export const domUtils = {
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  },

  scrollTo: (element, behavior = 'smooth') => {
    element.scrollIntoView({ behavior, block: 'start' })
  },

  addClass: (element, className) => {
    element.classList.add(className)
  },

  removeClass: (element, className) => {
    element.classList.remove(className)
  },

  toggleClass: (element, className) => {
    element.classList.toggle(className)
  }
}
