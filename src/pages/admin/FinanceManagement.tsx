import React, { useState } from 'react';
import type { ModalityId, Invoice } from '../../types/martial';
import { PLANS_DATA, INVOICES_DATA } from '../../mock/martialData';
import { useMartialTheme } from '../../context/MartialThemeContext';
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
  const { accentColor } = useMartialTheme();
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
    <div className="space-y-7">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Gestão Financeira & Planos
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Controle de mensalidades, planos individuais vs pacotes multi-artes e adimplência do centro de treinamento.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Modal de criação de plano customizado!')}
          style={{ backgroundColor: accentColor }}
          className="px-5 py-2.5 text-white font-bold text-xs rounded-xl transition shadow-sm hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Plano</span>
        </button>
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Receita Liquidada (Mês)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white mt-2">
            R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block mt-1">
            Pagamentos confirmados via PIX/Cartão
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">A Vencer (Pendente)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white mt-2">
            R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mt-1">
            Faturas no prazo de vencimento
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Inadimplência (Atrasado)</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-2">
            R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-red-600 dark:text-red-400 block mt-1 font-medium">
            Ações de cobrança recomendadas
          </span>
        </div>
      </div>

      {/* Catálogo de Planos (Individual vs Multi-Artes) */}
      <div className="p-5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-500" />
              <span>Modelos de Planos Vigentes</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Diferenciação clara entre matrícula individual e pacotes combinados multi-modalidades.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedPlans.map(plan => (
            <div
              key={plan.id}
              className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                plan.type === 'multi_artes'
                  ? 'bg-amber-500/5 dark:bg-gradient-to-b dark:from-amber-500/10 dark:via-zinc-950 dark:to-zinc-950 border-amber-500/40'
                  : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                      plan.type === 'multi_artes'
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {plan.type === 'multi_artes' ? 'Combo Multi-Artes' : 'Individual'}
                  </span>

                  {plan.badge && (
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-zinc-900 dark:text-white text-sm leading-snug">{plan.name}</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">{plan.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-baseline justify-between">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Valor mensal:</span>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
                  R$ {plan.priceMonthly.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lançamentos & Histórico de Mensalidades */}
      <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Lançamentos & Histórico de Mensalidades</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Acompanhamento de liquidação e recibos dos atletas.
            </p>
          </div>

          {/* Filtro de Status */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {(['all', 'pago', 'pendente', 'atrasado'] as const).map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                style={statusFilter === status ? { backgroundColor: accentColor, color: '#ffffff' } : {}}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer whitespace-nowrap ${
                  statusFilter === status
                    ? 'font-bold shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {status === 'all' ? 'Todas as Faturas' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4 font-bold">Atleta</th>
                <th className="py-3.5 px-4 font-bold">Plano Vinculado</th>
                <th className="py-3.5 px-4 font-bold">Vencimento</th>
                <th className="py-3.5 px-4 font-bold">Valor</th>
                <th className="py-3.5 px-4 font-bold">Status & Pagamento</th>
                <th className="py-3.5 px-4 text-right font-bold">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition">
                  <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-white">{inv.studentName}</td>
                  <td className="py-3.5 px-4 text-zinc-700 dark:text-zinc-300">{inv.planName}</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-600 dark:text-zinc-300">
                    {new Date(inv.dueDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-white">
                    R$ {inv.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    {inv.status === 'pago' && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Pago via {inv.paymentMethod}</span>
                      </div>
                    )}
                    {inv.status === 'pendente' && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>Aguardando Pagamento</span>
                      </div>
                    )}
                    {inv.status === 'atrasado' && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[11px] font-semibold">
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
                        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow-xs cursor-pointer"
                      >
                        Confirmar PIX
                      </button>
                    ) : (
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[11px]">Baixado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-zinc-200 dark:divide-zinc-800">
          {filteredInvoices.map(inv => (
            <div key={inv.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{inv.studentName}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{inv.planName}</p>
                </div>
                <span className="text-sm font-black font-mono text-zinc-900 dark:text-white">
                  R$ {inv.amount.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-zinc-500 dark:text-zinc-400 font-mono">
                  Vencimento: {new Date(inv.dueDate).toLocaleDateString('pt-BR')}
                </span>

                {inv.status === 'pago' ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pago
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleMarkAsPaid(inv.id)}
                    className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-xl text-xs"
                  >
                    Confirmar PIX
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

