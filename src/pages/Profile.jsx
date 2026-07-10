import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, ImagePlus, LogOut, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import PostCard from "@/components/social/PostCard";
import { Link } from "react-router-dom";
import MercadoPagoSection from "@/components/payments/MercadoPagoSection";

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [level, setLevel] = useState(user?.level || "intermedio");

  const { data: myPosts = [] } = useQuery({
    queryKey: ["my-posts", user?.email],
    queryFn: () => base44.entities.Post.filter({ author_email: user?.email }, "-created_date"),
    enabled: !!user?.email,
  });

  const { data: followers = [] } = useQuery({
    queryKey: ["followers", user?.email],
    queryFn: () => base44.entities.Follow.filter({ following_email: user?.email }),
    enabled: !!user?.email,
  });

  const { data: following = [] } = useQuery({
    queryKey: ["following", user?.email],
    queryFn: () => base44.entities.Follow.filter({ follower_email: user?.email }),
    enabled: !!user?.email,
  });

  const updateProfile = useMutation({
    mutationFn: () => base44.auth.updateMe({ bio, level }),
    onSuccess: () => {
      setEditing(false);
      toast.success("Perfil actualizado");
    },
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ avatar_url: file_url });
      toast.success("Foto actualizada");
      queryClient.invalidateQueries();
    }
  };

  const initials = (user?.full_name || user?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const levelLabels = {
    principiante: "Principiante",
    intermedio: "Intermedio",
    avanzado: "Avanzado",
    profesional: "Profesional",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  <ImagePlus className="w-6 h-6 text-white" />
                </label>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-heading text-2xl font-bold">{user?.full_name || user?.email}</h2>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
                {user?.bio && <p className="text-sm mt-2">{user.bio}</p>}
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                  <Badge className="bg-accent text-accent-foreground">
                    {levelLabels[user?.level] || "Intermedio"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{followers.length} seguidores</span>
                  <span className="text-sm text-muted-foreground">{following.length} siguiendo</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(!editing)} className="rounded-xl">
                  <Settings className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => base44.auth.logout()}
                  className="rounded-xl text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {editing && (
              <div className="mt-6 space-y-4 border-t border-border pt-6">
                <div>
                  <Label>Biografía</Label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Contanos sobre vos..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Nivel</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="principiante">Principiante</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="avanzado">Avanzado</SelectItem>
                      <SelectItem value="profesional">Profesional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => updateProfile.mutate()} className="rounded-xl">
                  Guardar cambios
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mercado Pago — solo para dueños de cancha */}
        {(user?.role === "court_owner" || user?.role === "admin") && (
          <MercadoPagoSection user={user} onUpdate={() => queryClient.invalidateQueries()} />
        )}

        {/* Tabs */}
        <Tabs defaultValue="posts" className="mt-6">
          <TabsList className="w-full">
            <TabsTrigger value="posts" className="flex-1">Publicaciones</TabsTrigger>
            <TabsTrigger value="bookings" className="flex-1">Reservas</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="space-y-4 mt-4">
            {myPosts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No tenés publicaciones todavía.</p>
            ) : (
              myPosts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </TabsContent>
          <TabsContent value="bookings" className="mt-4">
            <Link to="/my-bookings">
              <Button variant="outline" className="w-full rounded-xl">
                <CalendarDays className="w-4 h-4 mr-2" />
                Ver mis reservas
              </Button>
            </Link>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}