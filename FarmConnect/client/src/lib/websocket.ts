import { ChatMessage } from "@shared/schema";

class WebSocketManager {
  private socket: WebSocket | null = null;
  private userId: string | null = null;
  private messageHandlers: Set<(message: ChatMessage) => void> = new Set();
  private reconnectInterval: number = 5000;
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;

  connect(userId: string) {
    this.userId = userId;
    this.createConnection();
  }

  private createConnection() {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?userId=${this.userId}`;
    
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chat_message') {
          this.messageHandlers.forEach(handler => handler(data.data));
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.createConnection();
      }, this.reconnectInterval);
    }
  }

  sendMessage(receiverId: string, message: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'chat_message',
        senderId: this.userId,
        receiverId,
        message
      }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  onMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
    this.userId = null;
    this.messageHandlers.clear();
    this.reconnectAttempts = 0;
  }
}

export const wsManager = new WebSocketManager();
