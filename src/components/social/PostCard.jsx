import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isLiked = post.likes?.includes(user?.email);

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => base44.entities.Comment.filter({ post_id: post.id }, "-created_date"),
    enabled: showComments,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const currentLikes = post.likes || [];
      const newLikes = isLiked
        ? currentLikes.filter((e) => e !== user?.email)
        : [...currentLikes, user?.email];
      await base44.entities.Post.update(post.id, { likes: newLikes });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.Comment.create({
        post_id: post.id,
        author_email: user?.email,
        author_name: user?.full_name || user?.email,
        content: commentText,
      });
      await base44.entities.Post.update(post.id, {
        comments_count: (post.comments_count || 0) + 1,
      });
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const initials = (post.author_name || post.author_email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <Link to={`/user/${encodeURIComponent(post.author_email)}`}>
            <Avatar className="w-10 h-10 bg-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link to={`/user/${encodeURIComponent(post.author_email)}`} className="font-semibold text-sm hover:underline">
              {post.author_name || post.author_email}
            </Link>
            <p className="text-xs text-muted-foreground">
              {post.created_date
                ? formatDistanceToNow(new Date(post.created_date), { addSuffix: true, locale: es })
                : ""}
            </p>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
        {post.image_url && (
          <div className="rounded-xl overflow-hidden mb-3">
            <img src={post.image_url} alt="" className="w-full max-h-96 object-cover" />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2 border-t border-border">
          <button
            onClick={() => likeMutation.mutate()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Heart
              className={cn("w-5 h-5 transition-all", isLiked && "fill-primary text-primary scale-110")}
            />
            <span>{post.likes?.length || 0}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments_count || 0}</span>
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-4 space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="bg-muted text-xs font-medium">
                    {(c.author_name || "?")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted rounded-xl px-3 py-2">
                  <p className="text-xs font-semibold">{c.author_name}</p>
                  <p className="text-sm">{c.content}</p>
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escribí un comentario..."
                className="rounded-xl text-sm"
                onKeyDown={(e) => e.key === "Enter" && commentText.trim() && commentMutation.mutate()}
              />
              <Button
                size="icon"
                disabled={!commentText.trim() || commentMutation.isPending}
                onClick={() => commentMutation.mutate()}
                className="rounded-xl shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}