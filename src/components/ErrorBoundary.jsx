import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
          <div className="card p-8 max-w-md text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-400">Что-то пошло не так</h2>
            <p className="text-zinc-400">
              Произошла ошибка при загрузке приложения. Попробуйте обновить страницу.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Обновить страницу
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left mt-4">
                <summary className="cursor-pointer text-red-400">Детали ошибки (dev mode)</summary>
                <pre className="text-xs text-zinc-400 mt-2 overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary