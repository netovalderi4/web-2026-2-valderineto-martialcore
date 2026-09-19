import React from 'react';
import { MODALITIES_DATA } from '../mock/martialData';
import { MartialIcon } from '../components/martial/MartialIcon';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { MartialCoreLogo } from '../components/ui/MartialCoreLogo';
import {
  CheckCircle,
  Users,
  DollarSign,
  ChevronDown,
  Sparkles,
  LogIn
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuthModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuthModal }) => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 transition-colors duration-200">
      {/* Header Institucional Preto e Branco */}
      <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <MartialCoreLogo size="md" isMonochrome={true} />
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <a href="#modalidades" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
              Modalidades
            </a>
            <a href="#funcionalidades" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
              Núcleo do Tatame
            </a>
            <a href="#faq" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-sm hover:scale-[1.02] cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Acessar Sistema</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 px-6 text-center max-w-5xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-full font-bold">
          <Sparkles className="w-3.5 h-3.5 text-zinc-500" /> Gestão Especializada para Centros Multi-Lutas
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mt-6 leading-tight tracking-tight text-zinc-900 dark:text-white">
          Gestão inteligente para centros de treinamento{' '}
          <span className="text-zinc-500 dark:text-zinc-400">
            multi-artes marciais
          </span>
          .
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg md:text-xl mt-6 max-w-3xl mx-auto leading-relaxed">
          Plataforma web modular que adapta regras, nomenclaturas, faixas, graus e critérios técnicos
          para cada modalidade do seu tatame: Jiu-Jitsu, Muay Thai, Karatê, Judô, Capoeira e Boxe.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="inline-flex items-center gap-2.5 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-black px-8 py-4 rounded-2xl transition shadow-lg shadow-zinc-950/20 dark:shadow-white/10 cursor-pointer text-base hover:scale-[1.02]"
          >
            <LogIn className="w-5 h-5" />
            <span>Entrar no Cockpit / Login</span>
          </button>

          <a
            href="#modalidades"
            className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-800 font-bold px-7 py-4 rounded-2xl transition text-base"
          >
            <span>Ver Modalidades</span>
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Vitrine das 6 Modalidades: Imagens em 16:9 em Alta Resolução */}
      <section id="modalidades" className="py-20 bg-zinc-100/70 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Identidade Visual & Tradição
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white mt-1">
              Modalidades Contempladas
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm">
              Cada arte marcial conta com seu esquema de graduação, vestimenta e critérios de avaliação isolados por metadados.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {MODALITIES_DATA.map(m => (
              <div
                key={m.id}
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-700 transition group flex flex-col justify-between shadow-sm hover:shadow-xl"
              >
                <div>
                  {/* Foto de Ação em Alta Resolução 16:9 */}
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                    <img
                      src={m.bannerImage}
                      alt={m.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Tag no Canto da Foto */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md backdrop-blur-md"
                        style={{ backgroundColor: `${m.accentColor}cc` }}
                      >
                        <MartialIcon modalityId={m.id} size={14} />
                        {m.shortName}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-lg font-black text-white drop-shadow-md">{m.name}</h3>
                      <p className="text-xs text-zinc-200 drop-shadow-sm font-medium">{m.tagline}</p>
                    </div>
                  </div>

                  {/* Detalhes Técnicos e Regras */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc list-inside">
                      {m.specificRules.map((rule, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0">
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    <span>Carência: <strong className="text-zinc-900 dark:text-white">{m.defaultTimeRequirementMonths}m</strong></span>
                    <span>Mín. Aulas: <strong className="text-zinc-900 dark:text-white">{m.minClassesForPromotion}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recursos do Núcleo Compartilhado */}
      <section id="funcionalidades" className="py-20 border-t border-zinc-200 dark:border-zinc-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Arquitetura Unificada
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white mt-1">
              Recursos do Núcleo Compartilhado
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm">
              Operações essenciais unificadas em uma única base relacional PostgreSQL, sem duplicidade de dados.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700/60 mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-xl">Controle de Acesso RBAC</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 leading-relaxed">
                4 níveis de permissão bem definidos: Administrador / Gestor do Centro, Mestres e Instrutores, Atletas e Alunos Experimentais.
              </p>
            </div>

            <div className="p-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700/60 mb-5">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-xl">Tatame Digital & Chamada</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 leading-relaxed">
                Alocação de tatames e ringues, chamada rápida com botão touch e cômputo automático de carência em meses para exame de graduação.
              </p>
            </div>

            <div className="p-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700/60 mb-5">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-xl">Gestão Financeira & Planos</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 leading-relaxed">
                Planos individuais por arte ou combos multi-artes com desconto progressivo, baixa de mensalidades via PIX e monitoramento de inadimplência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-zinc-100/70 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-full font-bold">
              Perguntas Frequentes
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 text-zinc-900 dark:text-white">
              FAQ Estruturado
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm">
              Dúvidas comuns sobre o funcionamento do MartialCore.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">O que é o MartialCore?</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                O MartialCore é uma plataforma web modular voltada para a gestão integrada de centros
                de treinamento e academias multi-modalidades de artes marciais, como Jiu-Jitsu, Muay
                Thai, Karatê, Judô, Capoeira e Boxe.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                Como a plataforma gerencia diferentes modalidades e graduações?
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                O sistema adapta automaticamente regras, tempos de carência, faixas, graus, cordéis e
                critérios técnicos específicos para cada modalidade do tatame de forma isolada por
                metadados.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                O MartialCore possui controle de frequência e financeiro?
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                Sim, a plataforma unifica o controle de check-in em tatames, cálculo de presenças para
                exames de graduação, planos e gestão de adimplência em um único banco de dados
                relacional.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-8 text-center text-xs text-zinc-500 dark:text-zinc-500 border-t border-zinc-200 dark:border-zinc-800">
        <p>&copy; 2026 MartialCore — Projeto PAM0462 (Programação Web - UFERSA - Campus Pau dos Ferros).</p>
      </footer>
    </div>
  );
};
