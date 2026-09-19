import React, { useState } from 'react';
import type { UserRole } from '../../types/martial';
import { MartialCoreLogo } from '../ui/MartialCoreLogo';
import {
  Shield,
  Award,
  User,
  Users,
  X,
  LogIn,
  ArrowRight,
  Lock,
  Mail
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin
}) => {
  const [tab, setTab] = useState<'quick' | 'credentials'>('quick');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const quickRoles: Array<{
    role: UserRole;
    name: string;
    roleTitle: string;
    description: string;
    icon: React.ReactNode;
    accentBg: string;
    borderAccent: string;
    color: string;
  }> = [
    {
      role: 'admin',
      name: 'Valderi Gestor',
      roleTitle: 'Administrador / Gestor do CT',
      description: 'Acesso total: dashboard financeiro, alocação de tatames e cadastro de atletas.',
      icon: <Shield className="w-5 h-5" />,
      accentBg: 'bg-zinc-100 dark:bg-zinc-800/80',
      borderAccent: 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-white',
      color: '#71717a'
    },
    {
      role: 'instructor',
      name: 'Mestre Rodrigo Silva',
      roleTitle: 'Mestre / Corpo Técnico',
      description: 'Tatame digital, chamada de presença (Gi/No-Gi) e avaliações técnicas.',
      icon: <Award className="w-5 h-5" />,
      accentBg: 'bg-blue-500/10 dark:bg-blue-500/15',
      borderAccent: 'border-blue-500/30 hover:border-blue-500',
      color: '#3b82f6'
    },
    {
      role: 'student',
      name: 'Lucas Mendonça',
      roleTitle: 'Atleta / Aluno Ativo',
      description: 'Meu tatame, termômetro de faixa, carência e faturas em aberto.',
      icon: <User className="w-5 h-5" />,
      accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      borderAccent: 'border-emerald-500/30 hover:border-emerald-500',
      color: '#10b981'
    },
    {
      role: 'visitor',
      name: 'Visitante / Candidato',
      roleTitle: 'Visitante (Experimental)',
      description: 'Grade de aulas abertas e agendamento gratuito de aula experimental.',
      icon: <Users className="w-5 h-5" />,
      accentBg: 'bg-purple-500/10 dark:bg-purple-500/15',
      borderAccent: 'border-purple-500/30 hover:border-purple-500',
      color: '#8b5cf6'
    }
  ];

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Topo Modal */}
        <div className="flex items-center gap-3">
          <MartialCoreLogo size="md" isMonochrome={true} />
        </div>

        {/* Abas: Acesso Rápido vs Credenciais */}
        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => setTab('quick')}
            className={`flex-1 py-2 rounded-xl font-bold transition cursor-pointer ${
              tab === 'quick'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Acesso Rápido por Perfil (RBAC)
          </button>
          <button
            type="button"
            onClick={() => setTab('credentials')}
            className={`flex-1 py-2 rounded-xl font-bold transition cursor-pointer ${
              tab === 'credentials'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            E-mail e Senha
          </button>
        </div>

        {/* Aba 1: Acesso Rápido por Perfil */}
        {tab === 'quick' ? (
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
              Selecione com 1 clique para testar:
            </span>
            {quickRoles.map(item => (
              <button
                key={item.role}
                type="button"
                onClick={() => onLogin(item.role)}
                className={`w-full p-3.5 rounded-2xl border ${item.borderAccent} bg-zinc-50/60 dark:bg-zinc-950/60 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all flex items-center justify-between gap-3 text-left group cursor-pointer shadow-xs`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105`}
                    style={{
                      backgroundColor: `${item.color}15`,
                      borderColor: `${item.color}35`,
                      color: item.color
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                        {item.role.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {item.roleTitle}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        ) : (
          /* Aba 2: Formulário Tradicional */
          <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@martialcore.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar no Cockpit</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

