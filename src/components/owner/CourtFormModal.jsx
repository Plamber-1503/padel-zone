import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Loader2, Save, Navigation } from "lucide-react";
import { toast } from "sonner";

const EMPTY_COURT = {
  name: "",
  description: "",
  price_per_hour: "",
  surface_type: "cesped_sintetico",
  is_covered: false,
  is_active: true,
  image_url: "",
  address: "",
  latitude: "",
  longitude: "",
};

export default function CourtFormModal({ open, onClose, court, ownerEmail, onSaved }) {
  const [form, setForm] = useState(EMPTY_COURT);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(court ? { ...court } : { ...EMPTY_COURT, owner_email: ownerEmail });
    }
  }, [open, court, ownerEmail]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set("image_url", file_url);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("El nombre de la cancha es obligatorio."); return; }
    if (!form.price_per_hour || isNaN(Number(form.price_per_hour)) || Number(form.price_per_hour) <= 0) {
      toast.error("Ingresá un precio por hora válido."); return;
    }
    setSaving(true);
    const data = {
      ...form,
      price_per_hour: Number(form.price_per_hour),
      owner_email: ownerEmail,
      latitude: form.latitude !== "" ? Number(form.latitude) : undefined,
      longitude: form.longitude !== "" ? Number(form.longitude) : undefined,
    };
    if (court?.id) {
      await base44.entities.Court.update(court.id, data);
      toast.success("Cancha actualizada.");
    } else {
      await base44.entities.Court.create(data);
      toast.success("Cancha creada.");
    }
    setSaving(false);
    onSaved?.();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {court ? "Editar cancha" : "Agregar cancha"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* Foto */}
          <div>
            <Label>Foto de la cancha</Label>
            <div className="mt-2 relative rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary/40 transition-colors">
              {form.image_url ? (
                <div className="relative">
                  <img src={form.image_url} alt="Cancha" className="w-full h-44 object-cover" />
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-sm font-medium flex items-center gap-2">
                      <ImagePlus className="w-4 h-4" /> Cambiar foto
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-44 cursor-pointer gap-2 text-muted-foreground hover:text-primary transition-colors">
                  {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <ImagePlus className="w-8 h-8" />}
                  <span className="text-sm">{uploading ? "Subiendo..." : "Subir foto"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
            </div>
          </div>

          {/* Nombre */}
          <div>
            <Label>Nombre *</Label>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="ej: Cancha Norte · Pádel"
              className="mt-1"
            />
          </div>

          {/* Descripción */}
          <div>
            <Label>Descripción</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Horarios, ubicación, características..."
              className="mt-1 resize-none"
              rows={2}
            />
          </div>

          {/* Precio */}
          <div>
            <Label>Precio por hora (ARS) *</Label>
            <Input
              type="number"
              value={form.price_per_hour}
              onChange={(e) => set("price_per_hour", e.target.value)}
              placeholder="ej: 8000"
              className="mt-1"
              min={0}
            />
          </div>

          {/* Superficie */}
          <div>
            <Label>Tipo de superficie</Label>
            <Select value={form.surface_type} onValueChange={(v) => set("surface_type", v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cesped_sintetico">Césped Sintético</SelectItem>
                <SelectItem value="cemento">Cemento</SelectItem>
                <SelectItem value="cristal">Cristal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dirección y coordenadas */}
          <div>
            <Label>Dirección</Label>
            <Input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="ej: Av. Corrientes 1234, CABA"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Latitud</Label>
              <Input
                type="number"
                value={form.latitude}
                onChange={(e) => set("latitude", e.target.value)}
                placeholder="ej: -34.6037"
                className="mt-1"
                step="any"
              />
            </div>
            <div>
              <Label>Longitud</Label>
              <Input
                type="number"
                value={form.longitude}
                onChange={(e) => set("longitude", e.target.value)}
                placeholder="ej: -58.3816"
                className="mt-1"
                step="any"
              />
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
            onClick={() => {
              if (!navigator.geolocation) return;
              navigator.geolocation.getCurrentPosition((pos) => {
                set("latitude", pos.coords.latitude.toFixed(6));
                set("longitude", pos.coords.longitude.toFixed(6));
              });
            }}
          >
            <Navigation className="w-4 h-4" /> Usar mi ubicación actual
          </button>

          {/* Toggles */}
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
              <Switch checked={form.is_covered} onCheckedChange={(v) => set("is_covered", v)} id="covered" />
              <Label htmlFor="covered">Techada</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} id="active" />
              <Label htmlFor="active">Activa</Label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || uploading} className="flex-1 rounded-xl gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {court ? "Guardar cambios" : "Crear cancha"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}