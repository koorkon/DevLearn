// File validation utilities
export const fileValidators = {
  // Validate file type
  validateFileType: (file, allowedTypes) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported. Allowed types: ${allowedTypes.join(', ')}`)
    }
    return true
  },

  // Validate file size
  validateFileSize: (file, maxSizeInMB) => {
    const maxSize = maxSizeInMB * 1024 * 1024 // Convert MB to bytes
    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${maxSizeInMB}MB`)
    }
    return true
  },

  // Validate file name
  validateFileName: (fileName, maxLength = 255) => {
    if (!fileName || fileName.trim().length === 0) {
      throw new Error('File name cannot be empty')
    }
    if (fileName.length > maxLength) {
      throw new Error(`File name must be less than ${maxLength} characters`)
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/
    if (invalidChars.test(fileName)) {
      throw new Error('File name contains invalid characters')
    }

    return true
  },

  // Validate multiple files
  validateMultipleFiles: (files, options = {}) => {
    const {
      maxFiles = 10,
      maxTotalSize = 100, // MB
      allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain']
    } = options

    if (files.length > maxFiles) {
      throw new Error(`Maximum ${maxFiles} files allowed`)
    }

    let totalSize = 0
    files.forEach(file => {
      totalSize += file.size
      fileValidators.validateFileType(file, allowedTypes)
      fileValidators.validateFileSize(file, 10) // 10MB per file
    })

    if (totalSize > maxTotalSize * 1024 * 1024) {
      throw new Error(`Total file size must be less than ${maxTotalSize}MB`)
    }

    return true
  }
}

