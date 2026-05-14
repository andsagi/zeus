import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  TableProperties, 
  Settings, 
  MapPin, 
  Calendar, 
  LogOut,
  ChevronRight,
  Database,
  Plus,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { useUser } from '../lib/UserContext';
import { auth } from '../lib/firebase';

interface SidebarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView }) => {
  const { userData } = useUser();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: userData?.language === 'pt' ? 'Painel' : 'Dashboard' },
    { id: 'tables', icon: TableProperties, label: userData?.language === 'pt' ? 'Tabelas IA' : 'AI Tables' },
    { id: 'calendar', icon: Calendar, label: userData?.language === 'pt' ? 'Calendário' : 'Calendar' },
    { id: 'notes', icon: FileText, label: userData?.language === 'pt' ? 'Notas' : 'Notes' },
    { id: 'places', icon: MapPin, label: userData?.language === 'pt' ? 'Lugares' : 'Places' },
    { id: 'settings', icon: Settings, label: userData?.language === 'pt' ? 'Configurações' : 'Settings' },
  ];

  return (
    <div className="w-64 h-full bg-brand-blue border-r border-slate-800 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="relative group cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="w-10 h-10 bg-black border border-blue-900/50 rounded-xl flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.3)]">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               >
                 <Zap className="w-6 h-6 text-blue-400 fill-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
               </motion.div>
               <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-blue-400/10 to-transparent pointer-events-none"></div>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white leading-none">
              ZEUS
            </h1>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 ml-2">
            {userData?.language === 'pt' ? 'Principal' : 'Main'}
          </div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm ${
                currentView === item.id 
                  ? 'bg-slate-800/50 text-blue-400' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          
          <div className="pt-6 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 ml-2">
            {userData?.language === 'pt' ? 'Inteligência' : 'Intelligence'}
          </div>
          <div className="p-3 bg-brand-black border border-slate-800 rounded-lg">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">
              {userData?.language === 'pt' ? 'Especialização Ativa:' : 'Active Specialization:'}
            </div>
            <div className="text-sm text-white font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {userData?.specialization || 'Personal Assistant'}
            </div>
          </div>
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
            {userData?.photoURL ? (
              <img src={userData.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-slate-700" />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-xs font-bold text-white truncate">{userData?.displayName || 'User'}</div>
            <div className="text-[10px] text-slate-500 truncate">{userData?.email}</div>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
          <div className="flex gap-2">
            <button 
              onClick={() => userData && onNavigate('settings')}
              className={`hover:text-white transition-colors ${userData?.language === 'pt' ? 'text-blue-400' : ''}`}
            >
              PT
            </button>
            <span>|</span>
            <button 
              onClick={() => userData && onNavigate('settings')}
              className={`hover:text-white transition-colors ${userData?.language === 'en' ? 'text-blue-400' : ''}`}
            >
              EN
            </button>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="hover:text-red-500 transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};
