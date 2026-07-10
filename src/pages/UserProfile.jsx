import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, UserMinus, MessageCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PostCard from "@/components/social/PostCard";

const levelLabels = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
  profesional: "Profesional",
};

export default function UserProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const userEmail = decodeURIComponent(window.location.pathname.split("/user/")[1] || "");
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: users = [], isLoading: loadingUser } = useQuery({
    queryKey: ["user-profile", userEmail],
    queryFn: () => base44.entities.User.filter({ email: userEmail }),
    enabled: !!userEmail,
  });
  const profileUser = users[0];

  const { data: posts = [] } = useQuery({
    queryKey: ["user-posts", userEmail],
    queryFn: () => base44.entities.Post.filter({ author_email: userEmail }, "-created_date"),
    enabled: !!userEmail,
  });

  const { data: followers = [] } = useQuery({
    queryKey: ["user-followers", userEmail],
    queryFn: () => base44.entities.Follow.filter({ following_email: userEmail }),
    enabled: !!userEmail,
  });

  const { data: following = [] } = useQuery({
    queryKey: ["user-following", userEmail],
    queryFn: () => base44.entities.Follow.filter({ follower_email: userEmail }),
    enabled: !!userEmail,
  });

  const isFollowing = followers.some((f) => f.follower_email === currentUser?.email);
  const isOwnProfile = userEmail === currentUser?.email;

  const followMutation = useMutation({
    mutationFn: async () => {
      if (isFollowing) {
        const follow = followers.find((f) => f.follower_email === currentUser?.email);
        if (follow) await base44.entities.Follow.delete(follow.id);
      } else {
        await base44.entities.Follow.create({
          follower_email: currentUser?.email,
          following_email: userEmail,
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user-followers", userEmail] }),
  });

  if (isOwnProfile) {
    navigate("/profile");
    return null;
  }

  const initials = (profileUser?.full_name || userEmail || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/feed" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Link>

      {loadingUser ? (
        <Skeleton className="h-48 rounded-2xl" />
      ) : profileUser ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profileUser.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="font-heading text-2xl font-bold">{profileUser.full_name || profileUser.email}</h2>
                  {profileUser.bio && <p className="text-sm text-muted-foreground mt-1">{profileUser.bio}</p>}
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                    <Badge className="bg-accent text-accent-foreground">
                      {levelLabels[profileUser.level] || "Intermedio"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{followers.length} seguidores</span>
                    <span className="text-sm text-muted-foreground">{following.length} siguiendo</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => followMutation.mutate()}
                    variant={isFollowing ? "outline" : "default"}
                    className="rounded-xl"
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-1" />
                        Dejar de seguir
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-1" />
                        Seguir
                      </>
                    )}
                  </Button>
                  <Link to="/chat">
                    <Button variant="outline" className="rounded-xl">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-4">
            <h3 className="font-heading font-semibold text-lg">Publicaciones</h3>
            {posts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Sin publicaciones.</p>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </motion.div>
      ) : (
        <p className="text-center text-muted-foreground py-20">Usuario no encontrado.</p>
      )}
    </div>
  );
}