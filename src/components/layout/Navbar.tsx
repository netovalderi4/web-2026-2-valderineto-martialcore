import React from 'react';
import type { ModalityId, UserRole } from '../../types/martial';
import { MODALITIES_DATA } from '../../mock/martialData';
import { MartialIcon } from '../martial/MartialIcon';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Bell, UserCircle2, Menu, LogOut } from 'lucide-react';

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

  const user = roleNames[currentRole];

  return (
    <header className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-b border-zinc-200/70 dark:border-zinc-800/70 sticky top-0 z-40 px-4 sm:px-6 h-16 flex items-center justify-between gap-4 transition-colors duration-200">
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
          title="Ver visão unificada do centro de treinamento"
        >
          <span className="p-1.5 bg-amber-500 text-black rounded-xl font-black text-sm leading-none group-hover:scale-105 transition shadow-xs">
            MC
          </span>
          <div className="hidden sm:block">
            <span className="text-base font-black tracking-wider text-zinc-900 dark:text-white">
              MARTIAL<span className="text-amber-500">CORE</span>
            </span>
            <span className="text-[10px] block text-zinc-500 dark:text-zinc-400 -mt-1 font-mono uppercase tracking-wider">
              Centro de Lutas
            </span>
          </div>
        </button>
      </div>

      {/* Centro: Seletor Global de Modalidade Ativa (Filtro por Metadados com Cores Dinâmicas) */}
      <div className="flex items-center gap-1.5 bg-zinc-100/80 dark:bg-zinc-900/70 p-1.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 max-w-full overflow-x-auto no-scrollbar scroll-smooth">
        {/* Botão "Todas" */}
        <button
          type="button"
          onClick={() => onSelectModality('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
            selectedModality === 'all'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
          }`}
        >
          <MartialIcon modalityId="all" size={14} />
          <span>Todas</span>
        </button>

        {/* Lista com nomes completos e cores temáticas vibrantes ao selecionar */}
        {MODALITIES_DATA.map(m => {
          const isSelected = selectedModality === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectModality(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isSelected
                  ? 'text-white font-bold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
              }`}
              style={{
                backgroundColor: isSelected ? m.accentColor : 'transparent',
                boxShadow: isSelected ? `0 2px 10px -1px ${m.accentColor}50` : undefined
              }}
              title={m.name}
            >
              <MartialIcon
                modalityId={m.id}
                size={14}
                className={isSelected ? 'text-white' : 'opacity-70'}
              />
              <span>{m.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Direita: Alternador de Tema, Notificações e Perfil */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <ThemeToggle />

        {/* Notificações */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
            title="3 Alunos aptos para graduação"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
          </button>
        </div>

        {/* Perfil do Usuário */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
            <UserCircle2 className="w-6 h-6 text-zinc-500 dark:text-zinc-300" />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
              {user.title}
            </p>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded border inline-block mt-0.5 ${user.badgeColor}`}
            >
              {user.subtitle}
            </span>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-2 rounded-xl bg-zinc-100 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 dark:bg-zinc-900 dark:hover:bg-red-500/15 dark:text-zinc-400 dark:hover:text-red-400 transition cursor-pointer"
              title="Sair / Voltar para a Tela Inicial do Site"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
