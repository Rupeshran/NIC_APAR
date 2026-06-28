import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>Something Went Wrong</h1>
            <p style={styles.message}>
              An unexpected error occurred in the application.
              Please try reloading the page.
            </p>
            {this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details</summary>
                <pre style={styles.pre}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button style={styles.button} onClick={this.handleReload}>
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0c1a3a 0%, #153a6a 100%)",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "48px",
    maxWidth: "520px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  icon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "12px",
  },
  message: {
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: "1.6",
    marginBottom: "24px",
  },
  details: {
    textAlign: "left",
    marginBottom: "24px",
    background: "#fef2f2",
    borderRadius: "8px",
    padding: "12px",
    border: "1px solid #fecaca",
  },
  summary: {
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    color: "#dc2626",
    marginBottom: "8px",
  },
  pre: {
    fontSize: "12px",
    color: "#7f1d1d",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    maxHeight: "200px",
    overflow: "auto",
    marginTop: "8px",
  },
  button: {
    background: "linear-gradient(135deg, #1e5a9a 0%, #153a6a 100%)",
    color: "white",
    border: "none",
    padding: "12px 32px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
};
