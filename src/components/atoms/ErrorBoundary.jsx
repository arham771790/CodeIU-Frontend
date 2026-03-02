"use client";

import React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

/**
 * Global Error Boundary
 * Catches JavaScript errors in the component tree and renders a fallback UI
 * instead of crashing the whole app.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        // Log the error code if it's a normalized API error
        console.error(
            "[ErrorBoundary] Caught:",
            error?.errorCode ? `[${error.errorCode}]` : "",
            error?.message,
            error?.traceId ? `| TraceId: ${error.traceId}` : "",
            errorInfo?.componentStack
        );
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-base-100 flex items-center justify-center p-8">
                    <div className="max-w-md w-full bg-base-200 border border-error/20 rounded-[2.5rem] p-10 text-center shadow-2xl">
                        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-error" />
                        </div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter text-base-content mb-2">
                            Something went <span className="text-error">wrong</span>
                        </h1>
                        <p className="text-base-content/40 text-sm mb-2">
                            {this.state.error?.normalizedMessage || this.state.error?.message || "An unexpected error occurred."}
                        </p>
                        {this.state.error?.errorCode && (
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/20 mb-6">
                                Error Code: {this.state.error.errorCode}
                                {this.state.error.traceId && ` · TraceId: ${this.state.error.traceId}`}
                            </p>
                        )}
                        <button
                            onClick={this.handleReset}
                            className="btn btn-error btn-sm rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2"
                        >
                            <RefreshCw className="w-3 h-3" />
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
