import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Star, MapPin, Navigation, AlertCircle, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AMENITY_FILTER_OPTIONS } from "@/constants";

const RADIUS_KM = 50; // Radio amplio para asegurar que aparezcan canchas

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

// ── Marker con precio (estilo Airbnb) ─────────────────────────────────────────
function createPriceIcon(price, isHovered = false) {
  const label = `$${(price / 1000).toFixed(0)}k`;
  const bg    = isHovered ? "#111827" : "#ffffff";
  const color = isHovered ? "#ffffff" : "#111827";
  const border = isHovered ? "#111827" : "#d1d5db";
  const shadow = isHovered
    ? "0 4px 20px rgba(0,0,0,0.40)"
    : "0 2px 10px rgba(0,0,0,0.16)";

  // Medimos el texto para calcular el ancho del icono
  const charWidth = label.length * 8 + 24; // aprox px
  const height = 32;

  const html = `<div style="
    display:inline-flex;
    align-items:center;
    justify-content:center;
    background:${bg};
    color:${color};
    border:1.5px solid ${border};
    border-radius:999px;
    padding:0 12px;
    height:${height}px;
    font-size:13px;
    font-weight:700;
    line-height:1;
    white-space:nowrap;
    box-shadow:${shadow};
    transform:${isHovered ? "scale(1.08)" : "scale(1)"};
    transition:transform .12s ease, background .12s ease;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    cursor:pointer;
  ">${label}</div>`;

  return L.divIcon({
    html,
    className: "",          // elimina el fondo/borde blanco de Leaflet
    iconSize: [charWidth, height],
    iconAnchor: [charWidth / 2, height / 2],
    popupAnchor: [0, -(height / 2 + 4)],
  });
}

