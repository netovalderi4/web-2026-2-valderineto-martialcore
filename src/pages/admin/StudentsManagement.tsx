import React, { useState } from 'react';
import type { ModalityId, Student } from '../../types/martial';
import { STUDENTS_DATA, MODALITIES_DATA } from '../../mock/martialData';
import { BeltRenderer } from '../../components/martial/BeltRenderer';
import { WeightCategoryBadge } from '../../components/martial/WeightCategoryBadge';
import { useMartialTheme } from '../../context/MartialThemeContext';
import {
  Search,
  UserPlus,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  X,
  Phone,
  Mail,
  Calendar,
  HeartPulse
} from 'lucide-react';

interface StudentsManagementProps {
  selectedModality: ModalityId | 'all';
}

export const StudentsManagement: React.FC<StudentsManagementProps> = ({ selectedModality }) => {
  const { accentColor } = useMartialTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'adimplente' | 'pendente' | 'atrasado'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filtragem
  const filteredStudents = STUDENTS_DATA.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModality =
      selectedModality === 'all' ||
      student.modalities.some(m => m.modalityId === selectedModality);

    const matchesPayment =
      paymentFilter === 'all' || student.paymentStatus === paymentFilter;

    return matchesSearch && matchesModality && matchesPayment;
  });

  return (
    <div className="space-y-7">
      {/* Topo: Título e Ação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Gestão de Atletas
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Cadastro unificado de atletas com ficha técnica adaptada para cada modalidade do tatame.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          style={{ backgroundColor: accentColor }}
          className="px-5 py-2.5 text-white font-bold text-xs rounded-xl transition shadow-sm hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Novo Atleta</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">Financeiro:</span>
          {(['all', 'adimplente', 'pendente', 'atrasado'] as const).map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setPaymentFilter(status)}
              style={paymentFilter === status ? { backgroundColor: accentColor, color: '#ffffff' } : {}}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition cursor-pointer whitespace-nowrap ${
                paymentFilter === status
                  ? 'font-bold shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {status === 'all' ? 'Todos' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Versão Desktop: Tabela de Alunos (Visível a partir de md) */}
      <div className="hidden md:block bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4 font-bold">Atleta</th>
                <th className="py-3.5 px-4 font-bold">Modalidades & Graduação</th>
                <th className="py-3.5 px-4 font-bold">Evolução de Carência</th>
                <th className="py-3.5 px-4 font-bold">Status Financeiro</th>
                <th className="py-3.5 px-4 text-right font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500 text-sm">
                    Nenhum atleta encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition">
                    {/* Aluno & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shadow-xs"
                        />
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white text-sm">{student.name}</p>
                          <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Modalidades & Graduação */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        {student.modalities.map(m => {
                          const meta = MODALITIES_DATA.find(mod => mod.id === m.modalityId);
                          return (
                            <div key={m.modalityId} className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: meta?.accentColor }}
                              />
                              <BeltRenderer
                                modalityId={m.modalityId}
                                rankName={m.currentRank}
                                degrees={m.degrees}
                                compact
                              />
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Progresso / Carência */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {student.modalities.map(m => {
                          const classPct = Math.min(
                            100,
                            Math.round((m.classesAttendedInCurrentRank / m.classesRequired) * 100)
                          );
                          return (
                            <div key={m.modalityId} className="space-y-0.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-zinc-700 dark:text-zinc-300 font-mono">
                                  {m.classesAttendedInCurrentRank}/{m.classesRequired} aulas
                                </span>
                                {m.isReadyForPromotion ? (
                                  <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                                    <Award className="w-3 h-3" /> Apto a Exame
                                  </span>
                                ) : (
                                  <span className="text-zinc-500 dark:text-zinc-400 font-mono">
                                    {m.monthsInCurrentRank}/{m.monthsRequired}m carência
                                  </span>
                                )}
                              </div>
                              <div className="w-28 bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    m.isReadyForPromotion ? 'bg-amber-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${classPct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Financeiro */}
                    <td className="py-3.5 px-4">
                      {student.paymentStatus === 'adimplente' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Em Dia
                        </span>
                      )}
                      {student.paymentStatus === 'pendente' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
                          <Clock className="w-3 h-3" /> Vence em breve
                        </span>
                      )}
                      {student.paymentStatus === 'atrasado' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[11px] font-semibold">
                          <AlertCircle className="w-3 h-3" /> Atrasado
                        </span>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(student)}
                        className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
                        title="Ver Ficha Completa do Atleta"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Versão Mobile: Cards Individuais por Atleta (Otimizado para Celular) */}
      <div className="md:hidden space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm bg-white dark:bg-zinc-900/80 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            Nenhum atleta encontrado com os filtros selecionados.
          </div>
        ) : (
          filteredStudents.map(student => (
            <div
              key={student.id}
              className="p-4 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl shadow-xs space-y-3"
            >
              {/* Topo do Card */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-11 h-11 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                  />
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm">{student.name}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs">{student.phone}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudent(student)}
                  className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Modalidades & Graduação */}
              <div className="space-y-1.5 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                {student.modalities.map(m => (
                  <div key={m.modalityId} className="flex items-center justify-between gap-2">
                    <BeltRenderer
                      modalityId={m.modalityId}
                      rankName={m.currentRank}
                      degrees={m.degrees}
                      compact
                    />
                    {m.isReadyForPromotion && (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <Award className="w-3 h-3" /> Apto
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Status Financeiro */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Mensalidade:</span>
                {student.paymentStatus === 'adimplente' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Em Dia
                  </span>
                )}
                {student.paymentStatus === 'pendente' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold">
                    <Clock className="w-3 h-3" /> Vence em breve
                  </span>
                )}
                {student.paymentStatus === 'atrasado' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-semibold">
                    <AlertCircle className="w-3 h-3" /> Atrasado
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Ficha Detalhada do Atleta */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 relative">
            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Cabeçalho do Aluno */}
            <div className="flex items-center gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 shadow-md"
              />
              <div>
                <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">{selectedStudent.name}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Matriculado desde {new Date(selectedStudent.enrollmentDate).toLocaleDateString('pt-BR')}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <WeightCategoryBadge
                    weightKg={selectedStudent.currentWeightKg}
                    category={selectedStudent.weightCategory}
                  />
                  {selectedStudent.cbjRegistration && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300">
                      Filiação CBJ: {selectedStudent.cbjRegistration}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contatos e Informações Pessoais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 text-xs">
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{selectedStudent.email}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{selectedStudent.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Nascimento: {new Date(selectedStudent.birthDate).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <HeartPulse className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="truncate">Emergência: {selectedStudent.emergencyContact}</span>
              </div>
            </div>

            {/* Ficha por Modalidades do Atleta */}
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-3">
                Graduações & Metadados de Evolução
              </h4>
              <div className="space-y-3">
                {selectedStudent.modalities.map(m => {
                  const meta = MODALITIES_DATA.find(mod => mod.id === m.modalityId);
                  return (
                    <div
                      key={m.modalityId}
                      className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: meta?.accentColor }}
                          />
                          <span className="font-bold text-zinc-900 dark:text-white text-sm">{meta?.name}</span>
                          {m.style && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                              Estilo: {m.style}
                            </span>
                          )}
                        </div>

                        {m.isReadyForPromotion && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" /> Apto para Exame
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

                      {/* Métricas de Requisito de Graduação */}
                      <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <span className="text-zinc-500 dark:text-zinc-400 text-[11px] block">Aulas no Grau Atual:</span>
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">
                            {m.classesAttendedInCurrentRank} / {m.classesRequired} necessárias
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <span className="text-zinc-500 dark:text-zinc-400 text-[11px] block">Carência Cumprida:</span>
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">
                            {m.monthsInCurrentRank} / {m.monthsRequired} meses
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cadastro de Novo Atleta (Mock) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1">Cadastrar Novo Atleta</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
              Insira os dados cadastrais. O atleta será salvo no núcleo relacional compartilhado.
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Ex: Pedro Henrique Silva"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="pedro@email.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    placeholder="(84) 99999-0000"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Peso Atual (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="75.0"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Modalidade Inicial</label>
                <select className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500">
                  {MODALITIES_DATA.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Atleta cadastrado no núcleo com sucesso!');
                  setIsAddModalOpen(false);
                }}
                style={{ backgroundColor: accentColor }}
                className="px-5 py-2 text-white font-bold rounded-xl text-xs shadow-xs hover:opacity-90 transition cursor-pointer"
              >
                Salvar Matrícula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

