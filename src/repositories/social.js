/**
 * social.js — SocialRepository
 *
 * Única fuente de verdad para Posts, Comments y Follows.
 */
import { base44 } from "@/api/base44Client";

export const SocialRepository = {
  posts: {
    /** Feed global */
    getAll: (limit = 50) =>
      base44.entities.Post.list("-created_date", limit),

    /** Posts de un autor específico */
    getByAuthor: (authorEmail) =>
      base44.entities.Post.filter({ author_email: authorEmail }, "-created_date"),

    /** Crea un post nuevo */
    create: (data) => base44.entities.Post.create(data),

    /** Elimina un post */
    delete: (id) => base44.entities.Post.delete(id),
  },

  comments: {
    /** Comentarios de un post específico */
    getByPost: (postId) =>
      base44.entities.Comment.filter({ post_id: postId }, "created_date"),

    /** Crea un comentario */
    create: (data) => base44.entities.Comment.create(data),
  },

  follows: {
    /** Usuarios que siguen a `email` */
    getFollowers: (email) =>
      base44.entities.Follow.filter({ following_email: email }),

    /** Usuarios que `email` sigue */
    getFollowing: (email) =>
      base44.entities.Follow.filter({ follower_email: email }),

    /** Crea una relación de seguimiento */
    follow: (followerEmail, followingEmail) =>
      base44.entities.Follow.create({
        follower_email: followerEmail,
        following_email: followingEmail,
      }),

    /** Elimina una relación de seguimiento */
    unfollow: (id) => base44.entities.Follow.delete(id),
  },
};
