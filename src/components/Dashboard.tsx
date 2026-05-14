import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Zap,
  ArrowUpRight,
  Plus,
  Search,
  MapPin,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useUser } from '../lib/UserContext';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

export const Dashboard = () => {
  const { userData } = useUser();

  const stats = [
    { label: userData?.language === 'pt' ? 'Atividade' : 'Activity', value: '84%', icon: Zap, color: 'text-yellow-400' },
    { label: userData?.language === 'pt' ? 'Documentos' : 'Documents', value: '12', icon: FileText, color: 'text-brand-orange' },
    { label: userData?.language === 'pt' ? 'Contas' : 'Bills', value: 'R$ 1.250', icon: TrendingUp, color: 'text-green-400' },
    { label: userData?.language === 'pt' ? 'Equipe' : 'Team', value: '5', icon: Users, color: 'text-blue-400' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-light text-white mb-2">
            {userData?.language === 'pt' ? `Olá, ${userData.displayName?.split(' ')[0]}.` : `Hello, ${userData.displayName?.split(' ')[0]}.`}
          </h2>
          <p className="text-slate-400 text-sm italic">
            {userData?.language === 'pt' ? 'Bem-vindo ao seu assistente de produtividade.' : 'Welcome to your productivity assistant.'}
          </p>
        </div>
        <div className="relative group">
          <input 
            type="text" 
            placeholder={userData?.language === 'pt' ? 'Pesquisar na Web ou no Zeus...' : 'Search Web or Zeus...'} 
            className="w-full md:w-80 bg-slate-900 border border-slate-800 rounded-full px-6 py-3 text-sm text-slate-200 focus:outline-none focus:border-brand-orange transition-all placeholder:text-slate-600"
          />
          <button className="absolute right-4 top-3 text-slate-500 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Financial Card */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="lg:col-span-2 bg-card-bg border border-slate-800 rounded-2xl p-6 relative overflow-hidden"
        >
           <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-display">Controle Financeiro</h3>
              <button className="text-brand-orange text-[10px] font-bold hover:underline">
                {userData?.language === 'pt' ? '+ ADICIONAR TABELA' : '+ ADD TABLE'}
              </button>
           </div>
           
           <div className="h-40 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F27D26" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#F27D26" fill="url(#colorVal)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
           
           <div className="mt-4 flex justify-between text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              <span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SAB</span><span>DOM</span>
           </div>
        </motion.div>

        {/* Recent Notes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card-bg border border-slate-800 rounded-2xl p-6"
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6 font-display">
            {userData?.language === 'pt' ? 'Notas Recentes' : 'Recent Notes'}
          </h3>
          <ul className="space-y-4">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex gap-3 items-center group cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex-1 truncate">
                  <div className="text-sm text-slate-200 group-hover:text-white transition-colors">
                    {i === 1 ? 'Projeto Estrutura A1' : i === 2 ? 'Lista de Fornecedores' : 'Reunião com Equipe'}
                  </div>
                  <div className="text-[10px] text-slate-500 italic mt-0.5">
                    {i === 1 ? 'Há 12 min' : i === 2 ? 'Há 3 horas' : 'Ontem'}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Places Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card-bg border border-slate-800 rounded-2xl p-6"
        >
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 font-display">
             {userData?.language === 'pt' ? 'Locais Favoritos' : 'Favorite Places'}
           </h3>
           <div className="space-y-3">
             {[
               { name: 'Restaurante Fogo', dist: '2.4km' },
               { name: 'Escritório Central', dist: '0.2km' },
               { name: 'Academia Smart', dist: '5.1km' }
             ].map((place, idx) => (
               <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/30 hover:bg-slate-800/30 border border-transparent hover:border-slate-800 transition-all cursor-pointer group">
                 <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{place.name}</span>
                 <span className="text-[10px] font-bold text-brand-orange flex items-center gap-1 italic">
                   <MapPin className="w-2.5 h-2.5" /> {place.dist}
                 </span>
               </div>
             ))}
           </div>
        </motion.div>

        <div className="bg-card-bg border border-slate-800 rounded-2xl p-6">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 font-display">
             {userData?.language === 'pt' ? `Específico para ${userData.specialization}` : `Specific for ${userData.specialization}`}
           </h3>
           <div className="space-y-3">
             <div className="p-3 rounded-xl bg-brand-orange/5 border border-brand-orange/20">
               <p className="text-xs text-white font-medium">
                 {userData?.language === 'pt' 
                   ? `O Zeus sugere criar uma Tabela de Controle para seus projetos de ${userData.specialization}.`
                   : `Zeus suggests creating a Control Table for your ${userData.specialization} projects.`}
               </p>
               <button className="mt-2 text-[10px] font-bold text-brand-orange hover:underline uppercase">
                 {userData?.language === 'pt' ? 'Criar agora' : 'Create now'}
               </button>
             </div>
             <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
               <p className="text-xs text-white font-medium">
                 {userData?.language === 'pt' 
                   ? 'Análise de produtividade baseada em sua agenda semanal.'
                   : 'Productivity analysis based on your weekly schedule.'}
               </p>
             </div>
           </div>
        </div>

        {/* Subscription Upgrade Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 lg:col-span-2 bg-gradient-to-br from-slate-900 to-brand-blue border border-brand-orange/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
           <div>
             <h3 className="text-xl font-bold text-white">
               {userData?.language === 'pt' ? 'Assine o Zeus Ilimitado' : 'Subscribe to Zeus Unlimited'}
             </h3>
             <p className="text-slate-400 text-sm mt-1">
               {userData?.language === 'pt' ? 'Garanta sua produtividade com IA em tempo integral.' : 'Boost your productivity with full-time AI assistance.'}
             </p>
             <div className="flex gap-4 mt-6">
               <button className="px-6 py-2.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-brand-orange hover:text-white transition-all shadow-lg active:scale-95 uppercase tracking-widest">
                 {userData?.language === 'pt' ? 'MENSAL' : 'MONTHLY'}
               </button>
               <button className="px-6 py-2.5 border border-slate-700 text-white text-xs font-bold rounded-lg hover:border-white transition-all uppercase tracking-widest">
                 {userData?.language === 'pt' ? 'ANUAL (-20%)' : 'ANNUAL (-20%)'}
               </button>
             </div>
           </div>
           <div className="text-center md:text-right">
             <div className="text-3xl font-light text-brand-orange">R$ 49,90</div>
             <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1 font-bold">
               {userData?.language === 'pt' ? 'Custo mensal' : 'Monthly cost'}
             </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
};
