import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatMessage } from "@shared/schema";
import { wsManager } from "@/lib/websocket";
import { apiRequest } from "@/lib/queryClient";

export function useChat(senderId: string, receiverId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const queryClient = useQueryClient();

  // Fetch chat history
  const { data: chatHistory, isLoading } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat', senderId, receiverId],
    enabled: !!senderId && !!receiverId,
  });

  // Initialize messages when chat history loads
  useEffect(() => {
    if (chatHistory) {
      setMessages(chatHistory);
    }
  }, [chatHistory]);

  // Connect to WebSocket and listen for new messages
  useEffect(() => {
    if (!senderId) return;

    wsManager.connect(senderId);

    const unsubscribe = wsManager.onMessage((message: ChatMessage) => {
      if (
        (message.senderId === senderId && message.receiverId === receiverId) ||
        (message.senderId === receiverId && message.receiverId === senderId)
      ) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      unsubscribe();
      wsManager.disconnect();
    };
  }, [senderId, receiverId]);

  // Send message function
  const sendMessage = (message: string) => {
    if (!senderId || !receiverId || !message.trim()) return;

    wsManager.sendMessage(receiverId, message);
  };

  return {
    messages,
    sendMessage,
    isLoading,
  };
}
