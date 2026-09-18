import React from 'react';
import type { ModalityId } from '../../types/martial';
import {
  STUDENTS_DATA,
  INSTRUCTORS_DATA,
  SCHEDULES_DATA,
  INVOICES_DATA,
  MODALITIES_DATA
} from '../../mock/martialData';
import { MartialIcon } from '../../components/martial/MartialIcon';
import { useMartialTheme } from '../../context/MartialThemeContext';
import {
  Users,
  DollarSign,
  Award,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  UserPlus
} from 'lucide-react';

interface AdminDashboardProps {
  selectedModality: ModalityId | 'all';
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  selectedModality,
  onNavigateTab
}) => {
  const { accentColor } = useMartialTheme();
  const activeModalityMeta = MODALITIES_DATA.find(m => m.id === selectedModality);

  // 1. Atletas filtrados pela modalidade ativa
  const filteredStudents = selectedModality === 'all'
    ? STUDENTS_DATA
    : STUDENTS_DATA.filter(s => s.modalities.some(m => m.modalityId === selectedModality));

  // 2. Turmas e horários filtrados
  const filteredSchedules = selectedModality === 'all'
    ? SCHEDULES_DATA
    : SCHEDULES_DATA.filter(s => s.modalityId === selectedModality);

  // 3. Faturamento e faturas correspondentes
  const relevantInvoices = selectedModality === 'all'
    ? INVOICES_DATA
    : INVOICES_DATA.filter(inv => {
        const student = STUDENTS_DATA.find(s => s.id === inv.studentId);
        return student?.modalities.some(m => m.modalityId === selectedModality);
      });

  const totalRevenue = relevantInvoices.reduce(
    (acc, inv) => acc + (inv.status === 'pago' ? inv.amount : 0),
    0
  );
  const pendingRevenue = relevantInvoices.reduce(
    (acc, inv) => acc + (inv.status !== 'pago' ? inv.amount : 0),
    0
  );

  // 4. Inadimplência proporcional aos atletas da modalidade
  const overdueCount = filteredStudents.filter(s => s.paymentStatus === 'atrasado').length;
  const overduePct = filteredStudents.length > 0
    ? Math.round((overdueCount / filteredStudents.length) * 100)
    : 0;

  // 5. Instrutores habilitados na modalidade
  const relevantInstructors = selectedModality === 'all'
    ? INSTRUCTORS_DATA
    : INSTRUCTORS_DATA.filter(i => i.authorizedModalities.includes(selectedModality));

  // 6. Alunos aptos para graduação
  const eligibleStudents = STUDENTS_DATA.filter(s =>
    s.modalities.some(m => (selectedModality === 'all' || m.modalityId === selectedModality) && m.isReadyForPromotion)
  );

  // 7. Dados para o card de distribuição técnica
  const rankBreakdown = React.useMemo(() => {
    if (selectedModality === 'all') return null;

    const counts: Record<string, number> = {};
    filteredStudents.forEach(s => {
      const mod = s.modalities.find(m => m.modalityId === selectedModality);
      if (mod) {
        const label = `${mod.currentRank}${mod.degrees !== undefined && mod.degrees > 0 ? ` (${mod.degrees}º Grau)` : ''}`;
        counts[label] = (counts[label] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([rank, count]) => ({
      rank,
      count,
      pct: Math.round((count / (filteredStudents.length || 1)) * 100)
    }));
  }, [selectedModality, filteredStudents]);

  return (
    <div className="space-y-8">
      {/* Topo / Boas-vindas com Respiro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {selectedModality === 'all' ? (
              'Visão Geral do Centro'
            ) : (
              `Cockpit • ${activeModalityMeta?.name}`
            )}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {selectedModality === 'all'
              ? 'Gestão unificada de tatames, atletas e faturamento de todas as artes.'
              : `Métricas exclusivas, atletas ativos e ocupação de tatames para ${activeModalityMeta?.name}.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('students')}
            className="px-5 py-2.5 text-white font-bold text-xs rounded-2xl transition-all duration-300 shadow-sm hover:brightness-110 flex items-center gap-2 cursor-pointer"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 4px 14px -2px ${accentColor}40`
            }}
          >
            <UserPlus className="w-4 h-4" />
            <span>Matricular Atleta</span>
          </button>
        </div>
      </div>

      {/* Alerta de Destaque: Alunos aptos a exame */}
      {eligibleStudents.length > 0 && (
        <div
          className="p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-xs"
          style={{
            backgroundColor: `${accentColor}0a`,
            borderColor: `${accentColor}25`
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `${accentColor}18`,
                borderColor: `${accentColor}30`,
                color: accentColor
              }}
            >
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                {eligibleStudents.length} atleta(s) aptos para exame de faixa {selectedModality !== 'all' ? `em ${activeModalityMeta?.name}` : 'no centro'}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Cumpriram a carência em meses e as presenças mínimas exigidas no tatame.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('eligible')}
            className="text-xs font-bold hover:underline flex items-center gap-1 shrink-0 cursor-pointer self-start sm:self-auto"
            style={{ color: accentColor }}
          >
            Convocar Alunos <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid de KPIs principais (Reativo ao filtro ativo) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Atletas Ativos na Arte/Total */}
        <div className="p-6 bg-white dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 rounded-3xl shadow-xs transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {selectedModality === 'all' ? 'Atletas Matriculados' : `Atletas de ${activeModalityMeta?.shortName}`}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-white mt-3 tracking-tight">
            {filteredStudents.length}
          </p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
            {selectedModality === 'all' ? 'Base total cadastrada' : `Frequência regular em ${activeModalityMeta?.shortName}`}
          </p>
        </div>

        {/* Faturamento Filtrado */}
        <div className="p-6 bg-white dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 rounded-3xl shadow-xs transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {selectedModality === 'all' ? 'Receita Liquidada' : `Receita (${activeModalityMeta?.shortName})`}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-white mt-3 tracking-tight">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
          </p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
            Pendente: R$ {pendingRevenue.toFixed(0)}
          </p>
        </div>

        {/* Inadimplência na Modalidade */}
        <div className="p-6 bg-white dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 rounded-3xl shadow-xs transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Inadimplência</span>
            <div className="w-9 h-9 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-white mt-3 tracking-tight">
            {overduePct}%
          </p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
            {overdueCount} atleta(s) em atraso
          </p>
        </div>

        {/* Grade de Aulas da Modalidade */}
        <div className="p-6 bg-white dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 rounded-3xl shadow-xs transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Turmas Ativas</span>
            <div className="w-9 h-9 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-white mt-3 tracking-tight">
            {filteredSchedules.length}
          </p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
            {relevantInstructors.length} mestre(s) habilitado(s)
          </p>
        </div>
      </div>

      {/* Grid de Seções: Distribuição Técnica + Ocupação dos Tatames */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Distribuição (Modalidades se 'all', ou Graduação se modalidade ativa) */}
        <div className="lg:col-span-1 p-6 bg-white dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 rounded-3xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-zinc-400" />
                <span>
                  {selectedModality === 'all'
                    ? 'Atletas por Arte'
                    : `Graduações em ${activeModalityMeta?.shortName}`}
                </span>
              </h3>
              <span className="text-xs text-zinc-400 font-mono">
                Total: {filteredStudents.length}
              </span>
            </div>

            {selectedModality === 'all' ? (
              /* Visão Global: Todas as Artes */
              <div className="space-y-3.5">
                {MODALITIES_DATA.map(mod => {
                  const count = STUDENTS_DATA.filter(s =>
                    s.modalities.some(m => m.modalityId === mod.id)
                  ).length;
                  const pct = Math.round((count / (STUDENTS_DATA.length || 1)) * 100);

                  return (
                    <div key={mod.id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <div style={{ color: mod.accentColor }}>
                            <MartialIcon modalityId={mod.id} size={15} />
                          </div>
                          <span className="text-zinc-700 dark:text-zinc-300 font-medium">{mod.shortName}</span>
                        </div>
                        <span className="font-mono text-zinc-400 text-[11px]">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
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
            ) : (
              /* Visão Filtrada: Distribuição de Faixas / Níveis na Arte Ativa */
              <div className="space-y-3.5">
                {rankBreakdown && rankBreakdown.length > 0 ? (
                  rankBreakdown.map(item => (
                    <div key={item.rank} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-zinc-800 dark:text-zinc-200 font-bold">{item.rank}</span>
                        <span className="font-mono text-zinc-400 text-[11px]">
                          {item.count} atleta(s) ({item.pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.pct}%`,
                            backgroundColor: accentColor
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 py-4 text-center">Nenhum atleta matriculado com graduação registrada.</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <button
              type="button"
              onClick={() => onNavigateTab('modalities')}
              className="w-full py-2.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Configurar Regras de Graduação <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Coluna 2 e 3: Grade de Alocação de Tatames e Ringues */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                {selectedModality === 'all'
                  ? 'Alocação de Tatames & Ringues'
                  : `Turmas de ${activeModalityMeta?.name}`}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Capacidade física e turmas em atividade no centro.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('schedules')}
              className="text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
              style={{ color: accentColor }}
            >
              Ver Grade Completa <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {filteredSchedules.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                Nenhuma turma agendada para {activeModalityMeta?.name} no momento.
              </div>
            ) : (
              filteredSchedules.slice(0, 4).map(sch => {
                const modality = MODALITIES_DATA.find(m => m.id === sch.modalityId);
                const occupancyPct = Math.round((sch.enrolledCount / sch.capacity) * 100);

                return (
                  <div
                    key={sch.id}
                    className="p-4 rounded-2xl bg-zinc-50/60 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${modality?.accentColor}12`,
                          borderColor: `${modality?.accentColor}30`,
                          color: modality?.accentColor
                        }}
                      >
                        <MartialIcon modalityId={sch.modalityId} size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">{sch.title}</span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {sch.space} • {sch.instructorName} • {sch.startTime} às {sch.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:text-right shrink-0">
                      <div>
                        <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white block">
                          {sch.enrolledCount} / {sch.capacity} vagas
                        </span>
                        <div className="w-24 bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              occupancyPct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${occupancyPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