// Form validation utilities
export const formValidators = {
  // Email validation
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || email.trim().length === 0) {
      return 'Email is required'
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    return null
  },

  // Password validation
  validatePassword: (password) => {
    if (!password || password.length < 8) {
      return 'Password must be at least 8 characters long'
    }

    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const errors = []
    if (!hasUpperCase) errors.push('one uppercase letter')
    if (!hasLowerCase) errors.push('one lowercase letter')
    if (!hasNumbers) errors.push('one number')
    if (!hasSpecialChar) errors.push('one special character')

    if (errors.length > 0) {
      return `Password must contain at least ${errors.join(', ')}`
    }

    return null
  },

  // Required field validation
  validateRequired: (value, fieldName) => {
    if (!value || value.toString().trim().length === 0) {
      return `${fieldName} is required`
    }
    return null
  },

  // Minimum length validation
  validateMinLength: (value, minLength, fieldName) => {
    if (value && value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`
    }
    return null
  },

  // Maximum length validation
  validateMaxLength: (value, maxLength, fieldName) => {
    if (value && value.length > maxLength) {
      return `${fieldName} must be less than ${maxLength} characters`
    }
    return null
  },

  // Number validation
  validateNumber: (value, fieldName, options = {}) => {
    const { min, max, integer = false } = options

    if (value === '' || value === null || value === undefined) {
      return null
    }

    const num = Number(value)
    if (isNaN(num)) {
      return `${fieldName} must be a valid number`
    }

    if (integer && !Number.isInteger(num)) {
      return `${fieldName} must be an integer`
    }

    if (min !== undefined && num < min) {
      return `${fieldName} must be at least ${min}`
    }

    if (max !== undefined && num > max) {
      return `${fieldName} must be at most ${max}`
    }

    return null
  },

  // URL validation
  validateURL: (url) => {
    if (!url || url.trim().length === 0) {
      return null
    }

    try {
      new URL(url)
      return null
    } catch {
      return 'Please enter a valid URL'
    }
  },

  // Phone number validation (basic)
  validatePhone: (phone) => {
    if (!phone || phone.trim().length === 0) {
      return null
    }

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    const cleaned = phone.replace(/[^\d+]/g, '')

    if (!phoneRegex.test(cleaned)) {
      return 'Please enter a valid phone number'
    }

    return null
  },

  // Date validation
  validateDate: (date, fieldName, options = {}) => {
    const { min, max, past = false, future = false } = options

    if (!date) {
      return null
    }

    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      return `${fieldName} must be a valid date`
    }

    const now = new Date()

    if (past && dateObj > now) {
      return `${fieldName} must be in the past`
    }

    if (future && dateObj < now) {
      return `${fieldName} must be in the future`
    }

    if (min && dateObj < new Date(min)) {
      return `${fieldName} must be after ${new Date(min).toLocaleDateString()}`
    }

    if (max && dateObj > new Date(max)) {
      return `${fieldName} must be before ${new Date(max).toLocaleDateString()}`
    }

    return null
  }
}

// Content validation utilities
export const contentValidators = {
  // Validate summary content
  validateSummaryContent: (content) => {
    if (!content || content.trim().length === 0) {
      return 'Summary content cannot be empty'
    }

    if (content.trim().length < 50) {
      return 'Summary content is too short (minimum 50 characters)'
    }

    if (content.trim().length > 10000) {
      return 'Summary content is too long (maximum 10,000 characters)'
    }

    return null
  },

  // Validate MCQ question
  validateMCQQuestion: (question, options, correctAnswer) => {
    const errors = []

    if (!question || question.trim().length === 0) {
      errors.push('Question is required')
    } else if (question.trim().length < 10) {
      errors.push('Question must be at least 10 characters long')
    }

    if (!options || options.length < 2) {
      errors.push('At least 2 options are required')
    } else {
      options.forEach((option, index) => {
        if (!option || option.trim().length === 0) {
          errors.push(`Option ${index + 1} cannot be empty`)
        }
      })
    }

    if (correctAnswer === undefined || correctAnswer === null) {
      errors.push('Correct answer must be specified')
    } else if (correctAnswer < 0 || correctAnswer >= options.length) {
      errors.push('Correct answer must be a valid option index')
    }

    return errors.length > 0 ? errors : null
  },

  // Validate flashcard content
  validateFlashcard: (front, back) => {
    const errors = []

    if (!front || front.trim().length === 0) {
      errors.push('Front content is required')
    } else if (front.trim().length > 500) {
      errors.push('Front content is too long (maximum 500 characters)')
    }

    if (!back || back.trim().length === 0) {
      errors.push('Back content is required')
    } else if (back.trim().length > 1000) {
      errors.push('Back content is too long (maximum 1000 characters)')
    }

    return errors.length > 0 ? errors : null
  },

  // Sanitize user input
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input

    return input
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  },

  // Validate document content
  validateDocumentContent: (content) => {
    if (!content || content.trim().length === 0) {
      return 'Document content cannot be empty'
    }

    if (content.trim().length < 100) {
      return 'Document content is too short (minimum 100 characters)'
    }

    // Check for excessive whitespace
    const excessiveWhitespace = (content.match(/\n\s*\n\s*\n/g) || []).length
    if (excessiveWhitespace > 10) {
      return 'Document contains excessive whitespace'
    }

    return null
  }
}

// API response validation
export const apiValidators = {
  // Validate API response structure
  validateApiResponse: (response, expectedSchema) => {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid API response format')
    }

    if (expectedSchema) {
      for (const key of expectedSchema.required || []) {
        if (!(key in response)) {
          throw new Error(`Missing required field: ${key}`)
        }
      }

      for (const [key, type] of Object.entries(expectedSchema.properties || {})) {
        if (key in response && typeof response[key] !== type) {
          throw new Error(`Invalid type for field ${key}: expected ${type}, got ${typeof response[key]}`)
        }
      }
    }

    return true
  },

  // Validate error response
  validateErrorResponse: (error) => {
    if (!error || typeof error !== 'object') {
      return { message: 'An unknown error occurred' }
    }

    return {
      message: error.message || 'An error occurred',
      code: error.code,
      details: error.details
    }
  }
}

// Composite validators for forms
export const compositeValidators = {
  // Validate upload form
  validateUploadForm: (files) => {
    const errors = {}

    try {
      fileValidators.validateMultipleFiles(files)
    } catch (error) {
      errors.files = error.message
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // Validate user registration form
  validateRegistrationForm: (formData) => {
    const errors = {}

    errors.email = formValidators.validateEmail(formData.email)
    errors.password = formValidators.validatePassword(formData.password)
    errors.username = formValidators.validateRequired(formData.username, 'Username')

    if (formData.confirmPassword && formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match'
    }

    return {
      isValid: Object.values(errors).every(error => error === null),
      errors
    }
  },

  // Validate study material generation form
  validateGenerationForm: (formData, type) => {
    const errors = {}

    errors.documentId = formValidators.validateRequired(formData.documentId, 'Document')

    switch (type) {
      case 'summary':
        if (formData.style && !['concise', 'detailed', 'bullet-points'].includes(formData.style)) {
          errors.style = 'Invalid summary style'
        }
        break

      case 'mcq':
        errors.numberOfQuestions = formValidators.validateNumber(formData.numberOfQuestions, 'Number of questions', {
          min: 1,
          max: 20,
          integer: true
        })

        if (formData.difficulty && !['easy', 'medium', 'hard'].includes(formData.difficulty)) {
          errors.difficulty = 'Invalid difficulty level'
        }
        break

      case 'flashcard':
        errors.numberOfCards = formValidators.validateNumber(formData.numberOfCards, 'Number of cards', {
          min: 1,
          max: 50,
          integer: true
        })
        break

      default:
        errors.type = 'Invalid generation type'
    }

    return {
      isValid: Object.values(errors).every(error => error === null),
      errors
    }
  }
}

// Export all validators
export default {
  file: fileValidators,
  form: formValidators,
  content: contentValidators,
  api: apiValidators,
  composite: compositeValidators
}
