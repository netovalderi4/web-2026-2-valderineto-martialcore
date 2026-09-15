import React, { useState } from 'react';
import type { ModalityId } from '../../types/martial';
import { SCHEDULES_DATA, MODALITIES_DATA } from '../../mock/martialData';
import {
  Calendar,
  CheckCircle2,
  Sparkles,
  Send
} from 'lucide-react';

interface TrialClassBookingProps {
  selectedModality: ModalityId | 'all';
}

export const TrialClassBooking: React.FC<TrialClassBookingProps> = ({ selectedModality }) => {
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [chosenClassId, setChosenClassId] = useState(SCHEDULES_DATA[0].id);
  const [isSuccess, setIsSuccess] = useState(false);

  const trialClasses = SCHEDULES_DATA.filter(
    s => s.openForTrial && (selectedModality === 'all' || s.modalityId === selectedModality)
  );

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !whatsapp) {
      alert('Por favor, preencha seu nome e WhatsApp!');
      return;
    }
    setIsSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Portal do Visitante • Aula Experimental Gratuita</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-black">
              100% Grátis
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Escolha sua arte marcial favorita e venha treinar no tatame com mestres certificados.
          </p>
        </div>
      </div>

      {/* Grid: Formulário de Reserva à esquerda e Grade de Aulas Abertas à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Agendamento */}
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Agende seu Treino</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Não é necessário ter quimono ou luvas para a primeira aula experimental. Nós fornecemos todo o suporte!
          </p>

          <form onSubmit={handleBooking} className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Seu Nome Completo</label>
              <input
                type="text"
                placeholder="Ex: João Victor Souza"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">WhatsApp para Confirmação</label>
              <input
                type="text"
                placeholder="(84) 99999-8888"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">E-mail</label>
              <input
                type="email"
                placeholder="joao@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Turma de Interesse</label>
              <select
                value={chosenClassId}
                onChange={e => setChosenClassId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
              >
                {trialClasses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.dayOfWeek} às {c.startTime})
                  </option>
                ))}
              </select>
            </div>

            {isSuccess && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Reserva confirmada com sucesso! Enviamos os detalhes para o seu WhatsApp.
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition shadow-md shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Confirmar Minha Vaga Gratuita</span>
            </button>
          </form>
        </div>

        {/* Grade de Turmas com Vagas Experimentais */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Turmas com Vagas Abertas para Iniciantes ({trialClasses.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trialClasses.map(c => {
              const meta = MODALITIES_DATA.find(m => m.id === c.modalityId);

              return (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                        style={{
                          backgroundColor: `${meta?.accentColor}20`,
                          color: meta?.accentColor
                        }}
                      >
                        {meta?.name}
                      </span>
                      <span className="text-xs font-mono text-amber-400 font-bold">
                        {c.dayOfWeek}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm leading-snug">{c.title}</h4>
                    <p className="text-xs text-zinc-400 mt-2">
                      {c.startTime} às {c.endTime} • {c.space}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">Instrutor: {c.instructorName}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-medium">Vaga Aberta</span>
                    <button
                      type="button"
                      onClick={() => setChosenClassId(c.id)}
                      className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                    >
                      Selecionar Turma
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

