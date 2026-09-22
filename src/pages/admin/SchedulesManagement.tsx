import React, { useState } from 'react';
import type { ModalityId, ClassSchedule, UserRole } from '../../types/martial';
import { SCHEDULES_DATA, MODALITIES_DATA, INSTRUCTORS_DATA } from '../../mock/martialData';
import { MartialIcon } from '../../components/martial/MartialIcon';
import { useMartialTheme } from '../../context/MartialThemeContext';
import { sanitizeInput } from '../../utils/security';
import {
  Clock,
  MapPin,
  Users,
  Plus,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';

interface SchedulesManagementProps {
  selectedModality: ModalityId | 'all';
  currentRole?: UserRole;
}

export const SchedulesManagement: React.FC<SchedulesManagementProps> = ({
  selectedModality,
  currentRole = 'admin'
}) => {
  const { accentColor } = useMartialTheme();
  const [schedulesList, setSchedulesList] = useState<ClassSchedule[]>(SCHEDULES_DATA);
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedSpace, setSelectedSpace] = useState<string>('all');

  // Modal de Nova Turma
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newModalityId, setNewModalityId] = useState<ModalityId>('bjj');
  const [newInstructorName, setNewInstructorName] = useState(INSTRUCTORS_DATA[0].name);
  const [newDay, setNewDay] = useState<'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado'>('Segunda');
  const [newStartTime, setNewStartTime] = useState('18:00');
  const [newEndTime, setNewEndTime] = useState('19:30');
  const [newSpace, setNewSpace] = useState<'Tatame 1' | 'Tatame 2' | 'Ringue de Luta' | 'Octógono'>('Tatame 1');
  const [newCapacity, setNewCapacity] = useState('20');
  const [newOpenForTrial, setNewOpenForTrial] = useState(true);
  const [newIsGiCompatible, setNewIsGiCompatible] = useState(true);

  const spaces = ['Tatame 1', 'Tatame 2', 'Ringue de Luta', 'Octógono'];
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = sanitizeInput(newTitle);
    if (!cleanTitle || cleanTitle.length < 3) {
      setFormError('Por favor, informe um título descritivo para a turma (mínimo 3 letras).');
      return;
    }
    const capNum = parseInt(newCapacity, 10);
    if (isNaN(capNum) || capNum < 1 || capNum > 100) {
      setFormError('A capacidade de alunos por turma deve ser entre 1 e 100.');
      return;
    }
    if (!newStartTime || !newEndTime) {
      setFormError('Por favor, preencha o horário de início e término.');
      return;
    }
    if (newStartTime >= newEndTime) {
      setFormError('O horário de término deve ser posterior ao horário de início.');
      return;
    }

    setFormError(null);
    const newClass: ClassSchedule = {
      id: `sch_${Date.now()}`,
      modalityId: newModalityId,
      title: cleanTitle,
      instructorId: INSTRUCTORS_DATA.find(i => i.name === newInstructorName)?.id || 'inst-1',
      instructorName: newInstructorName,
      dayOfWeek: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      space: newSpace,
      capacity: capNum,
      enrolledCount: 1,
      isGiCompatible: newModalityId === 'bjj' ? newIsGiCompatible : undefined,
      openForTrial: newOpenForTrial
    };

    setSchedulesList(prev => [newClass, ...prev]);
    setIsModalOpen(false);
    setNewTitle('');
    alert(`Turma "${newClass.title}" alocada com sucesso no ${newClass.space}!`);
  };

  const filtered = schedulesList.filter(sch => {
    const matchModality = selectedModality === 'all' || sch.modalityId === selectedModality;
    const matchDay = selectedDay === 'all' || sch.dayOfWeek === selectedDay;
    const matchSpace = selectedSpace === 'all' || sch.space === selectedSpace;
    return matchModality && matchDay && matchSpace;
  });

  return (
    <div className="space-y-7">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Alocação de Tatames & Grade de Horários
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Gestão de espaços físicos (tatames e ringues), instrutores habilitados e controle de lotação.
          </p>
        </div>

        {/* RBAC: Apenas Gestor/Admin tem permissão para alocar turmas */}
        {currentRole === 'admin' && (
          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setIsModalOpen(true);
            }}
            style={{ backgroundColor: accentColor }}
            className="px-5 py-2.5 text-white font-bold text-xs rounded-xl transition shadow-sm hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Alocar Nova Turma</span>
          </button>
        )}
      </div>

      {/* Barra de Filtros (Espaço e Dia da Semana) */}
      <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 shadow-sm">
        {/* Filtro por Dia */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mr-1 whitespace-nowrap">Dia:</span>
          <button
            type="button"
            onClick={() => setSelectedDay('all')}
            style={selectedDay === 'all' ? { backgroundColor: accentColor, color: '#ffffff' } : {}}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              selectedDay === 'all'
                ? 'font-bold shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
            }`}
          >
            Semana Toda
          </button>
          {days.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDay(d)}
              style={selectedDay === d ? { backgroundColor: accentColor, color: '#ffffff' } : {}}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                selectedDay === d
                  ? 'font-bold shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Filtro por Espaço Físico */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mr-1 whitespace-nowrap">Espaço:</span>
          <button
            type="button"
            onClick={() => setSelectedSpace('all')}
            style={selectedSpace === 'all' ? { backgroundColor: accentColor, color: '#ffffff' } : {}}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              selectedSpace === 'all'
                ? 'font-bold shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
            }`}
          >
            Todos
          </button>
          {spaces.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedSpace(s)}
              style={selectedSpace === s ? { backgroundColor: accentColor, color: '#ffffff' } : {}}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                selectedSpace === s
                  ? 'font-bold shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
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
          <div className="col-span-full py-12 text-center text-zinc-500 text-sm bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            Nenhuma turma encontrada para os critérios selecionados.
          </div>
        ) : (
          filtered.map(sch => {
            const modality = MODALITIES_DATA.find(m => m.id === sch.modalityId);
            const occupancyPct = Math.round((sch.enrolledCount / sch.capacity) * 100);

            return (
              <div
                key={sch.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full font-bold border"
                      style={{
                        backgroundColor: `${modality?.accentColor}15`,
                        color: modality?.accentColor,
                        borderColor: `${modality?.accentColor}40`
                      }}
                    >
                      <MartialIcon modalityId={sch.modalityId} size={13} />
                      {modality?.name}
                    </span>

                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      {sch.dayOfWeek}
                    </span>
                  </div>

                  <h3 className="font-bold text-zinc-900 dark:text-white text-base leading-snug">{sch.title}</h3>

                  <div className="space-y-2 mt-4 text-xs text-zinc-600 dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{sch.startTime} às {sch.endTime}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{sch.space}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{sch.instructorName}</span>
                    </div>
                  </div>

                  {sch.isGiCompatible !== undefined && (
                    <div className="mt-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        {sch.isGiCompatible ? 'Quimono Obrigatório (Gi)' : 'Roupa de Treino (No-Gi)'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Barra de Ocupação e Vagas */}
                <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-zinc-500 dark:text-zinc-400">Ocupação:</span>
                    <span className="text-zinc-900 dark:text-white font-bold">
                      {sch.enrolledCount} / {sch.capacity} vagas ({occupancyPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        occupancyPct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>

                  {sch.openForTrial && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Vagas para aula experimental
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Alocar Nova Turma / Horário */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg p-6 sm:p-7 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1">
              Alocar Nova Turma no Centro
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
              Defina o espaço físico, horários e instrutor habilitado para o tatame ou ringue.
            </p>

            <form onSubmit={handleCreateSchedule} className="space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Título da Turma <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Karatê Kata & Kumite Avançado"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Modalidade</label>
                  <select
                    value={newModalityId}
                    onChange={e => setNewModalityId(e.target.value as ModalityId)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {MODALITIES_DATA.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Espaço Físico</label>
                  <select
                    value={newSpace}
                    onChange={e => setNewSpace(e.target.value as any)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {spaces.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Dia da Semana</label>
                  <select
                    value={newDay}
                    onChange={e => setNewDay(e.target.value as any)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Início</label>
                  <input
                    type="time"
                    required
                    value={newStartTime}
                    onChange={e => setNewStartTime(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Término</label>
                  <input
                    type="time"
                    required
                    value={newEndTime}
                    onChange={e => setNewEndTime(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Instrutor Habilitado</label>
                  <select
                    value={newInstructorName}
                    onChange={e => setNewInstructorName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {INSTRUCTORS_DATA.map(i => (
                      <option key={i.id} value={i.name}>{i.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Capacidade (Vagas)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newCapacity}
                    onChange={e => setNewCapacity(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newOpenForTrial}
                    onChange={e => setNewOpenForTrial(e.target.checked)}
                    className="rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-zinc-700 dark:text-zinc-300">Abrir para Aula Experimental</span>
                </label>

                {newModalityId === 'bjj' && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsGiCompatible}
                      onChange={e => setNewIsGiCompatible(e.target.checked)}
                      className="rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-zinc-700 dark:text-zinc-300">Quimono Obrigatório (Gi)</span>
                  </label>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: accentColor }}
                  className="px-5 py-2 text-white font-bold rounded-xl shadow-xs hover:opacity-90 transition cursor-pointer"
                >
                  Alocar Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

