import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import CourtRating from "@/components/courts/CourtRating";

const surfaceLabels = {
  cesped_sintetico: "Césped Sintético",
  cemento: "Cemento",
  cristal: "Cristal",
};

export default function CourtCard({ court }) {
  return (
    <Card className="overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border hover:border-primary/20">
      <div className="relative h-48 overflow-hidden">
        <img
          src={court.image_url || "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop"}
          alt={court.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {court.is_covered && (
            <Badge className="bg-secondary/90 text-secondary-foreground backdrop-blur-sm">Techada</Badge>
          )}
          <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
            {surfaceLabels[court.surface_type] || court.surface_type}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-heading font-semibold text-lg">{court.name}</h3>
        <div className="mt-1">
          <CourtRating courtId={court.id} />
        </div>
        {court.description && (
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{court.description}</p>
        )}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-heading font-bold text-lg text-primary">
              ${court.price_per_hour?.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm">/hora</span>
          </div>
          <Link to={`/book?courtId=${court.id}`}>
            <Button size="sm" className="rounded-xl">
              Reservar
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}