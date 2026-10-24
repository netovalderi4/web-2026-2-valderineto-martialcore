import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  RefreshCw,
  Trash2,
  Wifi,
  WifiOff,
  ChevronDown,
  Bot,
  MessageSquare
} from 'lucide-react';
import { useSenseiWebSocket } from '../../hooks/useSenseiWebSocket';
import { useMartialTheme } from '../../context/MartialThemeContext';

export const SenseiKuroWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const { currentModality } = useMartialTheme();
  
  const {
    messages,
    isConnected,
    isConnecting,
    isThinking,
    activeEndpoint,
    sendMessage,
    clearMessages,
    reconnect
  } = useSenseiWebSocket(currentModality?.name);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isThinking) return;

    sendMessage(inputText);
    setInputText('');
  };

  const quickPrompts = [
    'Critérios de graduação e faixas no Jiu-Jitsu',
    'Golpes válidos e pontuação no Judô',
    'Qual a carência mínima entre cordéis na Capoeira?',
    'Como administrar turmas e atletas no MartialCore?'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Janela de Conversa Expansível */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[420px] max-w-[440px] h-[560px] max-h-[82vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Cabeçalho do Sensei Kuro */}
          <div className="p-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-base shadow-sm transition-colors duration-300"
                  style={{
                    backgroundColor: currentModality ? currentModality.accentColor : '#27272a',
                    color: '#ffffff'
                  }}
                >
                  <Bot className="w-5 h-5" />
                </div>
                {/* Indicador de Status WebSocket */}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-zinc-950 ${
                    isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                  title={isConnected ? 'WebSocket Ativo' : 'Conectando ao WebSocket...'}
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
                    Sensei Kuro
                  </h3>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                    IA Gemini
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                  {isConnected ? (
                    <>
                      <Wifi className="w-3 h-3 text-emerald-400" />
                      <span className="truncate max-w-[190px]" title={activeEndpoint}>
                        WebSocket Conectado
                      </span>
                    </>
                  ) : isConnecting ? (
                    <>
                      <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                      <span>Conectando...</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 text-red-400" />
                      <button
                        onClick={reconnect}
                        className="underline hover:text-white cursor-pointer"
                      >
                        Reconectar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Ações de Controle */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearMessages}
                title="Limpar histórico"
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimizar"
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-barra informativa de DNS e Rota para Avaliação do Professor */}
          <div className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between font-mono">
            <span className="truncate">DNS: api.valderi.mestre.web.ufersa.dev.br</span>
            <span className="shrink-0 text-amber-600 dark:text-amber-400 font-bold">Rota: $default</span>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-medium">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-medium rounded-br-xs'
                        : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-100 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Indicador de Digitação (Sensei Pensando) */}
            {isThinking && (
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-3.5 py-2 max-w-[70%] text-[11px] rounded-bl-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span>Sensei Kuro consultando a sabedoria do Gemini...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chips de Perguntas Rápidas (só aparecem se tiver poucas mensagens) */}
          {messages.length <= 2 && (
            <div className="p-2.5 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-1.5">
              {quickPrompts.slice(0, 2).map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="text-[11px] text-left px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition cursor-pointer"
                >
                  🥋 {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Barra de Entrada / Digitação */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pergunte ao Sensei Kuro sobre tatame, regras ou CT..."
              disabled={isThinking}
              className="flex-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              aria-label="Enviar pergunta"
              className="p-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-2xl hover:opacity-90 disabled:opacity-40 transition cursor-pointer shadow-sm shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Botão Flutuante Disparador (Floating Action Button) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 shadow-xl border border-zinc-700/30 transition-all duration-200 hover:scale-105 cursor-pointer"
      >
        <div className="relative">
          <Bot className="w-5 h-5" />
          <span
            className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-zinc-950 dark:border-white ${
              isConnected ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-extrabold text-xs leading-none">Sensei Kuro</span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-600 leading-tight">
            IA Marcial • WebSocket
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        ) : (
          <MessageSquare className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 transition-colors" />
        )}
      </button>
    </div>
  );
};

