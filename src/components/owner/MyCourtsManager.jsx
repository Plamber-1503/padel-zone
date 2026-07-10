import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Clock, CheckCircle2, XCircle } from "lucide-react";
import CourtFormModal from "@/components/owner/CourtFormModal";
import MercadoPagoSection from "@/components/payments/MercadoPagoSection";

const surfaceLabels = {
  cesped_sintetico: "Césped Sintético",
  cemento: "Cemento",
  cristal: "Cristal",
};

export default function MyCourtsManager({ user, onUserUpdate }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);

  const { data: courts = [], isLoading } = useQuery({
    queryKey: ["my-courts", user?.email],
    queryFn: () => base44.entities.Court.filter({ owner_email: user?.email }),
    enabled: !!user?.email,
  });

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ["my-courts", user?.email] });
  };

  const openNew = () => { setEditingCourt(null); setShowForm(true); };
  const openEdit = (court) => { setEditingCourt(court); setShowForm(true); };

  return (
    <div className="space-y-8">
      {/* Mis Canchas */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-xl">Mis Canchas</h2>
          <Button onClick={openNew} className="rounded-xl gap-2">
            <Plus className="w-4 h-4" />
            Agregar cancha
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
          </div>
        ) : courts.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-2xl py-16 flex flex-col items-center gap-3 text-muted-foreground">
            <Plus className="w-10 h-10 opacity-30" />
            <p className="font-medium">Aún no tenés canchas registradas.</p>
            <Button variant="outline" onClick={openNew} className="rounded-xl mt-1">
              Crear mi primera cancha
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courts.map((court) => (
              <Card key={court.id} className="overflow-hidden border hover:shadow-md transition-all">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={court.image_url || "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop"}
                    alt={court.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {court.is_covered && (
                      <Badge className="bg-secondary/90 text-secondary-foreground text-xs">Techada</Badge>
                    )}
                    <Badge className="bg-primary/90 text-primary-foreground text-xs">
                      {surfaceLabels[court.surface_type] || court.surface_type}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className={court.is_active ? "bg-green-500 text-white text-xs" : "bg-muted text-muted-foreground text-xs"}>
                      {court.is_active ? <CheckCircle2 className="w-3 h-3 mr-1 inline" /> : <XCircle className="w-3 h-3 mr-1 inline" />}
                      {court.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-heading font-semibold truncate">{court.name}</h3>
                      {court.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{court.description}</p>
                      )}
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span className="font-heading font-bold text-primary">${court.price_per_hour?.toLocaleString()}</span>
                        <span className="text-muted-foreground text-xs">/hora</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(court)}
                      className="rounded-xl shrink-0 gap-1"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Datos de pago */}
      <section>
        <h2 className="font-heading font-bold text-xl mb-1">Datos de cobro</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configurá tu cuenta de Mercado Pago para recibir pagos al instante.
        </p>
        <MercadoPagoSection user={user} onUpdate={onUserUpdate} />
      </section>

      <CourtFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        court={editingCourt}
        ownerEmail={user?.email}
        onSaved={handleSaved}
      />
    </div>
  );
}