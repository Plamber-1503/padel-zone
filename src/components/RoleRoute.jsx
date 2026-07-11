import { Link, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Protege rutas que requieren un rol específico (además de estar autenticado).
 * Debe usarse SIEMPRE anidado dentro de <ProtectedRoute />, que ya garantiza
 * que `user` existe.
 *
 * IMPORTANTE: esto es una segunda capa de defensa en el cliente para mejorar
 * la UX (evitar que alguien "vea" una pantalla que no le corresponde).
 * La protección real tiene que existir también del lado del servidor,
 * configurando las reglas de acceso de cada entidad en el Builder de Base44
 * (por ejemplo: sólo el propio owner_email o un admin puede escribir en Court).
 * Sin esa segunda capa, esta guard sólo evita el acceso desde la UI, pero no
 * evita llamadas directas a la API.
 */
export default function RoleRoute({ allow = [] }) {
  const { user } = useAuth();

  const hasAccess = user && allow.includes(user.role);

  if (!hasAccess) {
    // Importante: NO usar <Navigate> acá. Un redirect automático dispara
    // durante el render y el usuario nunca llega a ver el mensaje. Mejor
    // mostrar la pantalla y dejar que decida volver.
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h1 className="font-heading text-xl font-bold mb-2">No tenés acceso a esta sección</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Esta pantalla es sólo para dueños de cancha o administradores. Si creés que
          esto es un error, contactá a soporte para verificar tu cuenta.
        </p>
        <Button asChild className="rounded-xl">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

  return <Outlet />;
}
