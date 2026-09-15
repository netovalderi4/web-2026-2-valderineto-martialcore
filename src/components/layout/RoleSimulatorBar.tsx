import React from 'react';
import type { UserRole } from '../../types/martial';
import { Crown, GraduationCap, User, Compass, Globe, Sparkles } from 'lucide-react';

interface RoleSimulatorBarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isLandingActive: boolean;
  onToggleLanding: (active: boolean) => void;
}

export const RoleSimulatorBar: React.FC<RoleSimulatorBarProps> = ({
  currentRole,
  onRoleChange,
  isLandingActive,
  onToggleLanding
}) => {
  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'admin',
      label: 'Gestor / Admin',
      icon: <Crown className="w-3.5 h-3.5 text-amber-400" />,
      desc: 'Acesso total a turmas, financeiro e tatames'
    },
    {
      role: 'instructor',
      label: 'Mestre / Instrutor',
      icon: <GraduationCap className="w-3.5 h-3.5 text-blue-400" />,
      desc: 'Chamada, avaliações e exames de graduação'
    },
    {
      role: 'student',
      label: 'Atleta / Aluno',
      icon: <User className="w-3.5 h-3.5 text-emerald-400" />,
      desc: 'Meu Tatame, faixas, carência e mensalidades'
    },
    {
      role: 'visitor',
      label: 'Visitante',
      icon: <Compass className="w-3.5 h-3.5 text-purple-400" />,
      desc: 'Horários e agendamento de aula experimental'
    }
  ];

  return (
    <div className="bg-zinc-900 border-b border-zinc-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 uppercase tracking-wider text-[10px]">
          <Sparkles className="w-3 h-3 text-amber-400" /> Simulador de RBAC (Painel Avaliativo)
        </span>
        <span className="hidden sm:inline text-zinc-400 text-[11px]">
          Alterne os papéis para navegar nas telas da especificação:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {roles.map(r => (
          <button
            key={r.role}
            type="button"
            onClick={() => {
              onToggleLanding(false);
              onRoleChange(r.role);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium text-xs cursor-pointer ${
              !isLandingActive && currentRole === r.role
                ? 'bg-amber-500 text-black font-bold shadow-sm'
                : 'bg-zinc-950/70 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
            title={r.desc}
          >
            {r.icon}
            <span>{r.label}</span>
          </button>
        ))}

        <div className="h-4 w-px bg-zinc-700 mx-1 hidden sm:block" />

        <button
          type="button"
          onClick={() => onToggleLanding(true)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition font-medium text-xs cursor-pointer ${
            isLandingActive
              ? 'bg-zinc-100 text-zinc-950 font-bold'
              : 'bg-zinc-950/70 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-zinc-400" />
          <span>Página Institucional</span>
        </button>
      </div>
    </div>
  );
};

