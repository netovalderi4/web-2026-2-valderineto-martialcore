import React, { useState } from 'react';
import type { ModalityId, Invoice } from '../../types/martial';
import { PLANS_DATA, INVOICES_DATA } from '../../mock/martialData';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Tag,
  FileText,
  Plus
} from 'lucide-react';

interface FinanceManagementProps {
  selectedModality: ModalityId | 'all';
}

export const FinanceManagement: React.FC<FinanceManagementProps> = ({ selectedModality }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES_DATA);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pago' | 'pendente' | 'atrasado'>('all');

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === invoiceId
          ? { ...inv, status: 'pago', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: 'PIX' }
          : inv
      )
    );
  };

  const totalPaid = invoices
    .filter(i => i.status === 'pago')
    .reduce((acc, i) => acc + i.amount, 0);

  const totalPending = invoices
    .filter(i => i.status === 'pendente')
    .reduce((acc, i) => acc + i.amount, 0);

  const totalOverdue = invoices
    .filter(i => i.status === 'atrasado')
    .reduce((acc, i) => acc + i.amount, 0);

  const filteredInvoices = invoices.filter(inv => {
    if (statusFilter === 'all') return true;
    return inv.status === statusFilter;
  });

  const displayedPlans = PLANS_DATA.filter(p =>
    selectedModality === 'all' || p.modalitiesIncluded.includes(selectedModality)
  );

  return (
    <div className="space-y-6">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Gestão Financeira & Planos
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Controle de mensalidades, planos individuais vs pacotes multi-artes e adimplência do centro de treinamento.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Modal de criação de plano customizado!')}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition shadow-md shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Plano</span>
        </button>
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Receita Liquidada (Mês)</span>
            <div className="w-8 h-8 rounded bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-emerald-400 font-medium block mt-1">
            Pagamentos confirmados via PIX/Cartão
          </span>
        </div>

        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">A Vencer (Pendente)</span>
            <div className="w-8 h-8 rounded bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-zinc-400 block mt-1">
            Faturas dentro do prazo de vencimento
          </span>
        </div>

        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Inadimplência (Atrasado)</span>
            <div className="w-8 h-8 rounded bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-red-400 mt-2">
            R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-red-400 block mt-1">
            Ações de cobrança recomendadas
          </span>
        </div>
      </div>

      {/* Catálogo de Planos (Individual vs Multi-Artes) */}
      <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Modelos de Planos Vigentes</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Diferenciação clara entre matrícula individual e pacotes combinados multi-modalidades.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedPlans.map(plan => (
            <div
              key={plan.id}
              className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                plan.type === 'multi_artes'
                  ? 'bg-gradient-to-b from-amber-500/10 via-zinc-950 to-zinc-950 border-amber-500/40'
                  : 'bg-zinc-950 border-zinc-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      plan.type === 'multi_artes'
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {plan.type === 'multi_artes' ? 'Combo Multi-Artes' : 'Individual'}
                  </span>

                  {plan.badge && (
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-white text-sm leading-snug">{plan.name}</h4>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{plan.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-baseline justify-between">
                <span className="text-xs text-zinc-400">Valor mensal:</span>
                <span className="text-lg font-black text-amber-400 font-mono">
                  R$ {plan.priceMonthly.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela de Faturas e Histórico de Pagamentos */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden shadow">
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Lançamentos & Histórico de Mensalidades</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Acompanhamento de liquidação e recibos dos atletas.
            </p>
          </div>

          {/* Filtro de Status */}
          <div className="flex items-center gap-1.5">
            {(['all', 'pago', 'pendente', 'atrasado'] as const).map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition cursor-pointer ${
                  statusFilter === status
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {status === 'all' ? 'Todas as Faturas' : status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/70 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Atleta</th>
                <th className="py-3 px-4">Plano Vinculado</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Status & Pagamento</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-3.5 px-4 font-bold text-white">{inv.studentName}</td>
                  <td className="py-3.5 px-4 text-zinc-300">{inv.planName}</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300">
                    {new Date(inv.dueDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    R$ {inv.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    {inv.status === 'pago' && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Pago via {inv.paymentMethod}</span>
                      </div>
                    )}
                    {inv.status === 'pendente' && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>Aguardando Pagamento</span>
                      </div>
                    )}
                    {inv.status === 'atrasado' && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-semibold">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Vencido / Cobrar</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {inv.status !== 'pago' ? (
                      <button
                        type="button"
                        onClick={() => handleMarkAsPaid(inv.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow cursor-pointer"
                      >
                        Confirmar PIX
                      </button>
                    ) : (
                      <span className="text-zinc-500 font-mono text-[11px]">Baixado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

