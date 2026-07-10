import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet default icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const surfaceLabels = {
  cesped_sintetico: "Césped Sint.",
  cemento: "Cemento",
  cristal: "Cristal",
};

function createCourtIcon(isActive) {
  const color = isActive ? "#22c55e" : "#ef4444";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
    <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="18" cy="18" r="8" fill="white"/>
    <path d="M13 18h10M18 13v10" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
    className: "",
  });
}

function createUserIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="9" fill="#3b82f6" stroke="white" stroke-width="2"/>
    <circle cx="10" cy="10" r="4" fill="white"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    className: "",
  });
}

function SetView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function CourtsMap({ courts, userLocation, onCourtSelect }) {
  const defaultCenter = userLocation || [-34.6037, -58.3816]; // Buenos Aires

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-border shadow-lg">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <>
            <SetView center={userLocation} />
            <Marker position={userLocation} icon={createUserIcon()}>
              <Popup>
                <div className="text-center p-1">
                  <p className="font-semibold text-sm">Tu ubicación</p>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={userLocation}
              radius={7000}
              pathOptions={{
                color: "#22c55e",
                fillColor: "#22c55e",
                fillOpacity: 0.05,
                weight: 2,
                dashArray: "6 6",
              }}
            />
          </>
        )}

        {courts.map((court) => (
          court.latitude && court.longitude ? (
            <Marker
              key={court.id}
              position={[court.latitude, court.longitude]}
              icon={createCourtIcon(court.is_active)}
              eventHandlers={{ click: () => onCourtSelect && onCourtSelect(court) }}
            >
              <Popup maxWidth={220}>
                <div className="p-1 min-w-[180px]">
                  <img
                    src={court.image_url || "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&h=150&fit=crop"}
                    alt={court.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <p className="font-bold text-sm">{court.name}</p>
                  {court.address && (
                    <p className="text-xs text-gray-500 mt-0.5">{court.address}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${court.is_active ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-xs font-medium">{court.is_active ? "Disponible" : "No disponible"}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {surfaceLabels[court.surface_type] || court.surface_type} · ${court.price_per_hour?.toLocaleString()}/h
                  </p>
                  {court.is_active && (
                    <Link to={`/book?courtId=${court.id}`} className="block mt-2">
                      <button className="w-full bg-green-600 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-green-700 transition-colors">
                        Reservar
                      </button>
                    </Link>
                  )}
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}