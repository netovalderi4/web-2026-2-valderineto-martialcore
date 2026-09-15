import React, { useState } from 'react';
import type { ModalityId } from '../../types/martial';
import { SCHEDULES_DATA, STUDENTS_DATA, MODALITIES_DATA } from '../../mock/martialData';
import { BeltRenderer } from '../../components/martial/BeltRenderer';
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
    <div className="space-y-6">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Tatame Digital • Chamada & Check-in
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Registro de presença dos atletas para cômputo automático de carência e requisitos de graduação.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveChamada}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition shadow-md shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Confirmar Chamada no Tatame</span>
        </button>
      </div>

      {/* Seletor da Turma do Mestre */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-3.5 h-10 rounded-full"
            style={{ backgroundColor: activeModality?.accentColor }}
          />
          <div>
            <span className="text-xs text-zinc-400 font-mono">Aula Selecionada:</span>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-amber-500 mt-0.5 block"
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
            <span className="text-zinc-500 block">Espaço Físico:</span>
            <span className="text-white font-bold">{activeClass.space}</span>
          </div>
          <div>
            <span className="text-zinc-500 block">Presentes no Tatame:</span>
            <span className="text-amber-400 font-bold text-sm">
              {presentCount} / {attendanceList.length} alunos
            </span>
          </div>
        </div>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>
            Presença confirmada! O log de check-in computou 1 aula para a carência dos {presentCount} atletas presentes.
          </span>
        </div>
      )}

      {/* Regra de Destaque para BJJ: Gi vs No-Gi */}
      {activeClass.modalityId === 'bjj' && (
        <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-blue-200">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Regra Específica de BJJ:</strong> Distinção de presença com quimono (Gi) ou sem quimono (No-Gi) para contabilização de graus.
            </span>
          </div>
        </div>
      )}

      {/* Tabela Interativa de Presença */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/70 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Atleta</th>
                <th className="py-3 px-4">Graduação Atual</th>
                {activeClass.modalityId === 'bjj' && (
                  <th className="py-3 px-4 text-center">Tipo de Treino</th>
                )}
                <th className="py-3 px-4 text-center">Presença no Tatame</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
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
                    className={`transition ${item.attended ? 'hover:bg-zinc-800/40' : 'bg-red-950/10'}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                        />
                        <span className="font-bold text-white text-sm">{item.name}</span>
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
                          className={`px-3 py-1 rounded-md text-[11px] font-mono font-bold transition cursor-pointer ${
                            item.isGi
                              ? 'bg-blue-600 text-white'
                              : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          item.attended
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
                        }`}
                      >
                        {item.attended ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Presente</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
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
    </div>
  );
};

