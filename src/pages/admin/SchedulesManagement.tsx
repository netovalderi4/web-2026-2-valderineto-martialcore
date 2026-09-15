import React, { useState } from 'react';
import type { ModalityId } from '../../types/martial';
import { SCHEDULES_DATA, MODALITIES_DATA } from '../../mock/martialData';
import {
  Clock,
  MapPin,
  Users,
  Plus,
  CheckCircle2
} from 'lucide-react';

interface SchedulesManagementProps {
  selectedModality: ModalityId | 'all';
}

export const SchedulesManagement: React.FC<SchedulesManagementProps> = ({ selectedModality }) => {
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedSpace, setSelectedSpace] = useState<string>('all');

  const spaces = ['Tatame 1', 'Tatame 2', 'Ringue de Luta', 'Octógono'];
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const filtered = SCHEDULES_DATA.filter(sch => {
    const matchModality = selectedModality === 'all' || sch.modalityId === selectedModality;
    const matchDay = selectedDay === 'all' || sch.dayOfWeek === selectedDay;
    const matchSpace = selectedSpace === 'all' || sch.space === selectedSpace;
    return matchModality && matchDay && matchSpace;
  });

  return (
    <div className="space-y-6">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Alocação de Tatames & Grade de Horários
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Gestão de espaços físicos (tatames e ringues), instrutores habilitados e controle de lotação.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Modal de criação de turma / alocação de horário!')}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition shadow-md shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Alocar Nova Turma</span>
        </button>
      </div>

      {/* Barra de Filtros (Espaço e Dia da Semana) */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
        {/* Filtro por Dia */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs text-zinc-400 font-medium mr-1">Dia:</span>
          <button
            type="button"
            onClick={() => setSelectedDay('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
              selectedDay === 'all'
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Semana Toda
          </button>
          {days.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDay(d)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                selectedDay === d
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Filtro por Espaço Físico */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs text-zinc-400 font-medium mr-1">Espaço:</span>
          <button
            type="button"
            onClick={() => setSelectedSpace('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
              selectedSpace === 'all'
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Todos os Espaços
          </button>
          {spaces.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedSpace(s)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                selectedSpace === s
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Cards das Turmas Alocadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 text-sm bg-zinc-900/40 rounded-xl border border-zinc-800">
            Nenhuma turma encontrada para os critérios selecionados.
          </div>
        ) : (
          filtered.map(sch => {
            const modality = MODALITIES_DATA.find(m => m.id === sch.modalityId);
            const occupancyPct = Math.round((sch.enrolledCount / sch.capacity) * 100);

            return (
              <div
                key={sch.id}
                className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="text-[11px] font-mono px-2.5 py-1 rounded-full font-bold border"
                      style={{
                        backgroundColor: `${modality?.accentColor}15`,
                        color: modality?.accentColor,
                        borderColor: `${modality?.accentColor}40`
                      }}
                    >
                      {modality?.name}
                    </span>

                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {sch.dayOfWeek}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug">{sch.title}</h3>

                  <div className="space-y-2 mt-4 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{sch.startTime} às {sch.endTime}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="font-semibold text-zinc-200">{sch.space}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{sch.instructorName}</span>
                    </div>
                  </div>

                  {sch.isGiCompatible !== undefined && (
                    <div className="mt-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {sch.isGiCompatible ? 'Quimono Obrigatório (Gi)' : 'Roupa de Treino (No-Gi)'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Barra de Ocupação e Vagas */}
                <div className="mt-5 pt-4 border-t border-zinc-800">
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-zinc-400">Ocupação:</span>
                    <span className="text-white font-bold">
                      {sch.enrolledCount} / {sch.capacity} vagas ({occupancyPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        occupancyPct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>

                  {sch.openForTrial && (
                    <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Vagas abertas para alunos experimentais
                    </p>
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

