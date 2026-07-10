import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import CreatePost from "@/components/social/CreatePost";
import PostCard from "@/components/social/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Feed() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => base44.entities.Post.list("-created_date", 50),
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold mb-6">Comunidad</h1>
      </motion.div>

      <div className="space-y-6">
        <CreatePost />

        {isLoading
          ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)
          : posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}

        {!isLoading && posts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No hay publicaciones todavía. ¡Sé el primero en publicar!</p>
          </div>
        )}
      </div>
    </div>
  );
}