/**
 * useSocial.js
 *
 * Hooks de React Query para Posts, Comments y Follows.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SocialRepository } from "@/repositories/social";
import { QUERY_KEYS } from "@/lib/query-keys";

/** Feed global de posts */
export function usePosts() {
  return useQuery({
    queryKey: QUERY_KEYS.social.posts,
    queryFn: () => SocialRepository.posts.getAll(),
  });
}

/** Posts de un autor específico */
export function usePostsByAuthor(authorEmail) {
  return useQuery({
    queryKey: QUERY_KEYS.social.byAuthor(authorEmail),
    queryFn: () => SocialRepository.posts.getByAuthor(authorEmail),
    enabled: !!authorEmail,
  });
}

/** Followers de un usuario */
export function useFollowers(email) {
  return useQuery({
    queryKey: QUERY_KEYS.social.followers(email),
    queryFn: () => SocialRepository.follows.getFollowers(email),
    enabled: !!email,
  });
}

/** Usuarios que sigue un usuario */
export function useFollowing(email) {
  return useQuery({
    queryKey: QUERY_KEYS.social.following(email),
    queryFn: () => SocialRepository.follows.getFollowing(email),
    enabled: !!email,
  });
}

/** Crea un post nuevo */
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => SocialRepository.posts.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.social.posts });
    },
  });
}
