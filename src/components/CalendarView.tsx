import React from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Bell } from 'lucide-react';
import { useUser } from '../lib/UserContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

export const CalendarView = () => {
  const { userData } = useUser();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const locale = userData?.language === 'pt' ? ptBR : enUS;
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <CalendarIcon className="w-5 h-5 text-brand-orange" />
            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Cronograma Zeus</h1>
          </div>
          <p className="text-slate-500 text-sm italic">
            Gerencie seus prazos de {userData?.specialization || 'profissão'} com precisão cirúrgica.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-1 px-4 rounded-xl shadow-xl">
           <button onClick={prevMonth} className="p-2 hover:text-brand-orange transition-colors"><ChevronLeft className="w-5 h-5" /></button>
           <span className="text-sm font-black uppercase tracking-widest text-white w-40 text-center">
             {format(currentDate, 'MMMM yyyy', { locale })}
           </span>
           <button onClick={nextMonth} className="p-2 hover:text-brand-orange transition-colors"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-card-bg border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-900/50">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
              <div key={day} className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 h-[500px]">
             {/* Offset early days logic omitted for brevity in mock, showing directly days */}
             {days.map((day, idx) => (
               <div 
                 key={idx} 
                 className={`p-4 border-r border-b border-slate-800/50 relative group hover:bg-white/5 transition-all
                   ${!isSameMonth(day, currentDate) ? 'bg-black/20' : ''}`}
               >
                 <span className={`text-[10px] font-bold ${isToday(day) ? 'bg-brand-orange text-black px-2 py-0.5 rounded-sm' : 'text-slate-500'}`}>
                   {format(day, 'd')}
                 </span>
                 
                 {idx === 15 && (
                   <div className="mt-2 p-1.5 bg-brand-orange/10 border border-brand-orange/20 rounded text-[9px] font-bold text-brand-orange leading-tight truncate">
                      ENTREGA PROJETO A1
                   </div>
                 )}
                 {idx === 20 && (
                   <div className="mt-2 p-1.5 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] font-bold text-blue-500 leading-tight truncate">
                      REUNIÃO DIRETORIA
                   </div>
                 )}
               </div>
             ))}
          </div>
        </div>

        {/* Upcoming List */}
        <div className="space-y-6">
           <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center justify-between">
                Próximos Eventos
                <Plus className="w-4 h-4 text-brand-orange cursor-pointer hover:scale-125 transition-transform" />
              </h3>
              
              <div className="space-y-4">
                 {[
                   { title: 'Vencimento CREA', time: 'Em 2 dias', type: 'urgent' },
                   { title: 'Assinatura Contrato X', time: '14:30h - Hoje', type: 'meeting' },
                   { title: 'Visita Técnica Local', time: 'Amanhã', type: 'task' }
                 ].map((event, i) => (
                   <div key={i} className="flex gap-4 group cursor-pointer">
                      <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${event.type === 'urgent' ? 'bg-red-500' : 'bg-brand-orange'}`} />
                      <div>
                         <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{event.title}</p>
                         <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mt-0.5 flex items-center gap-1">
                           <Clock className="w-2.5 h-2.5" /> {event.time}
                         </p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-brand-orange p-6 rounded-3xl shadow-xl shadow-brand-orange/5">
              <Bell className="w-6 h-6 text-black mb-4 animate-bounce" />
              <h4 className="text-sm font-black text-black uppercase tracking-tight">Zeus Notifica</h4>
              <p className="text-[10px] text-black/70 font-bold mt-1 leading-relaxed">
                "Detectei que você tem 3 entregas para a próxima semana. Gostaria de otimizar seu tempo e reservar as manhãs para foco total?"
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
