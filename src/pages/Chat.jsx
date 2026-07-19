import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function Chat() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // Reforma: antes se traían TODOS los usuarios sin límite. Esto no escala
  // con la base de usuarios creciendo. Se agrega un límite razonable; la
  // reforma completa (búsqueda server-side con paginación real) requiere
  // un endpoint de búsqueda dedicado en el backend.
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => base44.entities.User.list("-created_date", 200),
  });

  const otherUsers = users.filter((u) => u.email !== user?.email);
  const filteredUsers = otherUsers.filter(
    (u) =>
      (u.full_name || u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get messages with selected user
  const { data: allMessages = [] } = useQuery({
    queryKey: ["chat-messages", user?.email, selectedUser?.email],
    queryFn: async () => {
      const sent = await base44.entities.ChatMessage.filter({ sender_email: user?.email }, "-created_date", 100);
      const received = await base44.entities.ChatMessage.filter({ receiver_email: user?.email }, "-created_date", 100);
      return [...sent, ...received].sort(
        (a, b) => new Date(a.created_date) - new Date(b.created_date)
      );
    },
    enabled: !!user?.email,
    refetchInterval: 5000,
  });

  const conversationMessages = selectedUser
    ? allMessages.filter(
        (m) =>
          (m.sender_email === user?.email && m.receiver_email === selectedUser.email) ||
          (m.sender_email === selectedUser.email && m.receiver_email === user?.email)
      )
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages.length]);

  const sendMutation = useMutation({
    mutationFn: () =>
      base44.entities.ChatMessage.create({
        sender_email: user?.email,
        receiver_email: selectedUser.email,
        content: messageText,
        is_read: false,
      }),
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ["chat-messages"] });
    },
  });

  // Get last messages for each conversation
  const getLastMessage = (userEmail) => {
    const msgs = allMessages.filter(
      (m) =>
        (m.sender_email === user?.email && m.receiver_email === userEmail) ||
        (m.sender_email === userEmail && m.receiver_email === user?.email)
    );
    return msgs[msgs.length - 1];
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const lastA = getLastMessage(a.email);
    const lastB = getLastMessage(b.email);
    if (!lastA && !lastB) return 0;
    if (!lastA) return 1;
    if (!lastB) return -1;
    return new Date(lastB.created_date) - new Date(lastA.created_date);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-6">Mensajes</h1>
      <Card className="overflow-hidden h-[calc(100vh-14rem)]">
        <div className="flex h-full">
          {/* Contact list */}
          <div className={cn(
            "w-full md:w-80 border-r border-border flex flex-col",
            selectedUser ? "hidden md:flex" : "flex"
          )}>
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar jugador..."
                  className="pl-9 rounded-xl"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {sortedUsers.map((u) => {
                const lastMsg = getLastMessage(u.email);
                const isSelected = selectedUser?.email === u.email;
                return (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left",
                      isSelected && "bg-accent"
                    )}
                  >
                    <Avatar className="w-10 h-10 shrink-0">
                      {u.avatar_url && <AvatarImage src={u.avatar_url} alt={u.full_name} />}
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {(u.full_name || u.email || "?")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{u.full_name || u.email}</p>
                      {lastMsg && (
                        <p className="text-xs text-muted-foreground truncate">{lastMsg.content}</p>
                      )}
                    </div>
                  </button>
                );
              })}
              {sortedUsers.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">No se encontraron usuarios.</p>
              )}
            </ScrollArea>
          </div>

          {/* Chat area */}
          <div className={cn(
            "flex-1 flex flex-col",
            !selectedUser ? "hidden md:flex" : "flex"
          )}>
            {selectedUser ? (
              <>
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <button onClick={() => setSelectedUser(null)} className="md:hidden">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <Avatar className="w-8 h-8">
                    {selectedUser.avatar_url && <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.full_name} />}
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {(selectedUser.full_name || selectedUser.email || "?")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-sm">{selectedUser.full_name || selectedUser.email}</span>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {conversationMessages.map((m) => {
                      const isMine = m.sender_email === user?.email;
                      return (
                        <div key={m.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                          <div
                            className={cn(
                              "max-w-[75%] rounded-2xl px-4 py-2.5",
                              isMine
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted rounded-bl-md"
                            )}
                          >
                            <p className="text-sm">{m.content}</p>
                            <p className={cn(
                              "text-[10px] mt-1",
                              isMine ? "text-primary-foreground/60" : "text-muted-foreground"
                            )}>
                              {m.created_date
                                ? formatDistanceToNow(new Date(m.created_date), { addSuffix: true, locale: es })
                                : ""}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="p-3 border-t border-border flex gap-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Escribí un mensaje..."
                    className="rounded-xl"
                    onKeyDown={(e) => e.key === "Enter" && messageText.trim() && sendMutation.mutate()}
                  />
                  <Button
                    size="icon"
                    disabled={!messageText.trim() || sendMutation.isPending}
                    onClick={() => sendMutation.mutate()}
                    className="rounded-xl shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Seleccioná un jugador para chatear</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}