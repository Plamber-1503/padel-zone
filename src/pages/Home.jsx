import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Trophy, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: CalendarDays,
    title: "Reservá tu cancha",
    description: "Elegí el horario que más te convenga y reservá en segundos.",
    href: "/courts",
  },
  {
    icon: Users,
    title: "Comunidad activa",
    description: "Conectá con otros jugadores, compartí fotos y encontrá compañeros.",
    href: "/feed",
  },
  {
    icon: Trophy,
    title: "Mejorá tu juego",
    description: "Seguí a los mejores jugadores y aprendé de la comunidad.",
    href: "/feed",
  },
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent rounded-full text-accent-foreground text-xs font-medium mb-6">
              <Zap className="w-3 h-3" />
              La mejor plataforma de pádel
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Tu cancha.
              <br />
              <span className="text-primary">Tu juego.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
              Reservá canchas de pádel, conectá con otros jugadores y llevá tu juego al siguiente nivel.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/courts">
                <Button size="lg" className="rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-primary/25">
                  Reservar cancha
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/feed">
                <Button size="lg" variant="outline" className="rounded-xl px-8 h-12 text-base font-semibold">
                  Explorar comunidad
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Link to={feature.href} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="group cursor-pointer p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-accent-foreground group-hover:text-primary-foreground" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                  <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>


      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="rounded-2xl bg-secondary text-secondary-foreground p-10 md:p-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Jugadores" },
              { value: "12", label: "Canchas" },
              { value: "2k+", label: "Reservas" },
              { value: "4.9★", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-3xl md:text-4xl font-bold">{stat.value}</p>
                <p className="text-secondary-foreground/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}