function SetViewOnCourts({ courts, userLocation }) {
  const map = useMap();
  useEffect(() => {
    const withCoords = courts.filter((c) => c.latitude && c.longitude);
    if (userLocation) {
      map.setView(userLocation, 13);
    } else if (withCoords.length > 0) {
      const bounds = withCoords.map((c) => [c.latitude, c.longitude]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
   
  }, []);
  return null;
}

// ── Card de cancha estilo Airbnb (Split Horizontal) ──────────────────────────
function CourtListCard({ court, isHovered, onHover, onLeave }) {
  const amenityIcons = court.amenities?.slice(0, 3) || [];
  const images = (court.images?.length ? court.images : [court.image_url]).filter(Boolean);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        "group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col md:flex-row h-auto md:h-64",
        isHovered
          ? "border-foreground shadow-xl shadow-black/10"
          : "border-border hover:border-foreground/30 hover:shadow-lg"
      )}
    >
      {/* Detalle (Izquierda) */}
      <div className="flex-1 p-5 flex flex-col justify-between order-2 md:order-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight truncate">{court.name}</h3>
              {court.address && (
                <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-primary" />
                  {court.address}
                </p>
              )}
            </div>
            <div className="shrink-0 flex items-center gap-1 text-sm font-semibold bg-accent/30 px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span>{court.rating?.toFixed(1) || "—"}</span>
              {court.review_count > 0 && (
                <span className="text-muted-foreground font-normal text-xs">({court.review_count})</span>
              )}
            </div>
          </div>

          {court.description && (
            <p className="text-muted-foreground text-sm mt-3 line-clamp-2 md:line-clamp-3 leading-relaxed">
              {court.description}
            </p>
          )}

          {amenityIcons.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {amenityIcons.map((a) => (
                <span key={a} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div>
            <span className="font-bold text-lg">${court.price_per_hour?.toLocaleString()}</span>
            <span className="text-muted-foreground text-sm"> /hora</span>
          </div>
          <Link to={`/book?courtId=${court.id}`}>
            <Button size="sm" className="rounded-xl px-5 font-semibold">
              Reservar
            </Button>
          </Link>
        </div>
      </div>

      {/* Galería / Slideshow de fotos (Derecha) */}
      <div className="w-full md:w-[40%] relative h-56 md:h-full bg-muted overflow-hidden order-1 md:order-2 shrink-0">
        <img
          src={images[currentImgIndex]}
          alt={`${court.name} - foto ${currentImgIndex + 1}`}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />

        {/* Badge Techada */}
        {court.is_covered && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm z-10">
            🏠 Techada
          </span>
        )}

        {/* Controles del slideshow */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-foreground flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-foreground flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Indicadores de puntos (Dots) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-150",
                    idx === currentImgIndex ? "bg-white scale-125" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function Courts() {
  const [hoveredCourtId, setHoveredCourtId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [selectedFilters, setSelectedFilters] = useState([]);

  const { data: courts = [], isLoading } = useQuery({
    queryKey: ["courts"],
    queryFn: () => base44.entities.Court.filter({ is_active: true }, "-created_date", 300),
  });

  useEffect(() => {
    setLocationStatus("loading");
    if (!navigator.geolocation) { setLocationStatus("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocationStatus("granted");
      },
      () => setLocationStatus("denied"),
      { timeout: 8000 }
    );
  }, []);

  const nearbyCourts = userLocation
    ? courts.filter((c) => {
        if (!c.latitude || !c.longitude) return true;
        return getDistanceKm(userLocation[0], userLocation[1], c.latitude, c.longitude) <= RADIUS_KM;
      })
    : courts;

  // filterOptions viene de @/constants/courtTypes

  const toggleFilter = (val) => {
    setSelectedFilters((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const filteredCourts = nearbyCourts.filter((court) => {
    return selectedFilters.every((filter) => {
      if (filter === "Techada") return court.is_covered;
      return court.amenities?.includes(filter);
    });
  });

  const defaultCenter = userLocation || [-31.4167, -64.1895]; // Córdoba default center

  return (
    <div className="flex items-start relative">

      {/* ── Panel izquierdo — lista (scroll natural de página) ───────────── */}
      <div className="w-full lg:w-[62%] flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h1 className="font-heading text-xl font-bold">
            {isLoading ? "Cargando canchas…" : `${filteredCourts.length} canchas disponibles`}
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            {locationStatus === "loading" && (
              <p className="text-muted-foreground text-xs flex items-center gap-1">
                <Navigation className="w-3 h-3 animate-pulse" /> Detectando tu ubicación…
              </p>
            )}
            {locationStatus === "granted" && (
              <p className="text-green-600 text-xs flex items-center gap-1">
                <Navigation className="w-3 h-3" /> Canchas en un radio de {RADIUS_KM} km
              </p>
            )}
            {locationStatus === "denied" && (
              <p className="text-amber-600 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Activá la ubicación para ver canchas cercanas
              </p>
            )}
          </div>
        </div>

        {/* Lista — fluye con la página */}
        <div className="px-6 pb-16">
          {isLoading ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border overflow-hidden animate-pulse">
                  <div className="h-52 bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mb-3 opacity-40" />
              <p className="font-medium">No hay canchas con estos filtros</p>
              <p className="text-sm mt-1">Intenta quitar algunos filtros para ver opciones</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCourts.map((court) => (
                <CourtListCard
                  key={court.id}
                  court={court}
                  isHovered={hoveredCourtId === court.id}
                  onHover={() => setHoveredCourtId(court.id)}
                  onLeave={() => setHoveredCourtId(null)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Panel derecho — mapa STICKY con Titulo y Filtros ────────────────── */}
      <div className="hidden lg:flex lg:w-[38%] sticky top-16 h-[calc(100vh-4rem)] py-4 pr-5 pl-2 flex-col gap-3">
        
        {/* Titulo y filtros */}
        <div className="bg-background z-10 shrink-0">
          <h2 className="text-xs font-semibold text-foreground/80 tracking-wider uppercase px-1 mb-2">
            Elije las opciones para tu cancha
          </h2>
          {/* Fila de filtros con scroll horizontal */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 px-1 scrollbar-none">
            {/* Botón Filtros (estilo Airbnb con badge de contador) */}
            <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-semibold text-foreground bg-background select-none">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros</span>
              {selectedFilters.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold">
                  {selectedFilters.length}
                </span>
              )}
            </div>
            <div className="w-[1px] h-4 bg-border shrink-0" />
            
            {/* Pills de opciones */}
            {AMENITY_FILTER_OPTIONS.map((opt) => {
              const active = selectedFilters.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleFilter(opt.value)}
                  className={cn(
                    "shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all duration-150",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground/30 bg-background text-muted-foreground"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {(isLoading || locationStatus === "loading") ? (
          <div className="flex-1 w-full rounded-2xl bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Navigation className="w-8 h-8 mx-auto mb-2 animate-pulse" />
              <p className="text-sm">Cargando mapa…</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full rounded-2xl overflow-hidden shadow-md border border-border">
            <MapContainer
              center={defaultCenter}
              zoom={12}
              style={{ width: "100%", height: "100%" }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                maxZoom={19}
              />
              <SetViewOnCourts courts={filteredCourts} userLocation={userLocation} />

              {filteredCourts.map((court) =>
                court.latitude && court.longitude ? (
                  <Marker
                    key={court.id}
                    position={[court.latitude, court.longitude]}
                    icon={createPriceIcon(court.price_per_hour, hoveredCourtId === court.id)}
                    eventHandlers={{
                      mouseover: () => setHoveredCourtId(court.id),
                      mouseout: () => setHoveredCourtId(null),
                    }}
                    zIndexOffset={hoveredCourtId === court.id ? 1000 : 0}
                  >
                    <Popup maxWidth={220} className="court-popup">
                      <div className="p-1 min-w-[190px]">
                        <img
                          src={court.image_url || "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&h=150&fit=crop"}
                          alt={court.name}
                          className="w-full h-24 object-cover rounded-lg mb-2"
                        />
                        <p className="font-bold text-sm leading-tight">{court.name}</p>
                        {court.address && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{court.address}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold">${court.price_per_hour?.toLocaleString()}<span className="font-normal text-gray-500">/h</span></span>
                          {court.rating && (
                            <span className="flex items-center gap-0.5 text-xs font-semibold">
                              <Star className="w-3 h-3 fill-black" /> {court.rating}
                            </span>
                          )}
                        </div>
                        <Link to={`/book?courtId=${court.id}`}>
                          <button className="w-full mt-2 bg-foreground text-background text-xs font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
                            Reservar
                          </button>
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              )}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}