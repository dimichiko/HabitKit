import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes loguear el error a un servicio externo aquí si quieres
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary atrapó un error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <h1 className="text-2xl font-bold text-red-600 mb-4">¡Algo salió mal!</h1>
          <p className="text-gray-700 mb-2">Ha ocurrido un error inesperado en la aplicación.</p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="bg-red-100 text-red-800 p-2 rounded text-xs max-w-xl overflow-x-auto">
              {this.state.error.toString()}
            </pre>
          )}
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 