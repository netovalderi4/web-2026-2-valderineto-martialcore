import React from 'react';
import type { ModalityId, UserRole } from '../../types/martial';
import { MODALITIES_DATA } from '../../mock/martialData';
import { Bell, Filter, UserCircle2, Menu } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  selectedModality: ModalityId | 'all';
  onSelectModality: (modality: ModalityId | 'all') => void;
  onOpenMobileMenu?: () => void;
  onGoToLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  selectedModality,
  onSelectModality,
  onOpenMobileMenu,
  onGoToLanding
}) => {
  const roleNames: Record<UserRole, { title: string; subtitle: string; badgeColor: string }> = {
    admin: {
      title: 'Valderi Gestor',
      subtitle: 'Administrador Geral',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    instructor: {
      title: 'Mestre Rodrigo',
      subtitle: 'Corpo Técnico BJJ/Judô',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    student: {
      title: 'Lucas Mendonça',
      subtitle: 'Atleta Ativo (BJJ + Thai)',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    visitor: {
      title: 'Visitante Online',
      subtitle: 'Explorando Modalidades',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    }
  };

  const user = roleNames[currentRole];

  return (
    <header className="bg-zinc-950/90 backdrop-blur border-b border-zinc-800/80 sticky top-[37px] z-40 px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
      {/* Esquerda: Logo e Toggle Mobile */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <button
          type="button"
          onClick={onGoToLanding}
          className="flex items-center gap-2 text-left group cursor-pointer"
        >
          <span className="p-1.5 bg-amber-500 text-black rounded-lg font-black text-base leading-none group-hover:scale-105 transition">
            MC
          </span>
          <div className="hidden sm:block">
            <span className="text-lg font-black tracking-wider text-amber-500">
              MARTIAL<span className="text-white">CORE</span>
            </span>
            <span className="text-[10px] block text-zinc-400 -mt-1 font-mono uppercase">
              Centro de Lutas
            </span>
          </div>
        </button>
      </div>

      {/* Centro: Seletor Global de Modalidade Ativa (Filtro por Metadados) */}
      <div className="hidden md:flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 max-w-xl overflow-x-auto">
        <div className="flex items-center gap-1 px-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          <Filter className="w-3 h-3 text-amber-400" />
          <span>Filtro:</span>
        </div>

        <button
          type="button"
          onClick={() => onSelectModality('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
            selectedModality === 'all'
              ? 'bg-amber-500 text-black shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          Todas
        </button>

        {MODALITIES_DATA.map(m => (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelectModality(m.id)}
            className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1 cursor-pointer ${
              selectedModality === m.id
                ? 'bg-zinc-800 text-amber-400 font-bold border border-amber-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <span>{m.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Direita: Notificações e Perfil */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white relative transition cursor-pointer"
            title="3 Alunos aptos para graduação"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-zinc-950 animate-pulse" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 font-bold text-sm overflow-hidden">
            <UserCircle2 className="w-6 h-6 text-zinc-300" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-white leading-tight">{user.title}</p>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded border inline-block mt-0.5 ${user.badgeColor}`}
            >
              {user.subtitle}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

