import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { QrCode, CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

// Reglas de validación
const ALIAS_REGEX = /^[a-zA-Z0-9.\-_]{6,20}$/;
const CBU_REGEX = /^\d{22}$/;

function FieldStatus({ value, regex, emptyOk }) {
  if (!value) return null;
  const valid = regex.test(value.trim());
  return valid
    ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
    : <XCircle className="w-4 h-4 text-destructive shrink-0" />;
}

export default function MercadoPagoSection({ user, onUpdate }) {
  const [alias, setAlias] = useState(user?.mp_alias || "");
  const [cbu, setCbu] = useState(user?.mp_cbu || "");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const isVerified = user?.mp_verified;

  const aliasOk = !alias || ALIAS_REGEX.test(alias.trim());
  const cbuOk = !cbu || CBU_REGEX.test(cbu.trim());
  const hasAtLeastOne = alias.trim() || cbu.trim();
  const allValid = aliasOk && cbuOk && hasAtLeastOne;

  const handleSave = async () => {
    if (!hasAtLeastOne) {
      toast.error("Ingresá al menos tu Alias o CBU/CVU");
      return;
    }
    if (!aliasOk) {
      toast.error("El Alias tiene formato incorrecto (6–20 chars: letras, números, puntos o guiones).");
      return;
    }
    if (!cbuOk) {
      toast.error("El CBU/CVU debe tener exactamente 22 dígitos.");
      return;
    }
    setLoading(true);
    await base44.auth.updateMe({ mp_alias: alias.trim(), mp_cbu: cbu.trim(), mp_verified: false });
    toast.success("Datos guardados. Verificá tu cuenta para activar los pagos.");
    setLoading(false);
    onUpdate?.();
  };

  const handleVerify = async () => {
    if (!allValid) {
      toast.error("Corregí los errores antes de verificar.");
      return;
    }
    setVerifying(true);

    // Guardar primero si hay cambios
    await base44.auth.updateMe({ mp_alias: alias.trim(), mp_cbu: cbu.trim(), mp_verified: false });

    // Validación final con LLM
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Verificá si los siguientes datos de Mercado Pago tienen un formato válido para Argentina:
Alias: "${alias}"
CBU/CVU: "${cbu}"

Reglas:
- Alias: 6–20 caracteres, solo letras, números, puntos, guiones o guión bajo.
- CBU/CVU: exactamente 22 dígitos numéricos.
- overall_valid: true si al menos uno de los dos tiene formato correcto.`,
      response_json_schema: {
        type: "object",
        properties: {
          alias_valid: { type: "boolean" },
          cbu_valid: { type: "boolean" },
          overall_valid: { type: "boolean" },
          message: { type: "string" }
        }
      }
    });

    if (result.overall_valid) {
      await base44.auth.updateMe({ mp_alias: alias.trim(), mp_cbu: cbu.trim(), mp_verified: true });
      toast.success("✅ Cuenta verificada. Los jugadores ya pueden pagarte al reservar.");
      onUpdate?.();
    } else {
      toast.error(result.message || "Los datos ingresados no son válidos.");
    }
    setVerifying(false);
  };

  return (
    <Card className="mt-6 border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-heading">
          <QrCode className="w-5 h-5 text-primary" />
          Datos de Mercado Pago
          {isVerified ? (
            <Badge className="bg-accent text-accent-foreground gap-1 ml-2">
              <ShieldCheck className="w-3 h-3" />
              Verificado
            </Badge>
          ) : (
            <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50 ml-2">
              Sin verificar
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Los jugadores verán estos datos para pagarte al reservar tu cancha.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alias */}
        <div>
          <Label>Alias de Mercado Pago</Label>
          <div className="relative mt-1">
            <Input
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="ej: cancha.norte.padel"
              className={`pr-8 ${alias && !aliasOk ? "border-destructive focus-visible:ring-destructive" : alias && aliasOk ? "border-green-400 focus-visible:ring-green-400" : ""}`}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <FieldStatus value={alias} regex={ALIAS_REGEX} />
            </span>
          </div>
          <p className={`text-xs mt-1 ${alias && !aliasOk ? "text-destructive" : "text-muted-foreground"}`}>
            6–20 caracteres: letras, números, puntos, guiones o guión bajo.
          </p>
        </div>

        {/* CBU */}
        <div>
          <Label>CBU / CVU</Label>
          <div className="relative mt-1">
            <Input
              value={cbu}
              onChange={(e) => setCbu(e.target.value.replace(/\D/g, "").slice(0, 22))}
              placeholder="22 dígitos numéricos"
              className={`pr-8 font-mono ${cbu && !cbuOk ? "border-destructive focus-visible:ring-destructive" : cbu && cbuOk ? "border-green-400 focus-visible:ring-green-400" : ""}`}
              inputMode="numeric"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <FieldStatus value={cbu} regex={CBU_REGEX} />
            </span>
          </div>
          <p className={`text-xs mt-1 flex justify-between ${cbu && !cbuOk ? "text-destructive" : "text-muted-foreground"}`}>
            <span>Exactamente 22 dígitos.</span>
            {cbu && <span>{cbu.length}/22</span>}
          </p>
        </div>

        {isVerified && (
          <div className="flex items-center gap-2 text-sm text-primary bg-accent/50 rounded-xl px-4 py-3">
            <CheckCircle2 className="w-4 h-4" />
            Cuenta verificada — los jugadores pueden pagarte via QR al reservar.
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={loading || !allValid}
            className="flex-1 rounded-xl"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
          </Button>
          <Button
            onClick={handleVerify}
            disabled={verifying || !allValid}
            className="flex-1 rounded-xl"
          >
            {verifying ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verificando...</>
            ) : (
              <><ShieldCheck className="w-4 h-4 mr-2" />Verificar cuenta</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}