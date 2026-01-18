/**
 * WebSocket service for real-time notifications
 */

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

type EventCallback = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000;
  private listeners: Map<string, EventCallback[]> = new Map();

  /**
   * Connect to WebSocket server
   */
  connect(token: string): void {
    const wsUrl = import.meta.env.VITE_WS_URL;
    
    // Skip WebSocket connection if URL is not configured
    if (!wsUrl) {
      console.log('ℹ️ WebSocket disabled (VITE_WS_URL not configured)');
      return;
    }
    
    try {
      this.ws = new WebSocket(`${wsUrl}/?token=${token}`);
      
      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this.reconnectAttempts = 0;
        this.emit('connected', {});
      };
      
      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log('📨 WebSocket message:', data);
          
          // Emit event based on type
          if (data.type) {
            this.emit(data.type, data);
          }
          
          // Generic message event
          this.emit('message', data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      this.ws.onerror = (error: Event) => {
        console.error('❌ WebSocket error:', error);
        this.emit('error', error);
      };
      
      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.emit('disconnected', {});
        
        // Attempt reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`🔄 Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
          
          setTimeout(() => {
            this.connect(token);
          }, this.reconnectDelay * this.reconnectAttempts);
        } else {
          console.log('❌ Max reconnect attempts reached');
        }
      };
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
    this.reconnectAttempts = 0;
  }

  /**
   * Send message to server
   */
  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  /**
   * Subscribe to events
   */
  on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback: EventCallback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const wsService = new WebSocketService();

/**
 * Composable for using WebSocket in components
 */
export function useWebSocket() {
  const connect = (): void => {
    const token = localStorage.getItem('access_token');
    if (token) {
      wsService.connect(token);
    }
  };

  const disconnect = (): void => {
    wsService.disconnect();
  };

  const on = (event: string, callback: EventCallback): (() => void) => {
    return wsService.on(event, callback);
  };

  const send = (data: any): void => {
    wsService.send(data);
  };

  const isConnected = (): boolean => {
    return wsService.isConnected();
  };

  return {
    connect,
    disconnect,
    on,
    send,
    isConnected
  };
}
