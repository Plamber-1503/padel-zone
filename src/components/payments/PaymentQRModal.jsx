import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Copy, CheckCircle2, Loader2, AlertCircle, Wallet, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

// CBU y Alias válidos según reglas argentinas
const ALIAS_REGEX = /^[a-zA-Z0-9.\-_]{6,20}$/;
const CBU_REGEX = /^\d{22}$/;

function buildMPDeeplink({ alias, amount, description }) {
  // Deeplink oficial de Mercado Pago — abre la app en móvil o la web en desktop
  if (alias) {
    return `https://mpago.la/1/${encodeURIComponent(alias)}?amount=${amount}&description=${encodeURIComponent(description)}`;
  }
  return null;
}

function buildQRUrl(mpLink) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(mpLink)}`;
}

export default function PaymentQRModal({ open, onClose, court, booking, onPaymentDone }) {
  const [paymentType, setPaymentType] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [loadingOwner, setLoadingOwner] = useState(false);
  const [copied, setCopied] = useState(null);

  const totalPrice = court?.price_per_hour || 0;
  const depositAmount = Math.round(totalPrice * 0.3);
  const selectedAmount = paymentType === "deposito" ? depositAmount : paymentType === "total" ? totalPrice : null;

  // Validar datos del dueño
  const aliasValid = ownerData?.mp_alias && ALIAS_REGEX.test(ownerData.mp_alias.trim());
  const cbuValid = ownerData?.mp_cbu && CBU_REGEX.test(ownerData.mp_cbu.trim());
  const hasValidData = aliasValid || cbuValid;
  const isVerified = ownerData?.mp_verified;

  const description = `Reserva ${court?.name} - ${booking?.date || ""} ${booking?.time_slot || ""}`;
  const mpLink = paymentType && aliasValid
    ? buildMPDeeplink({ alias: ownerData.mp_alias, amount: selectedAmount, description })
    : null;
  const qrUrl = mpLink ? buildQRUrl(mpLink) : null;

  useEffect(() => {
    if (!open || !court?.owner_email) return;
    setPaymentType(null);
    setOwnerData(null);
    setLoadingOwner(true);
    base44.entities.User.filter({ email: court.owner_email })
      .then((users) => setOwnerData(users?.[0] || null))
      .catch(() => setOwnerData(null))
      .finally(() => setLoadingOwner(false));
  }, [open, court?.owner_email]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success(`${field === "alias" ? "Alias" : "CBU/CVU"} copiado`);
    setTimeout(() => setCopied(null), 2000);
  };

  const openMercadoPago = (type) => {
    const amount = type === "deposito" ? depositAmount : totalPrice;
    const desc = `Reserva ${court?.name} - ${booking?.date || ""} ${booking?.time_slot || ""}`;
    if (aliasValid) {
      const link = buildMPDeeplink({ alias: ownerData.mp_alias, amount, description: desc });
      window.open(link, "_blank");
    } else if (cbuValid) {
      // Sin alias no hay deeplink, copiamos el CBU automáticamente
      navigator.clipboard.writeText(ownerData.mp_cbu);
      toast.success(`CBU copiado: ${ownerData.mp_cbu} — transferí $${amount.toLocaleString()} por Mercado Pago`);
    }
  };

  const handleSelectPaymentType = (type) => {
    setPaymentType(type);
    // Abrir MP automáticamente al elegir el monto
    if (aliasValid || cbuValid) {
      openMercadoPago(type);
    }
  };

  const handleConfirmPayment = () => {
    if (!paymentType) return;
    onPaymentDone?.(paymentType, selectedAmount);
    toast.success(paymentType === "deposito"
      ? `Depósito de $${depositAmount.toLocaleString()} registrado. Solicitud enviada al dueño.`
      : `Pago total de $${totalPrice.toLocaleString()} registrado. ¡Reserva confirmada!`
    );
    onClose();
  };

  const noData = !loadingOwner && (!ownerData || !hasValidData);
  const notVerified = !loadingOwner && ownerData && hasValidData && !isVerified;
  const manualMode = noData || notVerified;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading">
            <QrCode className="w-5 h-5 text-primary" />
            Pagar con Mercado Pago
          </DialogTitle>
        </DialogHeader>

        {loadingOwner ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>

        ) : manualMode ? (
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <AlertCircle className="w-10 h-10 text-yellow-500" />
              <p className="font-medium">
                {noData
                  ? "El dueño aún no cargó sus datos de Mercado Pago."
                  : "Los datos de Mercado Pago del dueño aún no están verificados."}
              </p>
              <p className="text-sm text-muted-foreground">
                Coordiná el pago directamente con el dueño de la cancha. Podés confirmar la reserva de todas formas.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancelar</Button>
              <Button
                onClick={() => {
                  onPaymentDone?.("deposito", depositAmount);
                  toast.success("Reserva enviada. Coordiná el pago con el dueño.");
                  onClose();
                }}
                className="flex-1 rounded-xl gap-2"
              >
                <Wallet className="w-4 h-4" />
                Confirmar reserva
              </Button>
            </div>
          </div>

        ) : (
          <div className="space-y-5">
            {/* Resumen reserva */}
            <div className="rounded-xl bg-accent/40 p-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cancha</span>
                <span className="font-medium">{court?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total reserva</span>
                <span className="font-heading font-bold text-primary">${totalPrice.toLocaleString()}</span>
              </div>
              {isVerified && (
                <div className="flex items-center gap-1 justify-end pt-1">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  <span className="text-xs text-primary">Cuenta verificada</span>
                </div>
              )}
            </div>

            {/* Selección de monto */}
            {!paymentType && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">¿Cuánto querés pagar?</p>
                <button
                  onClick={() => handleSelectPaymentType("deposito")}
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-primary/40 hover:bg-accent/30 transition-all text-left"
                >
                  <div>
                    <p className="font-semibold">Solo depósito (30%)</p>
                    <p className="text-xs text-muted-foreground">Reserva tu lugar · pagá el resto después</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-xl text-primary">${depositAmount.toLocaleString()}</p>
                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto mt-1" />
                  </div>
                </button>
                <button
                  onClick={() => handleSelectPaymentType("total")}
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-primary/40 hover:bg-accent/30 transition-all text-left"
                >
                  <div>
                    <p className="font-semibold">Pago total</p>
                    <p className="text-xs text-muted-foreground">Reserva confirmada al instante</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-xl text-primary">${totalPrice.toLocaleString()}</p>
                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto mt-1" />
                  </div>
                </button>
              </div>
            )}

            {/* QR + datos de transferencia */}
            {paymentType && (
              <div className="space-y-4">
                {/* Monto elegido */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pagando</p>
                    <p className="font-heading font-bold text-2xl text-primary">${selectedAmount?.toLocaleString()}</p>
                  </div>
                  <Badge className="bg-accent text-accent-foreground">
                    {paymentType === "deposito" ? "Depósito 30%" : "Pago total"}
                  </Badge>
                </div>

                <div className="border-t border-border" />

                {/* Acción principal: abrir MP */}
                {aliasValid && qrUrl && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-xl bg-[#009ee3]/10 border border-[#009ee3]/30 p-4 w-full text-center space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Mercado Pago debería haberse abierto automáticamente.<br/>Si no, tocá el botón:
                      </p>
                      <Button
                        onClick={() => openMercadoPago(paymentType)}
                        className="w-full rounded-xl gap-2 bg-[#009ee3] hover:bg-[#0082c1] text-white font-semibold text-base h-12"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Abrir Mercado Pago · ${selectedAmount?.toLocaleString()}
                      </Button>
                    </div>
                    <details className="w-full">
                      <summary className="text-xs text-muted-foreground cursor-pointer text-center hover:text-foreground">
                        Pagar escaneando QR
                      </summary>
                      <div className="flex flex-col items-center gap-2 pt-3">
                        <div className="p-3 bg-white rounded-xl border border-border shadow-sm">
                          <img src={qrUrl} alt="QR Mercado Pago" className="w-44 h-44" />
                        </div>
                        <p className="text-xs text-muted-foreground">Escaneá con la app de Mercado Pago</p>
                      </div>
                    </details>
                  </div>
                )}

                {/* Solo CBU disponible — ya se copió automáticamente */}
                {!aliasValid && cbuValid && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center space-y-2">
                    <p className="text-sm font-medium text-amber-800">CBU copiado automáticamente</p>
                    <p className="text-xs text-amber-700">Abrí Mercado Pago, elegí "Transferir" e ingresá el CBU</p>
                    <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 mt-1">
                      <p className="font-mono text-xs text-foreground tracking-wide">{ownerData?.mp_cbu}</p>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(ownerData.mp_cbu, "cbu")} className="h-7 rounded-md">
                        {copied === "cbu" ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Alias visible para referencia */}
                {aliasValid && (
                  <div className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-2.5">
                    <div>
                      <p className="text-xs text-muted-foreground">Alias destino</p>
                      <p className="font-mono font-medium text-sm">{ownerData.mp_alias}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(ownerData.mp_alias, "alias")} className="rounded-lg h-8">
                      {copied === "alias" ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <Button variant="outline" onClick={() => setPaymentType(null)} className="flex-1 rounded-xl">
                    Volver
                  </Button>
                  <Button onClick={handleConfirmPayment} className="flex-1 rounded-xl gap-2">
                    <Wallet className="w-4 h-4" />
                    Ya pagué · Confirmar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}