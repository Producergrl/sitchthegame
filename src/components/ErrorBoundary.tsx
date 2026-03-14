import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Shield } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Silently log in production — no console.log
    void error;
    void info;
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
          <div className="mx-auto max-w-sm rounded-2xl border bg-card p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-black text-card-foreground">Something went wrong</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Don't worry — your progress is saved. Try refreshing or going back to the home screen.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={this.handleReset}
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Try Again
              </button>
              <a
                href="/"
                className="rounded-xl border border-border px-6 py-3 text-sm font-bold text-card-foreground transition-colors hover:bg-muted"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
