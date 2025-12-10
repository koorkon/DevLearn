import React, { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  uploadedFiles: [],
  summaries: [],
  mcqs: [],
  flashcards: [],
  loading: false,
  error: null,
  currentDocument: null,
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'ADD_FILE':
      return {
        ...state,
        uploadedFiles: [...state.uploadedFiles, action.payload],
        currentDocument: action.payload
      }
    case 'ADD_SUMMARY':
      return {
        ...state,
        summaries: [...state.summaries, action.payload],
        loading: false
      }
    case 'ADD_MCQS':
      return {
        ...state,
        mcqs: [...state.mcqs, ...action.payload],
        loading: false
      }
    case 'ADD_FLASHCARDS':
      return {
        ...state,
        flashcards: [...state.flashcards, ...action.payload],
        loading: false
      }
    case 'SET_SUMMARIES':
      return { ...state, summaries: action.payload, loading: false }
    case 'SET_MCQS':
      return { ...state, mcqs: action.payload, loading: false }
    case 'SET_FLASHCARDS':
      return { ...state, flashcards: action.payload, loading: false }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
