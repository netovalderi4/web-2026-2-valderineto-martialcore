import React, { useState } from 'react';
import type { ModalityId } from '../../types/martial';
import {
  STUDENTS_DATA,
  MODALITIES_DATA
} from '../../mock/martialData';
import { BeltRenderer } from '../../components/martial/BeltRenderer';
import { TechniqueChecklist } from '../../components/martial/TechniqueChecklist';
import {
  CheckCircle2
} from 'lucide-react';

interface TechnicalEvaluationProps {
  selectedModality: ModalityId | 'all';
}

export const TechnicalEvaluation: React.FC<TechnicalEvaluationProps> = ({ selectedModality }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(STUDENTS_DATA[0].id);
  const [activeModalityId, setActiveModalityId] = useState<ModalityId>(
    selectedModality !== 'all' ? selectedModality : 'bjj'
  );

  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  // Técnicas de Judô para o checklist
  const [judoTechniques, setJudoTechniques] = useState([
    { id: '1', name: 'Ippon Seoi Nage', category: 'Nage-waza (Braço)', isMastered: true },
    { id: '2', name: 'Osoto Gari', category: 'Nage-waza (Perna)', isMastered: true },
    { id: '3', name: 'Harai Goshi', category: 'Nage-waza (Quadril)', isMastered: true },
    { id: '4', name: 'Uchi Mata', category: 'Nage-waza (Perna)', isMastered: true },
    { id: '5', name: 'Kesa Gatame', category: 'Katame-waza (Imobilização)', isMastered: true },
    { id: '6', name: 'Juji Gatame', category: 'Katame-waza (Chave)', isMastered: false }
  ]);

  // Instrumentos de Capoeira
  const [capoeiraInstruments, setCapoeiraInstruments] = useState([
    { id: 'c1', name: 'Berimbau Gunga (Toques)', category: 'Instrumento', isMastered: true },
    { id: 'c2', name: 'Berimbau Médio / Viola', category: 'Instrumento', isMastered: true },
    { id: 'c3', name: 'Pandeiro e Atabaque', category: 'Instrumento', isMastered: true },
    { id: 'c4', name: 'Agogô e Reco-reco', category: 'Instrumento', isMastered: false }
  ]);

  const selectedStudent = STUDENTS_DATA.find(s => s.id === selectedStudentId) || STUDENTS_DATA[0];

  const handleToggleJudo = (id: string) => {
    setJudoTechniques(prev =>
      prev.map(t => (t.id === id ? { ...t, isMastered: !t.isMastered } : t))
    );
  };

  const handleToggleCapoeira = (id: string) => {
    setCapoeiraInstruments(prev =>
      prev.map(t => (t.id === id ? { ...t, isMastered: !t.isMastered } : t))
    );
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccessMessage(true);
    setTimeout(() => setIsSuccessMessage(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Mural de Avaliações Técnicas
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Critérios e métricas de desempenho específicos por arte marcial (Kata/Kumite, Nage-waza, Sparring, Instrumentos).
          </p>
        </div>
      </div>

      {/* Barra de Seleção: Atleta e Modalidade */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">Selecionar Atleta:</label>
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
          >
            {STUDENTS_DATA.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.modalities.map(m => m.modalityId.toUpperCase()).join(', ')})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">
            Modalidade da Avaliação Técnica:
          </label>
          <select
            value={activeModalityId}
            onChange={e => setActiveModalityId(e.target.value as ModalityId)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-bold text-amber-400 focus:outline-none focus:border-amber-500"
          >
            {MODALITIES_DATA.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.tagline})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Formulário Dinâmico por Modalidade */}
      <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <span className="text-xs uppercase font-mono text-amber-400 font-bold">
              Formulário Específico da Modalidade:
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              Avaliação Técnica: {MODALITIES_DATA.find(m => m.id === activeModalityId)?.name}
            </h3>
            <p className="text-xs text-zinc-400">Atleta sob avaliação: {selectedStudent.name}</p>
          </div>

          <BeltRenderer
            modalityId={activeModalityId}
            rankName={
              selectedStudent.modalities.find(m => m.modalityId === activeModalityId)?.currentRank ||
              'Nível Básico'
            }
            degrees={selectedStudent.modalities.find(m => m.modalityId === activeModalityId)?.degrees}
            compact
          />
        </div>

        <form onSubmit={handleSaveEvaluation} className="space-y-6 text-xs">
          {/* 1. Brazilian Jiu-Jitsu */}
          {activeModalityId === 'bjj' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-950/20 border border-blue-500/30 rounded-lg text-blue-300">
                Regras BJJ: Avaliação de passagem de guarda, finalizações e indicação de até 4 graus na faixa.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Passagem de Guarda (0 a 10)</label>
                  <input
                    type="number"
                    defaultValue={9.0}
                    step="0.5"
                    max="10"
                    min="0"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Finalizações & Raspagens (0 a 10)</label>
                  <input
                    type="number"
                    defaultValue={8.5}
                    step="0.5"
                    max="10"
                    min="0"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Grau Sugerido na Faixa</label>
                  <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono">
                    <option value="1">1º Grau</option>
                    <option value="2">2º Grau</option>
                    <option value="3">3º Grau</option>
                    <option value="4" selected>4º Grau (Pronto para Faixa)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. Muay Thai */}
          {activeModalityId === 'muay_thai' && (
            <div className="space-y-4">
              <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-red-300">
                Regras Muay Thai: Acompanhamento de rounds de sparring em ringue, corte de peso e clinch.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Rounds de Sparring Realizados</label>
                  <input
                    type="number"
                    defaultValue={8}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Pesagem Aferida no Dia (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    defaultValue={selectedStudent.currentWeightKg}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Equipamentos de Proteção</label>
                  <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white">
                    <option>Caneleira + Luvas 16oz + Bucal (Completo)</option>
                    <option>Incompleto</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 3. Karatê */}
          {activeModalityId === 'karate' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg text-amber-300">
                Regras Karatê: Avaliação segmentada por Kata (formas tradicionais) e Kumite (combate).
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Estilo Marcial</label>
                  <input
                    type="text"
                    defaultValue="Shotokan"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Nota de Kata (0 a 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    defaultValue={8.8}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Nota de Kumite (0 a 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    defaultValue={8.2}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Judô */}
          {activeModalityId === 'judo' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-emerald-300">
                Regras Judô: Checklist do sistema Gokyo (Nage-waza / Katame-waza) e filiação junto à CBJ.
              </div>
              <TechniqueChecklist
                title="Técnicas Dominadas pelo Aluno (Gokyo no Waza)"
                subtitle="Clique para marcar ou desmarcar golpes de projeção e imobilizações"
                techniques={judoTechniques}
                onToggle={handleToggleJudo}
              />
            </div>
          )}

          {/* 5. Capoeira */}
          {activeModalityId === 'capoeira' && (
            <div className="space-y-4">
              <div className="p-3 bg-yellow-950/20 border border-yellow-500/30 rounded-lg text-yellow-300">
                Regras Capoeira: Domínio musical de instrumentos na roda e fundamentos por estilo.
              </div>
              <TechniqueChecklist
                title="Domínio de Instrumentos e Musicalidade"
                subtitle="Marque os instrumentos dominados pelo capoeirista para o próximo batizado"
                techniques={capoeiraInstruments}
                onToggle={handleToggleCapoeira}
              />
            </div>
          )}

          {/* 6. Boxe */}
          {activeModalityId === 'boxing' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-lg text-purple-300">
                Regras Boxe: Sem faixas. Evolução contínua por categoria de peso oficial e tempo de ringue.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Pesagem Aferida (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    defaultValue={selectedStudent.currentWeightKg}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Categoria de Peso</label>
                  <input
                    type="text"
                    defaultValue={selectedStudent.weightCategory || 'Meio-Médio'}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Minutagem em Sparring (Ringue)</label>
                  <input
                    type="number"
                    defaultValue={180}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Parecer do Mestre */}
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Parecer Técnico do Mestre / Observações:
            </label>
            <textarea
              rows={3}
              defaultValue="Atleta demonstrou excelente postura, tempo de reação refinado e disciplina nos treinamentos coletivos."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          {isSuccessMessage && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Avaliação técnica registrada na ficha do atleta com sucesso!
              </span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition shadow-md shadow-amber-500/10 cursor-pointer"
            >
              Gravar Avaliação Técnica
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

