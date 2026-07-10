import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import CreatePost from "@/components/social/CreatePost";
import PostCard from "@/components/social/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Feed() {
  const { user } = useAuth();
  const [tab, setTab] = useState("all"); // "all" | "following"

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => base44.entities.Post.list("-created_date", 50),
  });

  // Reforma: antes el sistema de Follow existía pero no se usaba para nada
  // en el feed (era 100% global). Ahora se puede filtrar por "Siguiendo".
  const { data: following = [] } = useQuery({
    queryKey: ["my-following", user?.email],
    queryFn: () => base44.entities.Follow.filter({ follower_email: user?.email }),
    enabled: !!user?.email && tab === "following",
  });
  const followingEmails = new Set(following.map((f) => f.following_email));

  const visiblePosts =
    tab === "following"
      ? posts.filter((p) => followingEmails.has(p.author_email) || p.author_email === user?.email)
      : posts;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold mb-6">Comunidad</h1>
      </motion.div>

      <div className="flex items-center bg-muted rounded-xl p-1 gap-1 mb-6 w-fit">
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            tab === "all" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setTab("following")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            tab === "following" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Siguiendo
        </button>
      </div>

      <div className="space-y-6">
        <CreatePost />

        {isLoading
          ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)
          : visiblePosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}

        {!isLoading && visiblePosts.length === 0 && tab === "following" && (
          <div className="text-center py-16 text-muted-foreground">
            <p>Todavía no seguís a nadie que haya publicado.</p>
            <p className="text-sm mt-1">Buscá jugadores desde el chat o sus perfiles para empezar a seguirlos.</p>
          </div>
        )}

        {!isLoading && visiblePosts.length === 0 && tab === "all" && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No hay publicaciones todavía. ¡Sé el primero en publicar!</p>
          </div>
        )}
      </div>
    </div>
  );
}
