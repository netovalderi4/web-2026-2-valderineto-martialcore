import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useAuth } from '../context/AuthContext';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'sensei' | 'system';
  text: string;
  timestamp: string;
  isError?: boolean;
}

interface WebSocketResponse {
  type?: string;
  sender?: string;
  message?: string;
  timestamp?: string;
  error?: string;
}

const PRIMARY_WS_URL =
  import.meta.env.VITE_WEBSOCKET_API_URL ||
  'wss://api.valderi.mestre.web.ufersa.dev.br/prod/';

const DIRECT_WS_URL =
  import.meta.env.VITE_WEBSOCKET_API_DIRECT_URL ||
  'wss://wd7wv3vcpe.execute-api.us-east-1.amazonaws.com/prod/';

export function useSenseiWebSocket(selectedModalityName?: string) {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'sensei',
      text: 'Oss! Sou o Sensei Kuro, seu mentor virtual no MartialCore. Como posso auxiliá-lo no tatame ou na gestão do centro hoje?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [activeEndpoint, setActiveEndpoint] = useState<string>(PRIMARY_WS_URL);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const usingDirectFallback = useRef<boolean>(false);

  // Obtém o token de autenticação (Cognito JWT preferencialmente)
  const getAuthToken = async (): Promise<string> => {
    try {
      const session = await fetchAuthSession();
      const token =
        session.tokens?.idToken?.toString() ||
        session.tokens?.accessToken?.toString();
      if (token) return token;
    } catch {
      // Sessão Cognito não ativa ou fallback
    }

    // Fallbacks: Google ID token ou token de sessão local
    const googleToken = sessionStorage.getItem('google_id_token');
    if (googleToken) return googleToken;

    return `martialcore-session-${user?.id || 'guest'}`;
  };

  const connect = useCallback(async () => {
    if (!isAuthenticated) return;
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const token = await getAuthToken();
      const targetBase = usingDirectFallback.current ? DIRECT_WS_URL : PRIMARY_WS_URL;
      const cleanUrl = targetBase.endsWith('/') ? targetBase.slice(0, -1) : targetBase;
      const fullUrl = `${cleanUrl}/?auth=${encodeURIComponent(token)}`;

      setActiveEndpoint(cleanUrl);

      const ws = new WebSocket(fullUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
      };

      ws.onmessage = (event) => {
        setIsThinking(false);
        try {
          const data: WebSocketResponse = JSON.parse(event.data);
          const replyText = data.message || (typeof event.data === 'string' ? event.data : '');

          if (replyText) {
            setMessages((prev) => [
              ...prev,
              {
                id: `sensei-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                sender: 'sensei',
                text: replyText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }
        } catch {
          // Mensagem de texto puro
          setMessages((prev) => [
            ...prev,
            {
              id: `sensei-${Date.now()}`,
              sender: 'sensei',
              text: String(event.data),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      };

      ws.onerror = (evt) => {
        console.warn('Alerta na conexão WebSocket:', evt);
        // Se falhou no DNS customizado primário (ex: propagação pendente), tenta o endpoint direto
        if (!usingDirectFallback.current) {
          usingDirectFallback.current = true;
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        setIsThinking(false);
      };
    } catch (err) {
      console.error('Falha ao iniciar conexão WebSocket:', err);
      setIsConnected(false);
      setIsConnecting(false);
      setError('Não foi possível conectar ao servidor WebSocket do tatame.');
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsConnected(false);
    }

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, connect]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);

      // Envia pelo WebSocket se conectado
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const payload = {
          action: '$default',
          message: text.trim(),
          modality: selectedModalityName || 'Geral',
          userName: user?.name || 'Guerreiro'
        };
        socketRef.current.send(JSON.stringify(payload));
      } else {
        // Se desconectado, tenta reconectar e avisa
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: 'system',
            text: 'Conexão WebSocket oscilou. Tentando reconectar ao Sensei Kuro...',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isError: true
          }
        ]);
        connect();
      }
    },
    [connect, selectedModalityName, user?.name]
  );

  const clearMessages = () => {
    setMessages([
      {
        id: 'welcome-msg',
        sender: 'sensei',
        text: 'Tatame limpo! Como posso auxiliá-lo agora?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return {
    messages,
    isConnected,
    isConnecting,
    isThinking,
    activeEndpoint,
    error,
    sendMessage,
    clearMessages,
    reconnect: connect
  };
}

