import React from 'react';
import { MODALITIES_DATA } from '../mock/martialData';
import {
  ShieldCheck,
  Flame,
  Swords,
  Zap,
  Music,
  Dumbbell,
  ArrowRight,
  CheckCircle,
  Users,
  DollarSign,
  Cloud,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'bjj':
        return <ShieldCheck className="w-6 h-6" />;
      case 'muay_thai':
        return <Flame className="w-6 h-6" />;
      case 'karate':
        return <Swords className="w-6 h-6" />;
      case 'judo':
        return <Zap className="w-6 h-6" />;
      case 'capoeira':
        return <Music className="w-6 h-6" />;
      case 'boxing':
      default:
        return <Dumbbell className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Header Institucional */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur sticky top-[37px] z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500 text-black rounded-md font-black text-lg leading-none">
              MC
            </span>
            <span className="text-xl font-black text-amber-500 tracking-wider">
              MARTIAL<span className="text-white">CORE</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#modalidades" className="text-zinc-400 hover:text-white transition">
              Modalidades
            </a>
            <a href="#funcionalidades" className="text-zinc-400 hover:text-white transition">
              Núcleo Compartilhado
            </a>
            <a href="#faq" className="text-zinc-400 hover:text-white transition">
              FAQ
            </a>
            <a href="#arquitetura" className="text-zinc-400 hover:text-white transition">
              Arquitetura AWS
            </a>
          </nav>

          <button
            type="button"
            onClick={onEnterApp}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-lg text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <span>Acessar Sistema</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 px-6 text-center max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Gestão Especializada para Centros de Luta
        </span>

        <h1 className="text-4xl md:text-6xl font-black mt-6 leading-tight tracking-tight">
          Gestão inteligente para centros de treinamento{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
            multi-artes marciais
          </span>
          .
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
          Plataforma web modular que adapta regras, nomenclaturas, faixas, graus e critérios técnicos
          para cada modalidade do seu tatame.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={onEnterApp}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-7 py-3.5 rounded-xl transition shadow-xl shadow-amber-500/20 cursor-pointer text-base"
          >
            <span>Entrar no MartialCore</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href="#modalidades"
            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold px-6 py-3.5 rounded-xl transition text-base"
          >
            Ver Modalidades
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Modalidades Contempladas */}
      <section id="modalidades" className="py-20 bg-zinc-900/60 border-t border-zinc-800 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold tracking-tight">Modalidades Contempladas</h2>
            <p className="text-zinc-400 mt-3 text-sm">
              Cada arte marcial conta com seu esquema de graduação e critérios de avaliação isolados
              por metadados.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODALITIES_DATA.map(m => (
              <div
                key={m.id}
                className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-amber-500/40 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition">
                    {getIcon(m.id)}
                  </div>
                  <h3 className="text-lg font-bold text-white">{m.name}</h3>
                  <p className="text-xs text-amber-500 font-medium mt-1">{m.tagline}</p>
                  <ul className="text-sm text-zinc-400 mt-3 space-y-1.5 list-disc list-inside">
                    {m.specificRules.map((rule, idx) => (
                      <li key={idx} className="leading-snug text-xs">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>Carência: {m.defaultTimeRequirementMonths}m</span>
                  <span>Mín. Aulas: {m.minClassesForPromotion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recursos do Núcleo Compartilhado */}
      <section id="funcionalidades" className="py-20 border-t border-zinc-800 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold tracking-tight">Recursos do Núcleo Compartilhado</h2>
            <p className="text-zinc-400 mt-3 text-sm">
              Operações essenciais unificadas em uma única base de dados relacional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-amber-400 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg">Controle de Acesso (RBAC)</h3>
              <p className="text-sm text-zinc-400 mt-2">
                Permissões personalizadas para Administradores, Mestres/Instrutores, Atletas e
                Visitantes.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-amber-400 mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg">Presença e Horários</h3>
              <p className="text-sm text-zinc-400 mt-2">
                Alocação de tatames e registro de check-in com cálculo automático de carência para
                promoção.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-amber-400 mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg">Gestão Financeira</h3>
              <p className="text-sm text-zinc-400 mt-2">
                Planos individuais, pacotes multi-modalidades, histórico de pagamentos e adimplência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-zinc-900/40 border-t border-zinc-800 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-semibold">
              Dúvidas Frequentes
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-4">Perguntas Frequentes (FAQ)</h2>
            <p className="text-zinc-400 mt-2 text-sm">
              Respostas diretas sobre o funcionamento e estrutura do MartialCore.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl">
              <h3 className="font-bold text-white text-lg">O que é o MartialCore?</h3>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                O MartialCore é uma plataforma web modular voltada para a gestão integrada de centros
                de treinamento e academias multi-modalidades de artes marciais, como Jiu-Jitsu, Muay
                Thai, Karatê, Judô, Capoeira e Boxe.
              </p>
            </div>

            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl">
              <h3 className="font-bold text-white text-lg">
                Como a plataforma gerencia diferentes modalidades e graduações?
              </h3>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                O sistema adapta automaticamente regras, tempos de carência, faixas, graus, cordéis e
                critérios técnicos específicos para cada modalidade do tatame de forma isolada por
                metadados.
              </p>
            </div>

            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl">
              <h3 className="font-bold text-white text-lg">
                O MartialCore possui controle de frequência e financeiro?
              </h3>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                Sim, a plataforma unifica o controle de check-in em tatames, cálculo de presenças para
                exames de graduação, planos e gestão de adimplência em um único banco de dados
                relacional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Arquitetura Cloud AWS */}
      <section id="arquitetura" className="py-16 bg-zinc-900/60 border-t border-zinc-800 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-3">
            <Cloud className="w-3.5 h-3.5" /> Arquitetura de Nuvem
          </div>
          <h2 className="text-2xl font-bold">Infraestrutura em Nuvem (AWS)</h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-xl mx-auto">
            Hospedagem monolítica segura com EC2 (Subnet Pública), RDS PostgreSQL (Subnet Privada) e S3.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs font-mono">
            <span className="px-3 py-1.5 bg-zinc-800 rounded-md border border-zinc-700">
              Amazon EC2 (t3.micro)
            </span>
            <span className="px-3 py-1.5 bg-zinc-800 rounded-md border border-zinc-700">
              Amazon RDS PostgreSQL
            </span>
            <span className="px-3 py-1.5 bg-zinc-800 rounded-md border border-zinc-700">
              Amazon S3 Storage
            </span>
            <span className="px-3 py-1.5 bg-zinc-800 rounded-md border border-zinc-700 text-amber-400">
              AWS Amplify Frontend
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-zinc-500 border-t border-zinc-800">
        <p>&copy; 2026 MartialCore — Projeto PAM0462 (Programação Web - UFERSA - Campus Pau dos Ferros).</p>
      </footer>
    </div>
  );
};

