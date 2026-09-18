import React, { useState } from 'react';
import type { ModalityMetadata } from '../../types/martial';
import { MODALITIES_DATA } from '../../mock/martialData';
import { MartialIcon } from '../../components/martial/MartialIcon';
import { useMartialTheme } from '../../context/MartialThemeContext';
import {
  Plus,
  CheckCircle2,
  Info,
  Clock,
  Award
} from 'lucide-react';

export const ModalitiesSettings: React.FC = () => {
  const { accentColor } = useMartialTheme();
  const [modalities] = useState<ModalityMetadata[]>(MODALITIES_DATA);
  const [selectedModality, setSelectedModality] = useState<ModalityMetadata>(MODALITIES_DATA[0]);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-7">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Camada de Metadados das Modalidades
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Princípio de Arquitetura: Extensibilidade orientada a metadados. Regras de graduação e avaliação isoladas do núcleo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Parâmetro cadastral: Novas modalidades (ex: Taekwondo, Sambo, Krav Maga) podem ser adicionadas via metadados no banco sem alterar o núcleo de autenticação ou financeiro!')}
          className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white font-bold text-xs rounded-xl transition border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-500" />
          <span>Cadastrar Nova Modalidade</span>
        </button>
      </div>

      {/* Banner Explicativo Arquitetural */}
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-blue-700 dark:text-blue-200">
            Separação: Núcleo do Sistema vs Camada Configurável
          </p>
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
            O núcleo do MartialCore (presenças, autenticação, financeiro e cadastros) não conhece regras particulares de nenhuma luta. Quando o usuário seleciona uma arte marcial, os metadados abaixo são interpretados em tempo de execução para customizar a interface, carências e formulários técnicos.
          </p>
        </div>
      </div>

      {/* Grid: Lista de Modalidades à esquerda e Editor de Metadados à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seletor da Modalidade */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 font-bold block px-1">
            Modalidades Cadastradas ({modalities.length})
          </span>

          <div className="space-y-2">
            {modalities.map(m => {
              const isSelected = selectedModality.id === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModality(m)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between shadow-xs ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-900 border-amber-500 shadow-sm'
                      : 'bg-white/60 dark:bg-zinc-950/70 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div style={{ color: m.accentColor }}>
                      <MartialIcon modalityId={m.id} size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white text-sm">{m.name}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{m.graduationType}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    {m.defaultTimeRequirementMonths}m carência
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor de Metadados da Modalidade Selecionada */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-black border shadow-xs"
                style={{
                  backgroundColor: `${selectedModality.accentColor}15`,
                  borderColor: `${selectedModality.accentColor}30`,
                  color: selectedModality.accentColor
                }}
              >
                <MartialIcon modalityId={selectedModality.id} size={20} />
              </div>
              <div>
                <h3 className="font-black text-zinc-900 dark:text-white text-lg">{selectedModality.name}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{selectedModality.tagline}</p>
              </div>
            </div>

            <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-amber-600 dark:text-amber-400 border border-zinc-200 dark:border-zinc-700 font-bold">
              ID: {selectedModality.id}
            </span>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Esquema de Graduação (Enum)
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedModality.graduationType}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-500 dark:text-zinc-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Cor Temática de Destaque</label>
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-xl border border-zinc-300 dark:border-zinc-700 shrink-0 shadow-xs"
                    style={{ backgroundColor: selectedModality.accentColor }}
                  />
                  <input
                    type="text"
                    defaultValue={selectedModality.accentColor}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Carência Mínima Padrão (Meses)
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <input
                    type="number"
                    defaultValue={selectedModality.defaultTimeRequirementMonths}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Aulas Mínimas para Promoção
                </label>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <input
                    type="number"
                    defaultValue={selectedModality.minClassesForPromotion}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                Regras Específicas Interpretadas pelo Núcleo
              </label>
              <div className="space-y-2 p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                {selectedModality.specificRules.map((r, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {isSavedNotice && (
              <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                <span>Metadados atualizados com sucesso no esquema relacional!</span>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                style={{ backgroundColor: accentColor }}
                className="px-5 py-2.5 text-white font-bold rounded-xl text-xs transition shadow-sm hover:opacity-90 cursor-pointer"
              >
                Salvar Parâmetros de {selectedModality.name}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

