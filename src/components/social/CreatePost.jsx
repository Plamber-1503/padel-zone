import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CreatePost() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const postMutation = useMutation({
    mutationFn: async () => {
      let image_url = "";
      if (imageFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: imageFile });
        image_url = file_url;
      }
      await base44.entities.Post.create({
        author_email: user?.email,
        author_name: user?.full_name || user?.email,
        content,
        image_url,
        likes: [],
        comments_count: 0,
      });
    },
    onSuccess: () => {
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("¡Publicación creada!");
    },
  });

  const initials = (user?.full_name || user?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="¿Qué estás pensando? Compartí algo con la comunidad..."
              className="min-h-[80px] rounded-xl text-sm resize-none border-0 bg-muted focus:bg-card"
            />
            {imagePreview && (
              <div className="relative inline-block">
                <img src={imagePreview} alt="" className="h-32 rounded-xl object-cover" />
                <button
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="flex justify-between items-center">
              <label className="cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                <ImagePlus className="w-5 h-5" />
              </label>
              <Button
                onClick={() => postMutation.mutate()}
                disabled={!content.trim() || postMutation.isPending}
                size="sm"
                className="rounded-xl px-6"
              >
                {postMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publicar"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}