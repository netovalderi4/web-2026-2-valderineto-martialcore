import React, { useState } from 'react';
import type { ModalityId } from '../../types/martial';
import { SCHEDULES_DATA, STUDENTS_DATA, MODALITIES_DATA } from '../../mock/martialData';
import { BeltRenderer } from '../../components/martial/BeltRenderer';
import { MartialIcon } from '../../components/martial/MartialIcon';
import { useMartialTheme } from '../../context/MartialThemeContext';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Save
} from 'lucide-react';

interface AttendanceSheetProps {
  selectedModality: ModalityId | 'all';
}

interface StudentAttendanceState {
  studentId: string;
  name: string;
  avatar: string;
  rank: string;
  degrees?: number;
  attended: boolean;
  isGi: boolean; // para BJJ
}

export const AttendanceSheet: React.FC<AttendanceSheetProps> = ({ selectedModality }) => {
  const { accentColor } = useMartialTheme();
  const filteredSchedules = SCHEDULES_DATA.filter(
    s => selectedModality === 'all' || s.modalityId === selectedModality
  );

  const [selectedClassId, setSelectedClassId] = useState<string>(
    filteredSchedules[0]?.id || SCHEDULES_DATA[0].id
  );
  const [isSaved, setIsSaved] = useState(false);

  const activeClass =
    filteredSchedules.find(c => c.id === selectedClassId) ||
    filteredSchedules[0] ||
    SCHEDULES_DATA[0];

  const activeModality = MODALITIES_DATA.find(m => m.id === activeClass.modalityId);

  // Inicializa lista de presença com atletas da modalidade
  const initialStudents: StudentAttendanceState[] = STUDENTS_DATA.filter(s =>
    s.modalities.some(m => m.modalityId === activeClass.modalityId)
  ).map(s => {
    const modGrad = s.modalities.find(m => m.modalityId === activeClass.modalityId);
    return {
      studentId: s.id,
      name: s.name,
      avatar: s.avatar,
      rank: modGrad?.currentRank || 'Iniciante',
      degrees: modGrad?.degrees,
      attended: true,
      isGi: activeClass.isGiCompatible ?? true
    };
  });

  const [attendanceList, setAttendanceList] = useState<StudentAttendanceState[]>(initialStudents);

  const toggleAttendance = (id: string) => {
    setAttendanceList(prev =>
      prev.map(item => (item.studentId === id ? { ...item, attended: !item.attended } : item))
    );
  };

  const toggleGi = (id: string) => {
    setAttendanceList(prev =>
      prev.map(item => (item.studentId === id ? { ...item, isGi: !item.isGi } : item))
    );
  };

  const handleSaveChamada = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const presentCount = attendanceList.filter(a => a.attended).length;

  return (
    <div className="space-y-7">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Tatame Digital • Chamada</span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Registro de presença dos atletas para cômputo automático de carência e requisitos de graduação.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveChamada}
          style={{ backgroundColor: accentColor }}
          className="px-5 py-2.5 text-white font-bold text-xs rounded-xl transition shadow-sm hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Confirmar Chamada no Tatame</span>
        </button>
      </div>

      {/* Seletor da Turma do Mestre */}
      <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${activeModality?.accentColor}15`,
              borderColor: `${activeModality?.accentColor}30`,
              color: activeModality?.accentColor
            }}
          >
            <MartialIcon modalityId={activeClass.modalityId} size={20} />
          </div>
          <div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Aula Selecionada:</span>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none mt-0.5 block cursor-pointer"
            >
              {filteredSchedules.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.dayOfWeek} • {c.startTime} - {c.space})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Espaço Físico:</span>
            <span className="text-zinc-900 dark:text-white font-bold">{activeClass.space}</span>
          </div>
          <div>
            <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Presentes no Tatame:</span>
            <span className="font-bold text-sm" style={{ color: accentColor }}>
              {presentCount} / {attendanceList.length} alunos
            </span>
          </div>
        </div>
      </div>

      {isSaved && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            Presença confirmada! O log computou 1 aula para a carência dos {presentCount} atletas presentes.
          </span>
        </div>
      )}

      {/* Regra de Destaque para BJJ: Gi vs No-Gi */}
      {activeClass.modalityId === 'bjj' && (
        <div className="p-3.5 bg-blue-500/10 border border-blue-500/25 rounded-2xl text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-200">
            <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
            <span>
              <strong>Regra de BJJ:</strong> Distinção de presença com quimono (Gi) ou sem quimono (No-Gi) para contabilização de graus.
            </span>
          </div>
        </div>
      )}

      {/* Desktop Table: Tabela Interativa de Presença */}
      <div className="hidden md:block bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4 font-bold">Atleta</th>
                <th className="py-3.5 px-4 font-bold">Graduação Atual</th>
                {activeClass.modalityId === 'bjj' && (
                  <th className="py-3.5 px-4 text-center font-bold">Tipo de Treino</th>
                )}
                <th className="py-3.5 px-4 text-center font-bold">Presença no Tatame</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
              {attendanceList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-500 text-sm">
                    Nenhum aluno matriculado nesta turma.
                  </td>
                </tr>
              ) : (
                attendanceList.map(item => (
                  <tr
                    key={item.studentId}
                    className={`transition ${item.attended ? 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40' : 'bg-red-500/5'}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shadow-xs"
                        />
                        <span className="font-bold text-zinc-900 dark:text-white text-sm">{item.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <BeltRenderer
                        modalityId={activeClass.modalityId}
                        rankName={item.rank}
                        degrees={item.degrees}
                        compact
                      />
                    </td>

                    {/* BJJ Gi vs No-Gi Toggle */}
                    {activeClass.modalityId === 'bjj' && (
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleGi(item.studentId)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition cursor-pointer ${
                            item.isGi
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700'
                          }`}
                        >
                          {item.isGi ? '🥋 Quimono (Gi)' : '🩳 No-Gi (Sem)'}
                        </button>
                      </td>
                    )}

                    {/* Toggle Presença */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleAttendance(item.studentId)}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          item.attended
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                            : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {item.attended ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Presente</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-red-500" />
                            <span>Ausente</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View: Grandes botões de toque para tatame */}
      <div className="md:hidden space-y-3">
        {attendanceList.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm bg-white dark:bg-zinc-900/80 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            Nenhum aluno matriculado nesta turma.
          </div>
        ) : (
          attendanceList.map(item => (
            <div
              key={item.studentId}
              className={`p-4 rounded-2xl border transition-all shadow-xs space-y-3 ${
                item.attended
                  ? 'bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800'
                  : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm">{item.name}</h3>
                    <BeltRenderer
                      modalityId={activeClass.modalityId}
                      rankName={item.rank}
                      degrees={item.degrees}
                      compact
                    />
                  </div>
                </div>

                {/* Botão Gigante de Presença / Falta */}
                <button
                  type="button"
                  onClick={() => toggleAttendance(item.studentId)}
                  className={`p-3 rounded-2xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    item.attended
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {item.attended ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </button>
              </div>

              {/* BJJ Gi toggle on Mobile */}
              {activeClass.modalityId === 'bjj' && (
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Uniforme de treino:</span>
                  <button
                    type="button"
                    onClick={() => toggleGi(item.studentId)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                      item.isGi
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {item.isGi ? '🥋 Com Quimono (Gi)' : '🩳 Sem Quimono (No-Gi)'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

