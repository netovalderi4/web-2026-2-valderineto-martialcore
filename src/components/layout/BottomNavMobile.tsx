import React from 'react';
import type { UserRole } from '../../types/martial';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  DollarSign,
  ClipboardCheck,
  FileCheck2,
  Award,
  Trophy,
  BookmarkCheck,
  Compass
} from 'lucide-react';

interface BottomNavMobileProps {
  currentRole: UserRole;
  activeView: string;
  onSelectView: (view: string) => void;
}

export const BottomNavMobile: React.FC<BottomNavMobileProps> = ({
  currentRole,
  activeView,
  onSelectView
}) => {
  const getNavItems = () => {
    switch (currentRole) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
          { id: 'students', label: 'Atletas', icon: Users },
          { id: 'schedules', label: 'Tatames', icon: CalendarDays },
          { id: 'finance', label: 'Financeiro', icon: DollarSign }
        ];
      case 'instructor':
        return [
          { id: 'attendance', label: 'Chamada', icon: ClipboardCheck },
          { id: 'evaluations', label: 'Avaliar', icon: FileCheck2 },
          { id: 'eligible', label: 'Exames', icon: Award }
        ];
      case 'student':
        return [
          { id: 'progress', label: 'Meu Tatame', icon: Trophy },
          { id: 'schedules', label: 'Aulas', icon: CalendarDays },
          { id: 'invoices', label: 'Faturas', icon: DollarSign }
        ];
      case 'visitor':
      default:
        return [
          { id: 'trial', label: 'Agendar', icon: BookmarkCheck },
          { id: 'explore', label: 'Modalidades', icon: Compass }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur border-t border-zinc-200 dark:border-zinc-800 px-3 py-1.5 flex items-center justify-around shadow-lg">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeView === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectView(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer ${
              isActive
                ? 'text-amber-500 font-bold scale-105'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-amber-500/15' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

