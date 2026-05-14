import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TableProperties, Plus, Search, Filter, Download, MoreHorizontal, ArrowUpDown, Zap } from 'lucide-react';
import { useUser } from '../lib/UserContext';

interface TableRow {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'completed';
  value: string;
  date: string;
}

export const TablesView = () => {
  const { userData } = useUser();
  const [rows] = useState<TableRow[]>([
    { id: '1', name: 'Sistema de Ar Condicionado - Bloco A', status: 'active', value: 'R$ 45.000', date: '14/05/2026' },
    { id: '2', name: 'Manutenção Preventiva - Elevadores', status: 'pending', value: 'R$ 12.800', date: '18/05/2026' },
    { id: '3', name: 'Projeto Estrutural - Shopping Sul', status: 'completed', value: 'R$ 150.000', date: '10/05/2026' },
    { id: '4', name: 'Auditoria de Segurança Trimestral', status: 'active', value: 'R$ 8.500', date: '20/05/2026' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/10 text-blue-500';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'completed': return 'bg-green-500/10 text-green-500';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <TableProperties className="w-5 h-5 text-brand-orange" />
            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Tabelas Inteligentes</h1>
          </div>
          <p className="text-slate-500 text-sm italic">
            {userData?.language === 'pt' 
              ? `Organização estruturada para sua especialidade: ${userData.specialization}`
              : `Structured organization for your specialization: ${userData.specialization}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white transition-all">
            <Download className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-orange text-black text-xs font-black rounded-xl hover:bg-white transition-all uppercase tracking-widest shadow-xl">
            <Plus className="w-4 h-4" />
            NOVA TABELA
          </button>
        </div>
      </header>

      <div className="bg-card-bg border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
            <input 
              type="text" 
              placeholder="Pesquisar registros..." 
              className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-brand-orange transition-all w-full md:w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/30 text-xs text-slate-400 hover:text-white transition-all border border-transparent hover:border-slate-700">
              <Filter className="w-3 h-3" />
              Filtrar
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/30 text-xs text-slate-400 hover:text-white transition-all border border-transparent hover:border-slate-700">
              <ArrowUpDown className="w-3 h-3" />
              Ordenar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/30">
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Nome do Projeto / Registro</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Valor Estimado</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Última Atualização</th>
                <th className="p-6 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors group">
                  <td className="p-6">
                    <div className="text-sm font-bold text-slate-200 group-hover:text-brand-orange transition-colors">{row.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-mono">ID: {row.id}</div>
                  </td>
                  <td className="p-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-6 text-sm font-mono text-slate-300">{row.value}</td>
                  <td className="p-6 text-xs text-slate-500 font-medium italic">{row.date}</td>
                  <td className="p-6">
                    <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-600 hover:text-white transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-900/30 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Mostrando {rows.length} de {rows.length} registros</span>
          <div className="flex gap-1">
             <button className="px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-md opacity-50 cursor-not-allowed">Anterior</button>
             <button className="px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-md opacity-50 cursor-not-allowed">Próximo</button>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/10">
         <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
           <Zap className="w-4 h-4 fill-blue-400" /> Dica do Zeus Elite
         </h3>
         <p className="text-xs text-slate-400 max-w-2xl leading-relaxed italic">
           "Notei que você tem muitos projetos como <strong>{userData?.specialization}</strong>. 
           Eu posso exportar esses dados automaticamente para um relatório de faturamento mensal se clicarmos no ícone de download acima."
         </p>
      </div>
    </div>
  );
};
