import React from 'react';
import type { ModalityId } from '../../types/martial';
import {
  STUDENTS_DATA,
  MODALITIES_DATA,
  PLANS_DATA,
  INVOICES_DATA,
  TECHNICAL_EVALUATIONS_DATA
} from '../../mock/martialData';
import { BeltRenderer } from '../../components/martial/BeltRenderer';
import { WeightCategoryBadge } from '../../components/martial/WeightCategoryBadge';
import {
  Trophy,
  CheckCircle2,
  DollarSign,
  Award,
  FileCheck2
} from 'lucide-react';

interface StudentPortalProps {
  selectedModality: ModalityId | 'all';
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ selectedModality }) => {
  // Usuário padrão do perfil aluno: Lucas Mendonça (stud-1)
  const student = STUDENTS_DATA[0];
  const activePlan = PLANS_DATA.find(p => p.id === student.activePlanId);
  const studentInvoices = INVOICES_DATA.filter(i => i.studentId === student.id);
  const studentEvaluations = TECHNICAL_EVALUATIONS_DATA.filter(e => e.studentId === student.id);

  const displayedModalities = student.modalities.filter(
    m => selectedModality === 'all' || m.modalityId === selectedModality
  );

  return (
    <div className="space-y-6">
      {/* Topo do Atleta */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/20 border border-zinc-800 shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{student.name}</h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                Atleta Ativo
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Matrícula desde {new Date(student.enrollmentDate).toLocaleDateString('pt-BR')} • {activePlan?.name}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <WeightCategoryBadge
                weightKg={student.currentWeightKg}
                category={student.weightCategory}
              />
            </div>
          </div>
        </div>

        {/* Status Financeiro Rápido */}
        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs font-mono">
          <span className="text-zinc-500 block text-[10px] uppercase">Situação Financeira:</span>
          <div className="flex items-center gap-2 mt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-bold">Mensalidade em Dia</span>
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">
            Plano: R$ {activePlan?.priceMonthly.toFixed(2)}/mês
          </span>
        </div>
      </div>

      {/* Seção: Meu Progresso & Graduação nas Modalidades */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Meu Progresso & Termômetro de Graduação</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedModalities.map(m => {
            const meta = MODALITIES_DATA.find(mod => mod.id === m.modalityId);
            const classesPct = Math.min(
              100,
              Math.round((m.classesAttendedInCurrentRank / m.classesRequired) * 100)
            );
            const monthsPct = Math.min(
              100,
              Math.round((m.monthsInCurrentRank / m.monthsRequired) * 100)
            );

            return (
              <div
                key={m.modalityId}
                className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4 shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: meta?.accentColor }}
                    />
                    <h3 className="font-bold text-white text-base">{meta?.name}</h3>
                  </div>

                  {m.isReadyForPromotion ? (
                    <span className="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                      <Award className="w-3.5 h-3.5" /> Apto para Exame de Faixa!
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-zinc-400">
                      Em período de carência
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <BeltRenderer
                    modalityId={m.modalityId}
                    rankName={m.currentRank}
                    degrees={m.degrees}
                  />
                </div>

                {/* Barras de Progresso: Presenças vs Carência */}
                <div className="space-y-3 pt-2">
                  {/* Frequência */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-400">Presenças no Grau Atual:</span>
                      <span className="text-white font-bold">
                        {m.classesAttendedInCurrentRank} / {m.classesRequired} aulas ({classesPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          classesPct >= 100 ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${classesPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Carência */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-400">Carência Mínima Exigida:</span>
                      <span className="text-white font-bold">
                        {m.monthsInCurrentRank} / {m.monthsRequired} meses ({monthsPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          monthsPct >= 100 ? 'bg-amber-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${monthsPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between font-mono">
                  <span>Último Exame: {new Date(m.lastExamDate).toLocaleDateString('pt-BR')}</span>
                  <span className="text-amber-400 font-bold">
                    {m.isReadyForPromotion ? 'Convocatória Liberada' : 'Treinos em Andamento'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Feedback das Avaliações Técnicas + Histórico de Mensalidades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avaliações Técnicas dos Mestres */}
        <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>Avaliações Técnicas do Mestre</span>
            </h3>
            <span className="text-xs font-mono text-zinc-400">Ficha Técnica</span>
          </div>

          <div className="space-y-3">
            {studentEvaluations.map(ev => (
              <div
                key={ev.id}
                className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-zinc-400 font-mono">
                  <span className="text-white font-bold">{ev.instructorName}</span>
                  <span>{new Date(ev.date).toLocaleDateString('pt-BR')}</span>
                </div>

                <p className="text-zinc-300 italic bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800/80">
                  "{ev.notes}"
                </p>

                {ev.bjjEvaluation && (
                  <div className="flex items-center gap-4 text-zinc-400 font-mono pt-1">
                    <span>Guarda: <strong className="text-amber-400">{ev.bjjEvaluation.guardPassing}</strong></span>
                    <span>Finalização: <strong className="text-amber-400">{ev.bjjEvaluation.submissions}</strong></span>
                    <span>Recomendação: <strong className="text-white">{ev.bjjEvaluation.recommendedDegree}º Grau</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Minhas Mensalidades */}
        <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>Minhas Mensalidades</span>
            </h3>
            <span className="text-xs font-mono text-zinc-400">Histórico de Faturas</span>
          </div>

          <div className="space-y-3">
            {studentInvoices.map(inv => (
              <div
                key={inv.id}
                className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-white">{inv.planName}</p>
                  <p className="text-zinc-400 font-mono text-[11px] mt-0.5">
                    Vencimento: {new Date(inv.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-amber-400 font-mono block">
                    R$ {inv.amount.toFixed(2)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Liquidado via {inv.paymentMethod}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

