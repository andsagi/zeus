import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { useUser } from './lib/UserContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';
import { Chatbot } from './components/Chatbot';
import { TrialBanner } from './components/TrialBanner';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';
import { SettingsView } from './components/SettingsView';
import { TablesView } from './components/TablesView';
import { CalendarView } from './components/CalendarView';
import { PlacesView } from './components/PlacesView';

export default function App() {
  const { user, loading, userData } = useUser();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);

  if (loading || (user && !userData)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center space-y-8 flex-col relative overflow-hidden font-sans">
        {/* Futuristic Background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 blur-[80px] rounded-full animate-pulse"></div>
        
        <div className="relative">
          <div className="relative group grayscale-0">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
            <div className="w-24 h-24 bg-black border border-blue-900/50 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               >
                 <Zap className="w-12 h-12 text-blue-400 fill-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.7)]" />
               </motion.div>
               <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-blue-400/10 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {userData?.photoURL && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -bottom-2 -right-2 z-20"
            >
              <img 
                src={userData.photoURL} 
                alt={`Avatar de ${userData.displayName || 'Usuário'}`} 
                className="w-10 h-10 rounded-xl object-cover border border-blue-500/50 shadow-2xl" 
                referrerPolicy="no-referrer" 
              />
            </motion.div>
          )}
        </div>

        <div className="text-center space-y-3 relative z-10">
          <div className="flex flex-col items-center gap-1">
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Invocando Zeus...</p>
            <div className="w-32 h-[1px] bg-linear-to-r from-transparent via-blue-500/50 to-transparent"></div>
          </div>
          {userData?.displayName && (
            <p className="text-slate-500 text-xs font-medium tracking-tight">Olá, {userData.displayName.split(' ')[0]}</p>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    if (showLogin) {
      return (
        <div className="relative">
          <button 
            onClick={() => setShowLogin(false)}
            className="fixed top-8 left-8 z-[100] text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-2"
          >
            ← Voltar para Zeus
          </button>
          <Login />
        </div>
      );
    }
    return <LandingPage onLoginClick={() => setShowLogin(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentView} />;
      case 'notes': return <Editor onNavigate={setCurrentView} />;
      case 'settings': return <SettingsView />;
      case 'tables': return <TablesView />;
      case 'calendar': return <CalendarView />;
      case 'places': return <PlacesView />;
      default: return (
        <div className="flex items-center justify-center h-full text-gray-500 italic">
          Funcionalidade "{currentView}" em desenvolvimento para a ZEUS v1.1
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen ${userData?.theme === 'light' ? 'bg-gray-50 text-black' : 'bg-brand-black text-white'} flex overflow-hidden`}>
      <Sidebar onNavigate={setCurrentView} currentView={currentView} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <TrialBanner onNavigate={setCurrentView} />
        
        <div className={`flex-1 overflow-y-auto ${userData?.subscriptionStatus === 'trial' ? 'pt-12' : ''}`}>
          {renderView()}
        </div>

        <Chatbot />
      </main>
    </div>
  );
}
