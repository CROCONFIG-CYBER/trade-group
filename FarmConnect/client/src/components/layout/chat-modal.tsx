import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/hooks/use-auth";
import { X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiverId?: string;
  receiverName?: string;
  receiverAvatar?: string;
}

export function ChatModal({ 
  isOpen, 
  onClose, 
  receiverId = "seller-1", 
  receiverName = "Green Valley Farm",
  receiverAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"
}: ChatModalProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, isLoading } = useChat(
    user?.uid || "",
    receiverId
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" data-testid="chat-modal">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-96 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10" data-testid="chat-receiver-avatar">
              <AvatarImage src={receiverAvatar} />
              <AvatarFallback>{receiverName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900" data-testid="chat-receiver-name">{receiverName}</h3>
              <p className="text-sm text-gray-600" data-testid="chat-status">Online now</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-chat">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4" data-testid="chat-messages">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((msg) => {
              const isFromUser = msg.senderId === user?.uid;
              return (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex items-start space-x-3",
                    isFromUser ? "justify-end" : "justify-start"
                  )}
                  data-testid={`chat-message-${msg.id}`}
                >
                  {!isFromUser && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={receiverAvatar} />
                      <AvatarFallback>{receiverName[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div 
                    className={cn(
                      "rounded-lg px-4 py-2 max-w-xs",
                      isFromUser 
                        ? "bg-primary text-white" 
                        : "bg-gray-100 text-gray-900"
                    )}
                  >
                    <p className="text-sm" data-testid={`message-text-${msg.id}`}>{msg.message}</p>
                    <span 
                      className={cn(
                        "text-xs",
                        isFromUser ? "text-green-200" : "text-gray-500"
                      )}
                      data-testid={`message-time-${msg.id}`}
                    >
                      {new Date(msg.createdAt!).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  {isFromUser && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.uid ? `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32` : undefined} />
                      <AvatarFallback>{user?.name?.[0] || user?.email[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t border-gray-200 p-4" data-testid="chat-input-section">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              data-testid="chat-input"
            />
            <Button onClick={handleSendMessage} disabled={!message.trim()} data-testid="send-message">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
