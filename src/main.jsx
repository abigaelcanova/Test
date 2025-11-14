import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/layout/Layout.jsx'
import App from './App.jsx'
import { CreateVisitPage } from './pages/CreateVisitPage.jsx'
import { queryClient } from './data/queryClient'
import './index.css'
import './msw'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-red-600">Something went wrong!</h1>
          <pre className="mt-4 p-4 bg-gray-100 rounded">{this.state.error?.toString()}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/visits/new" element={<CreateVisitPage />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)

