import React, { useEffect, useRef } from 'react';
import type { ModalityId } from '../../types/martial';
import { useMartialTheme } from '../../context/MartialThemeContext';
import {
  Bell,
  Award,
  CalendarCheck,
  CreditCard,
  UserCheck,
  CheckCheck,
  Trash2,
  X
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'graduation' | 'booking' | 'finance' | 'attendance';
  modalityId?: ModalityId;
  read: boolean;
}

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClearNotification: (id: string) => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearNotification
}) => {
  const { accentColor, isMonochrome } = useMartialTheme();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora ou ao pressionar Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'graduation':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'booking':
        return <CalendarCheck className="w-4 h-4 text-blue-500" />;
      case 'finance':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'attendance':
        return <UserCheck className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-14 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn"
      style={{
        borderColor: !isMonochrome ? `${accentColor}30` : undefined
      }}
    >
      {/* Topo do Popover */}
      <div className="p-3.5 px-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-950/70">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center border"
            style={{
              backgroundColor: !isMonochrome ? `${accentColor}15` : '#27272a15',
              borderColor: !isMonochrome ? `${accentColor}30` : '#27272a30',
              color: !isMonochrome ? accentColor : '#a1a1aa'
            }}
          >
            <Bell className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">
              Notificações
            </h4>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
              {unreadCount > 0 ? `${unreadCount} nova(s) pendente(s)` : 'Tudo atualizado'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="px-2 py-1 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-1 cursor-pointer"
              title="Marcar todas como lidas"
            >
              <CheckCheck className="w-3 h-3" />
              <span>Ler todas</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            aria-label="Fechar notificações"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60 no-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
            Nenhuma notificação registrada no momento.
          </div>
        ) : (
          notifications.map(item => (
            <div
              key={item.id}
              className={`p-3.5 px-4 flex items-start justify-between gap-3 transition-colors ${
                item.read
                  ? 'bg-transparent opacity-75'
                  : 'bg-zinc-50/50 dark:bg-zinc-800/30'
              } hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                      {item.title}
                    </h5>
                    {!item.read && (
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: !isMonochrome ? accentColor : '#f59e0b' }}
                      />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                    {item.description}
                  </p>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-1.5 block">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onClearNotification(item.id)}
                className="p-1 rounded-md text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer shrink-0"
                title="Remover notificação"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Rodapé com Feedback */}
      <div className="p-2.5 px-4 bg-zinc-50/50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800/80 text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between font-mono">
        <span>MartialCore • Alertas de Tatame</span>
        <span className="text-zinc-400">Total: {notifications.length}</span>
      </div>
    </div>
  );
};

