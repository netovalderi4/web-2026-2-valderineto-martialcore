import React, { useState } from 'react';
import type { ModalityId, UserRole } from '../../types/martial';
import { MODALITIES_DATA } from '../../mock/martialData';
import { MartialIcon } from '../martial/MartialIcon';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MartialCoreLogo } from '../ui/MartialCoreLogo';
import { NotificationPopover, type NotificationItem } from './NotificationPopover';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  UserCircle2,
  Menu,
  LogOut,
  ChevronDown,
  Shield,
  Award,
  User,
  Users,
  Check,
  Cloud,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  selectedModality: ModalityId | 'all';
  onSelectModality: (modality: ModalityId | 'all') => void;
  onOpenMobileMenu?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  selectedModality,
  onSelectModality,
  onOpenMobileMenu,
  onLogout
}) => {
  const auth = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: '4 Atletas Aptos para Exame',
      description: 'Lucas Mendonça atingiu 40 presenças e cumpriu carência em BJJ.',
      timestamp: 'Há 15 min',
      type: 'graduation',
      modalityId: 'bjj',
      read: false
    },
    {
      id: 'n2',
      title: 'Nova Reserva de Aula Experimental',
      description: 'João Victor agendou aula de iniciante em Muay Thai (18h).',
      timestamp: 'Há 1 hora',
      type: 'booking',
      modalityId: 'muay_thai',
      read: false
    },
    {
      id: 'n3',
      title: 'Fatura a Vencer no Tatame',
      description: 'Mensalidade de Pedro Silva vence em 2 dias (R$ 180,00).',
      timestamp: 'Hoje às 09:30',
      type: 'finance',
      read: false
    }
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentModality = MODALITIES_DATA.find(m => m.id === selectedModality);

  const roleNames: Record<UserRole, { title: string; subtitle: string; badgeColor: string }> = {
    admin: {
      title: 'Valderi Gestor',
      subtitle: 'Administrador',
      badgeColor: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
    },
    instructor: {
      title: 'Mestre Rodrigo',
      subtitle: 'Corpo Técnico',
      badgeColor: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
    },
    student: {
      title: 'Lucas Mendonça',
      subtitle: 'Atleta Ativo',
      badgeColor: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
    },
    visitor: {
      title: 'Visitante',
      subtitle: 'Experimental',
      badgeColor: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
    }
  };

  const displayUser = roleNames[currentRole];
  const authenticatedName = auth?.user?.name || displayUser.title;
  const authenticatedEmail = auth?.user?.email;

  const rolesList: Array<{
    role: UserRole;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
  }> = [
    {
      role: 'admin',
      label: 'Administrador / Gestor',
      sublabel: 'Visão Completa do CT',
      icon: <Shield className="w-4 h-4 text-zinc-500" />
    },
    {
      role: 'instructor',
      label: 'Mestre Rodrigo Silva',
      sublabel: 'Corpo Técnico (Tatame)',
      icon: <Award className="w-4 h-4 text-blue-500" />
    },
    {
      role: 'student',
      label: 'Lucas Mendonça',
      sublabel: 'Atleta Ativo (Progresso)',
      icon: <User className="w-4 h-4 text-emerald-500" />
    },
    {
      role: 'visitor',
      label: 'Visitante',
      sublabel: 'Agendamento Experimental',
      icon: <Users className="w-4 h-4 text-purple-500" />
    }
  ];

  return (
    <>
      <header
        className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-b border-zinc-200/70 dark:border-zinc-800/70 sticky top-0 z-40 px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300"
        style={{
          borderTopColor: currentModality ? currentModality.accentColor : undefined,
          borderTopWidth: currentModality ? '2px' : '0px'
        }}
      >
      {/* Esquerda: Menu Mobile e Logo do CT */}
      <div className="flex items-center gap-3 shrink-0">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onSelectModality('all')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
          title="Ver visão unificada do centro de treinamento (Preto e Branco)"
        >
          <MartialCoreLogo
            size="sm"
            accentColor={currentModality?.accentColor}
            isMonochrome={selectedModality === 'all'}
          />
        </button>
      </div>

      {/* Centro: Barra de Filtro de Modalidades */}
      <div className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-2xl px-2">
        <button
          type="button"
          onClick={() => onSelectModality('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            selectedModality === 'all'
              ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }`}
        >
          <span>Todas</span>
        </button>

        {MODALITIES_DATA.map(modality => {
          const isSelected = selectedModality === modality.id;
          return (
            <button
              key={modality.id}
              type="button"
              onClick={() => onSelectModality(modality.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                isSelected
                  ? 'border-transparent text-white shadow-xs'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
              style={{
                backgroundColor: isSelected ? modality.accentColor : undefined
              }}
            >
              <MartialIcon modality={modality.id} className="w-3.5 h-3.5 shrink-0" />
              <span>{modality.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Direita: Alternador de Tema, Notificações e Perfil com Simulador RBAC */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <ThemeToggle />

        {/* Notificações Interativas */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(prev => !prev)}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer relative"
            title={`${unreadCount} Notificações`}
            aria-label="Abrir notificações do tatame"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span
                className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-zinc-950 animate-pulse ${
                  selectedModality === 'all' ? 'bg-amber-500' : ''
                }`}
                style={{
                  backgroundColor: selectedModality !== 'all' && currentModality ? currentModality.accentColor : undefined
                }}
              />
            )}
          </button>

          {/* Popover Flutuante de Notificações */}
          <NotificationPopover
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearNotification={handleClearNotification}
          />
        </div>

        {/* Perfil do Usuário com Simulador RBAC (Role Switcher) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(prev => !prev)}
            className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800 hover:opacity-85 transition cursor-pointer text-left"
            title="Clique para alternar o perfil ativo (Simulador RBAC)"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
              <UserCircle2 className="w-6 h-6 text-zinc-500 dark:text-zinc-300" />
            </div>
            <div className="hidden xl:block text-left">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-zinc-900 dark:text-white leading-tight truncate max-w-[130px]">
                  {authenticatedName}
                </p>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </div>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded border inline-block mt-0.5 ${displayUser.badgeColor}`}
              >
                {displayUser.subtitle}
              </span>
            </div>
          </button>

          {/* Backdrop para fechar ao clicar fora */}
          {isProfileMenuOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsProfileMenuOpen(false)}
            />
          )}

          {/* Popover do Perfil & Simulador RBAC */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-3 z-50 animate-fadeIn space-y-3">
              {/* Header do Usuário */}
              <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                    {authenticatedName}
                  </span>
                  {auth?.user?.isCognito ? (
                    <span className="text-[9px] font-mono bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                      <Cloud className="w-2.5 h-2.5" />
                      Cognito
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded font-bold">
                      Demo RBAC
                    </span>
                  )}
                </div>
                {authenticatedEmail && (
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5 font-mono">
                    {authenticatedEmail}
                  </p>
                )}
              </div>

              {/* Banner de Avaliação Acadêmica */}
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl text-[11px] text-zinc-700 dark:text-zinc-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                  <span>Ambiente Acadêmico (PAM0462)</span>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  Massa de dados demonstrativa até a integração com banco nas Aulas 10/11. Utilize este seletor para inspecionar e validar as 4 interfaces RBAC em tempo real.
                </p>
              </div>

              {/* Simulador de Visão de Papel (Role Switcher) */}
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block px-1 mb-1.5">
                  Simular Visão de Perfil (RBAC):
                </span>
                <div className="space-y-1">
                  {rolesList.map(item => {
                    const isActive = currentRole === item.role;
                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => {
                          auth?.switchRole(item.role);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full p-2 rounded-xl flex items-center justify-between text-left text-xs transition cursor-pointer ${
                          isActive
                            ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {item.icon}
                          <div>
                            <p className="leading-tight text-xs">{item.label}</p>
                            <span className="text-[10px] opacity-70 block">
                              {item.sublabel}
                            </span>
                          </div>
                        </div>
                        {isActive && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botão Sair / Logout */}
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    if (onLogout) {
                      onLogout();
                    } else if (auth) {
                      auth.logout();
                    }
                  }}
                  className="w-full p-2 rounded-xl text-red-600 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/15 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair do Cockpit</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Barra de Modalidades Dedicada para Mobile (Horizontal Scroll Chips) */}
    <nav
      aria-label="Filtro de modalidades mobile"
      className="md:hidden sticky top-16 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200/70 dark:border-zinc-800/70 px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none transition-colors duration-300"
    >
      <button
        type="button"
        onClick={() => onSelectModality('all')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition cursor-pointer ${
          selectedModality === 'all'
            ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
        }`}
      >
        <span>Todas</span>
      </button>

      {MODALITIES_DATA.map(modality => {
        const isSelected = selectedModality === modality.id;
        return (
          <button
            key={modality.id}
            type="button"
            onClick={() => onSelectModality(modality.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition cursor-pointer border ${
              isSelected
                ? 'border-transparent text-white shadow-xs'
                : 'border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
            style={{
              backgroundColor: isSelected ? modality.accentColor : undefined
            }}
          >
            <MartialIcon modality={modality.id} className="w-3.5 h-3.5 shrink-0" />
            <span>{modality.shortName}</span>
          </button>
        );
      })}
    </nav>
  </>
  );
};
