import React from 'react';
import type { UserRole } from '../../types/martial';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  DollarSign,
  Award,
  ClipboardCheck,
  FileCheck2,
  Trophy,
  Compass,
  BookmarkCheck,
  Layers,
  ChevronRight
} from 'lucide-react';

export type AdminView = 'dashboard' | 'students' | 'schedules' | 'finance' | 'modalities';
export type InstructorView = 'attendance' | 'evaluations' | 'eligible';
export type StudentView = 'progress' | 'schedules' | 'invoices';
export type VisitorView = 'trial' | 'explore';

interface SidebarProps {
  currentRole: UserRole;
  activeView: string;
  onSelectView: (view: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeView,
  onSelectView,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const getNavItems = () => {
    switch (currentRole) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard Geral', icon: LayoutDashboard, badge: 'KPIs' },
          { id: 'students', label: 'Alunos & Matrículas', icon: Users, badge: '6 Ativos' },
          { id: 'schedules', label: 'Tatames & Horários', icon: CalendarDays },
          { id: 'finance', label: 'Planos & Financeiro', icon: DollarSign, badge: 'Fluxo' },
          { id: 'modalities', label: 'Regras de Graduação', icon: Layers, badge: 'Metadados' }
        ];
      case 'instructor':
        return [
          { id: 'attendance', label: 'Tatame Digital (Chamada)', icon: ClipboardCheck, badge: 'Hoje' },
          { id: 'evaluations', label: 'Avaliações Técnicas', icon: FileCheck2 },
          { id: 'eligible', label: 'Aptos para Exame', icon: Award, badge: '3 Alunos' }
        ];
      case 'student':
        return [
          { id: 'progress', label: 'Meu Tatame & Faixas', icon: Trophy, badge: 'Ativo' },
          { id: 'schedules', label: 'Minhas Aulas & Check-in', icon: CalendarDays },
          { id: 'invoices', label: 'Minhas Mensalidades', icon: DollarSign }
        ];
      case 'visitor':
      default:
        return [
          { id: 'trial', label: 'Agendar Experimental', icon: BookmarkCheck, badge: 'Grátis' },
          { id: 'explore', label: 'Conhecer Modalidades', icon: Compass }
        ];
    }
  };

  const navItems = getNavItems();

  const handleItemClick = (id: string) => {
    onSelectView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Overlay Mobile */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-[101px] left-0 h-[calc(100vh-101px)] bg-zinc-950/95 border-r border-zinc-800/80 w-64 p-4 z-40 flex flex-col justify-between transition-transform duration-200 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <div className="px-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
              Módulos do Sistema
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer group ${
                    isActive
                      ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/10'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition ${
                        isActive ? 'text-black' : 'text-zinc-400 group-hover:text-amber-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-black/20 text-black font-extrabold'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-3.5 h-3.5 opacity-40 group-hover:opacity-100 ${
                        isActive ? 'text-black' : ''
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar: Info da Disciplina & AWS */}
        <div className="pt-4 border-t border-zinc-900 text-[11px] text-zinc-400 space-y-1 px-2 font-mono">
          <div className="flex items-center justify-between text-zinc-400">
            <span>PAM0462 UFERSA</span>
            <span className="text-amber-500 font-bold">2026.2</span>
          </div>
          <p className="text-[10px] text-zinc-400 truncate">Aluno: Valderi Neto</p>
          <div className="flex items-center gap-1.5 pt-1 text-[10px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Amplify Online (SSL)</span>
          </div>
        </div>
      </aside>
    </>
  );
};

