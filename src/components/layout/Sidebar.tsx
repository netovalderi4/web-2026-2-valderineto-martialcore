import React from 'react';
import type { UserRole } from '../../types/martial';
import { useMartialTheme } from '../../context/MartialThemeContext';
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
  ChevronRight,
  LogOut
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
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeView,
  onSelectView,
  isOpenMobile = false,
  onCloseMobile,
  onLogout
}) => {
  const { accentColor, isMonochrome } = useMartialTheme();

  const getNavItems = () => {
    switch (currentRole) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard Geral', icon: LayoutDashboard },
          { id: 'students', label: 'Alunos & Matrículas', icon: Users, badge: '6' },
          { id: 'schedules', label: 'Tatames & Horários', icon: CalendarDays },
          { id: 'finance', label: 'Planos & Financeiro', icon: DollarSign },
          { id: 'modalities', label: 'Regras de Graduação', icon: Layers }
        ];
      case 'instructor':
        return [
          { id: 'attendance', label: 'Tatame Digital', icon: ClipboardCheck, badge: 'Hoje' },
          { id: 'evaluations', label: 'Avaliações Técnicas', icon: FileCheck2 },
          { id: 'eligible', label: 'Aptos para Exame', icon: Award, badge: '3' }
        ];
      case 'student':
        return [
          { id: 'progress', label: 'Meu Tatame', icon: Trophy },
          { id: 'schedules', label: 'Grade de Horários', icon: CalendarDays },
          { id: 'invoices', label: 'Minhas Faturas', icon: DollarSign }
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
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-[64px] left-0 h-[calc(100vh-64px)] bg-white/95 dark:bg-zinc-950/95 border-r border-zinc-200/70 dark:border-zinc-800/70 w-64 p-4 z-40 flex flex-col justify-between transition-all duration-200 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          <div className="px-3 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
              Navegação
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer group ${
                    isActive
                      ? isMonochrome
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs font-bold'
                        : 'text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80'
                  }`}
                  style={{
                    backgroundColor: isActive && !isMonochrome ? accentColor : undefined,
                    boxShadow: isActive && !isMonochrome ? `0 2px 10px -2px ${accentColor}50` : undefined
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 transition shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-black/20 text-white font-bold'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-3.5 h-3.5 opacity-40 group-hover:opacity-100 ${
                        isActive ? 'text-white opacity-80' : ''
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="space-y-3">
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2 px-3 rounded-xl bg-zinc-100 hover:bg-red-500/10 dark:bg-zinc-900/60 dark:hover:bg-red-500/15 border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair / Voltar ao Site</span>
            </button>
          )}

          <div className="pt-3 border-t border-zinc-200/70 dark:border-zinc-900 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1 px-2 font-mono">
            <div className="flex items-center justify-between">
              <span>PAM0462 UFERSA</span>
              <span className="font-bold text-amber-500">2026.2</span>
            </div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">Valderi Alves Neto</p>
            <div className="flex items-center gap-1.5 pt-1 text-[10px] text-emerald-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>AWS Amplify Online</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
