import React from 'react';
import type { ModalityId } from '../../types/martial';
import {
  STUDENTS_DATA,
  INSTRUCTORS_DATA,
  SCHEDULES_DATA,
  INVOICES_DATA,
  MODALITIES_DATA
} from '../../mock/martialData';
import {
  Users,
  DollarSign,
  Award,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  selectedModality: ModalityId | 'all';
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  selectedModality,
  onNavigateTab
}) => {
  // Filtra dados pela modalidade ativa se não for 'all'
  const filteredStudents = selectedModality === 'all'
    ? STUDENTS_DATA
    : STUDENTS_DATA.filter(s => s.modalities.some(m => m.modalityId === selectedModality));

  const filteredSchedules = selectedModality === 'all'
    ? SCHEDULES_DATA
    : SCHEDULES_DATA.filter(s => s.modalityId === selectedModality);

  // Cálculos de métricas
  const totalRevenue = INVOICES_DATA.reduce((acc, inv) => acc + (inv.status === 'pago' ? inv.amount : 0), 0);
  const pendingRevenue = INVOICES_DATA.reduce((acc, inv) => acc + (inv.status !== 'pago' ? inv.amount : 0), 0);
  const overdueCount = STUDENTS_DATA.filter(s => s.paymentStatus === 'atrasado').length;
  
  // Alunos aptos para graduação
  const eligibleStudents = STUDENTS_DATA.filter(s =>
    s.modalities.some(m => (selectedModality === 'all' || m.modalityId === selectedModality) && m.isReadyForPromotion)
  );

  return (
    <div className="space-y-6">
      {/* Topo / Boas-vindas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Visão Executiva do Centro de Treinamento</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
              {selectedModality === 'all' ? 'Todas as Modalidades' : selectedModality.toUpperCase()}
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Monitoramento integrado de tatames, atletas, corpo técnico e fluxo de caixa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateTab('students')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" /> Matricular Atleta
          </button>
        </div>
      </div>

      {/* Alerta de Destaque: Alunos aptos a exame */}
      {eligibleStudents.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <span>{eligibleStudents.length} atleta(s) cumpriram carência e presenças mínimas!</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500 text-black font-extrabold">
                  Apto a Exame
                </span>
              </p>
              <p className="text-xs text-zinc-400">
                Alunos já podem ser convocados pelos mestres para avaliação de troca de faixa/cordel.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('students')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0 cursor-pointer"
          >
            Ver Alunos <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid de KPIs principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Atletas Ativos */}
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Atletas Matriculados</span>
            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">{filteredStudents.length}</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>100% de ocupação nos horários nobres</span>
          </div>
        </div>

        {/* Faturamento Pago */}
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Receita Liquidada (Mês)</span>
            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-400">
            <span>Pendente/Atrasado: R$ {pendingRevenue.toFixed(2)}</span>
          </div>
        </div>

        {/* Inadimplência */}
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Taxa de Inadimplência</span>
            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {Math.round((overdueCount / (STUDENTS_DATA.length || 1)) * 100)}%
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-red-400">
            <span>{overdueCount} mensalidade(s) em aberto</span>
          </div>
        </div>

        {/* Mestres e Turmas */}
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Turmas Ativas / Semana</span>
            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">{filteredSchedules.length} aulas</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-400">
            <span>{INSTRUCTORS_DATA.length} mestres cadastrados</span>
          </div>
        </div>
      </div>

      {/* Grid de Seções: Distribuição por Modalidade + Ocupação dos Tatames */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição de Alunos por Modalidade (Metadados do Sistema) */}
        <div className="lg:col-span-1 p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Matrículas por Arte Marcial</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Base de dados compartilhada entre as 6 modalidades.
            </p>

            <div className="space-y-3 mt-4">
              {MODALITIES_DATA.map(mod => {
                const count = STUDENTS_DATA.filter(s =>
                  s.modalities.some(m => m.modalityId === mod.id)
                ).length;
                const pct = Math.round((count / STUDENTS_DATA.length) * 100);

                return (
                  <div key={mod.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-300">{mod.name}</span>
                      <span className="font-mono text-zinc-400">
                        {count} atleta(s) ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: mod.accentColor
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => onNavigateTab('modalities')}
              className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Configurar Regras de Graduação <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Grade de Alocação de Tatames e Ringues Hoje */}
        <div className="lg:col-span-2 p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Alocação de Tatames & Ringues</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Grade de horários e limites de capacidade por espaço físico.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('schedules')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              Ver Grade Completa <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {filteredSchedules.slice(0, 4).map(sch => {
              const modality = MODALITIES_DATA.find(m => m.id === sch.modalityId);
              const occupancyPct = Math.round((sch.enrolledCount / sch.capacity) * 100);

              return (
                <div
                  key={sch.id}
                  className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2.5 h-10 rounded-full"
                      style={{ backgroundColor: modality?.accentColor || '#f59e0b' }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{sch.title}</span>
                        {sch.isGiCompatible !== undefined && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                            {sch.isGiCompatible ? 'Com Quimono (Gi)' : 'Sem Quimono (No-Gi)'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {sch.space} • {sch.instructorName} • {sch.startTime} às {sch.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:text-right shrink-0">
                    <div>
                      <span className="text-xs font-mono font-bold text-white">
                        {sch.enrolledCount}/{sch.capacity} alunos
                      </span>
                      <span className="text-[11px] block text-zinc-400">{occupancyPct}% lotação</span>
                    </div>

                    <div className="w-16 bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          occupancyPct >= 85 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

