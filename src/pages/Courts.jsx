import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import CourtCard from "@/components/courts/CourtCard";
import CourtsMap from "@/components/courts/CourtsMap";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { MapPin, List, Map, Navigation, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const RADIUS_KM = 7;

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Courts() {
  const [view, setView] = useState("map"); // "map" | "list"
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | loading | granted | denied

  const { data: courts = [], isLoading } = useQuery({
    queryKey: ["courts"],
    queryFn: () => base44.entities.Court.filter({ is_active: true }),
  });

  useEffect(() => {
    setLocationStatus("loading");
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocationStatus("granted");
      },
      () => setLocationStatus("denied"),
      { timeout: 8000 }
    );
  }, []);

  // Filter courts within radius (only if we have location AND courts have coordinates)
  const nearbyCourts = userLocation
    ? courts.filter((c) => {
        if (!c.latitude || !c.longitude) return true; // show courts without coords too
        return getDistanceKm(userLocation[0], userLocation[1], c.latitude, c.longitude) <= RADIUS_KM;
      })
    : courts;

  const courtsWithLocation = nearbyCourts.filter((c) => c.latitude && c.longitude);
  const courtsWithoutLocation = nearbyCourts.filter((c) => !c.latitude || !c.longitude);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-border bg-background">
        <div>
          <h1 className="font-heading text-2xl font-bold">Canchas cerca tuyo</h1>
          <div className="flex items-center gap-2 mt-0.5">
            {locationStatus === "loading" && (
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Navigation className="w-4 h-4 animate-pulse" />
                <span>Obteniendo ubicación...</span>
              </div>
            )}
            {locationStatus === "granted" && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <Navigation className="w-4 h-4" />
                <span>Canchas en {RADIUS_KM} km a la redonda · {nearbyCourts.length} encontradas</span>
              </div>
            )}
            {locationStatus === "denied" && (
              <div className="flex items-center gap-1 text-amber-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Permitir ubicación para ver canchas cercanas</span>
              </div>
            )}
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-muted rounded-xl p-1 gap-1">
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              view === "map" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Map className="w-4 h-4" /> Mapa
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              view === "list" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="w-4 h-4" /> Lista
          </button>
        </div>
      </div>

      {/* Map view */}
      {view === "map" && (
        <div className="flex-1 p-3">
          {isLoading || locationStatus === "loading" ? (
            <div className="w-full h-full rounded-2xl bg-muted animate-pulse flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Navigation className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p className="text-sm">Cargando mapa...</p>
              </div>
            </div>
          ) : (
            <CourtsMap
              courts={nearbyCourts}
              userLocation={userLocation}
            />
          )}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array(6).fill(0).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-border">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                ))
              : nearbyCourts.map((court, i) => (
                  <motion.div
                    key={court.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <CourtCard court={court} />
                  </motion.div>
                ))}
          </div>

          {!isLoading && nearbyCourts.length === 0 && (
            <div className="text-center py-20">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-lg font-medium">No hay canchas en tu zona</p>
              <p className="text-muted-foreground text-sm mt-1">No encontramos canchas en un radio de {RADIUS_KM} km</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}