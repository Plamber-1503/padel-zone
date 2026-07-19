import { Component } from "react";
import { Button } from "@/components/ui/button";

/**
 * ErrorBoundary — captura errores no manejados en el árbol de componentes React.
 *
 * Sin esto, cualquier error de render silencia toda la UI sin feedback al usuario.
 *
 * Uso en main.jsx:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 * Para producción, conectar componentDidCatch con Sentry u otro servicio:
 *   import * as Sentry from "@sentry/react";
 *   Sentry.captureException(error, { extra: info });
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary] Unhandled render error:", error, info.componentStack);
    // TODO: enviar a Sentry/LogRocket cuando estén configurados
    // Sentry.captureException(error, { extra: info });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-background">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Algo salió mal
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ocurrió un error inesperado. Podés intentar recargar la página.
              Si el problema persiste, contactá a soporte.
            </p>
            {this.state.error?.message && (
              <p className="text-xs text-muted-foreground/60 bg-muted rounded-lg px-3 py-2 font-mono text-left break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="rounded-xl"
              >
                Intentar de nuevo
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="rounded-xl"
              >
                Recargar página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
