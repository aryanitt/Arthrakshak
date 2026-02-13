import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.state = { hasError: true, error, errorInfo };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '40px',
                    background: '#fff5f5',
                    borderRadius: '16px',
                    border: '2px solid #ff4d4d',
                    margin: '20px'
                }}>
                    <h2 style={{ color: '#ff4d4d', marginBottom: '12px' }}>
                        ⚠️ Component Error Detected
                    </h2>
                    <p style={{ color: '#64748b', marginBottom: '20px' }}>
                        Component: <strong>{this.props.name || 'Unknown'}</strong>
                    </p>
                    <details style={{ background: '#fff', padding: '16px', borderRadius: '8px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}>
                            Error Details
                        </summary>
                        <pre style={{
                            fontSize: '12px',
                            color: '#dc2626',
                            overflow: 'auto',
                            maxHeight: '200px',
                            padding: '12px',
                            background: '#fef2f2',
                            borderRadius: '4px'
                        }}>
                            {this.state.error && this.state.error.toString()}
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
