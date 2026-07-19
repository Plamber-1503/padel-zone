/**
 * chat.js — ChatRepository
 */
import { base44 } from "@/api/base44Client";

export const ChatRepository = {
  /**
   * Obtiene todos los mensajes enviados Y recibidos por un usuario.
   * Nota: dos queries separadas porque la API no soporta OR en filtros.
   */
  getConversations: async (userEmail, limit = 100) => {
    const [sent, received] = await Promise.all([
      base44.entities.ChatMessage.filter(
        { sender_email: userEmail },
        "-created_date",
        limit
      ),
      base44.entities.ChatMessage.filter(
        { receiver_email: userEmail },
        "-created_date",
        limit
      ),
    ]);
    return [...sent, ...received].sort(
      (a, b) => new Date(a.created_date) - new Date(b.created_date)
    );
  },

  /** Envía un mensaje a otro usuario */
  send: (senderEmail, receiverEmail, content) =>
    base44.entities.ChatMessage.create({
      sender_email: senderEmail,
      receiver_email: receiverEmail,
      content,
      is_read: false,
    }),
};
