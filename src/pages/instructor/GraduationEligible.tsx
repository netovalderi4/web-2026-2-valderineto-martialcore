import React, { useState } from 'react';
import type { ModalityId } from '../../types/martial';
import { STUDENTS_DATA, MODALITIES_DATA } from '../../mock/martialData';
import { BeltRenderer } from '../../components/martial/BeltRenderer';
import {
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Send
} from 'lucide-react';

interface GraduationEligibleProps {
  selectedModality: ModalityId | 'all';
}

export const GraduationEligible: React.FC<GraduationEligibleProps> = ({ selectedModality }) => {
  const [scheduledIds, setScheduledIds] = useState<string[]>([]);

  // Localiza todos os registros de graduação que atingiram os requisitos
  const eligibleList = STUDENTS_DATA.flatMap(student =>
    student.modalities
      .filter(
        m =>
          (selectedModality === 'all' || m.modalityId === selectedModality) &&
          m.isReadyForPromotion
      )
      .map(m => ({
        student,
        graduation: m,
        uniqueKey: `${student.id}-${m.modalityId}`
      }))
  );

  const handleScheduleExam = (key: string) => {
    setScheduledIds(prev => [...prev, key]);
  };

  return (
    <div className="space-y-6">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Atletas Aptos para Exame de Graduação</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-black">
              {eligibleList.length} Atleta(s)
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Cálculo automático de carência em meses + presenças mínimas no tatame exigidas por arte marcial.
          </p>
        </div>
      </div>

      {/* Banner Informativo */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border border-amber-500/30 flex items-center gap-3 text-xs">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
        <p className="text-zinc-200">
          O sistema confere a carência de cada modalidade em tempo de execução. Ao agendar o exame, o atleta recebe uma convocatória no portal do aluno e a data é sincronizada com a alocação de tatames.
        </p>
      </div>

      {/* Cards dos Alunos Aptos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {eligibleList.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 text-sm bg-zinc-900/40 rounded-xl border border-zinc-800">
            Nenhum atleta cumpriu todos os critérios para a modalidade selecionada no momento.
          </div>
        ) : (
          eligibleList.map(({ student, graduation, uniqueKey }) => {
            const modality = MODALITIES_DATA.find(m => m.id === graduation.modalityId);
            const isScheduled = scheduledIds.includes(uniqueKey);

            return (
              <div
                key={uniqueKey}
                className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: modality?.accentColor }}
                      />
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        {modality?.name}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold flex items-center gap-1">
                      <Award className="w-3 h-3" /> Requisitos Cumpridos
                    </span>
                  </div>

                  {/* Dados do Aluno */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover border border-zinc-700"
                    />
                    <div>
                      <h3 className="font-bold text-white text-base">{student.name}</h3>
                      <p className="text-xs text-zinc-400">{student.email}</p>
                    </div>
                  </div>

                  {/* Graduação Atual */}
                  <div className="mb-4">
                    <span className="text-[11px] text-zinc-400 font-mono block mb-1">
                      Graduação Atual Registrada:
                    </span>
                    <BeltRenderer
                      modalityId={graduation.modalityId}
                      rankName={graduation.currentRank}
                      degrees={graduation.degrees}
                    />
                  </div>

                  {/* Indicadores de Carência e Aulas */}
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-4">
                    <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px]">Aulas Cumpridas:</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        {graduation.classesAttendedInCurrentRank} / {graduation.classesRequired} aulas
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px]">Tempo de Carência:</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        {graduation.monthsInCurrentRank} / {graduation.monthsRequired} meses
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ação de Agendamento */}
                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Último exame: {new Date(graduation.lastExamDate).toLocaleDateString('pt-BR')}</span>
                  </div>

                  {isScheduled ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Convocado para Exame
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleScheduleExam(uniqueKey)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Agendar Exame</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

