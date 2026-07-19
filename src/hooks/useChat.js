/**
 * useChat.js
 *
 * Hook de React Query para mensajes de chat.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatRepository } from "@/repositories/chat";
import { QUERY_KEYS } from "@/lib/query-keys";

/**
 * Mensajes de la conversación entre el usuario autenticado y otro usuario.
 * Hace polling cada 5s mientras hay una conversación activa.
 */
export function useChatMessages(userEmail, otherEmail) {
  return useQuery({
    queryKey: QUERY_KEYS.chat.messages(userEmail, otherEmail),
    queryFn: () => ChatRepository.getConversations(userEmail),
    enabled: !!userEmail,
    // Solo hace polling si hay conversación seleccionada
    refetchInterval: otherEmail ? 5_000 : false,
  });
}

/** Envía un mensaje al usuario seleccionado */
export function useSendMessage(userEmail, otherEmail) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content) =>
      ChatRepository.send(userEmail, otherEmail, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.chat.messages(userEmail, otherEmail),
      });
    },
  });
}
