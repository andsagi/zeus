import React from 'react';
import { Globe, User, Palette, Shield, Info } from 'lucide-react';
import { useUser } from '../lib/UserContext';

export const SettingsView = () => {
  const { userData, updateUserData } = useUser();

  const handleLanguage = (lang: 'pt' | 'en') => {
    updateUserData({ language: lang });
  };

  const handleTheme = (theme: 'light' | 'dark') => {
    updateUserData({ theme });
  };

  const handleSpec = (spec: string) => {
    updateUserData({ specialization: spec });
  };

  return (
    <div className="p-10 max-w-2xl mx-auto space-y-12 animate-in slide-in-from-bottom-5 duration-700">
      <header>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          {userData?.language === 'pt' ? 'Configurações do Zeus' : 'Zeus Settings'}
        </h1>
        <p className="text-gray-500 text-sm">
          {userData?.language === 'pt' 
            ? 'Personalize sua experiência e a inteligência do seu assistente.' 
            : 'Customize your experience and your assistant\'s intelligence.'}
        </p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
          <Globe className="w-5 h-5 text-brand-orange" />
          <h2 className="font-display font-medium text-lg text-white">Idioma / Language</h2>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleLanguage('pt')}
            className={`flex-1 p-4 rounded-2xl border transition-all text-center ${userData?.language === 'pt' ? 'bg-brand-orange border-brand-orange text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}
          >
            Português (Brasil)
          </button>
          <button 
            onClick={() => handleLanguage('en')}
            className={`flex-1 p-4 rounded-2xl border transition-all text-center ${userData?.language === 'en' ? 'bg-brand-orange border-brand-orange text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}
          >
            English (Global)
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
          <User className="w-5 h-5 text-brand-orange" />
          <h2 className="font-display font-medium text-lg text-white">
            {userData?.language === 'pt' ? 'Especialização IA' : 'AI Specialization'}
          </h2>
        </div>
        <div className="space-y-3">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-4">
            {userData?.language === 'pt' ? 'O Zeus se tornará um expert em:' : 'Zeus will become an expert in:'}
          </p>
          <input 
            type="text" 
            placeholder="Ex: Engenheiro Civil, Advogado, Designer..."
            value={userData?.specialization}
            onChange={(e) => handleSpec(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-all"
          />
          <div className="p-4 bg-brand-blue/20 rounded-xl border border-brand-blue/30 flex gap-4">
            <Info className="w-5 h-5 text-brand-orange shrink-0" />
            <p className="text-xs text-brand-blue-400 text-gray-400 italic">
               {userData?.language === 'pt' 
                 ? 'Sua especialização altera como o Zeus sugere soluções e lembra dos contextos em suas notas e conversas.' 
                 : 'Your specialization changes how Zeus suggests solutions and remembers contexts in your notes and chats.'}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
          <Palette className="w-5 h-5 text-brand-orange" />
          <h2 className="font-display font-medium text-lg text-white">Interface</h2>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleTheme('dark')}
            className={`flex-1 p-3 rounded-xl border transition-all ${userData?.theme === 'dark' ? 'bg-white/10 border-brand-orange text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}
          >
            Dark Mode
          </button>
          <button 
            onClick={() => handleTheme('light')}
            className={`flex-1 p-3 rounded-xl border transition-all ${userData?.theme === 'light' ? 'bg-white/10 border-brand-orange text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}
          >
             Light Mode
          </button>
        </div>
      </section>

      <section className="p-8 border border-white/5 rounded-3xl bg-[radial-gradient(circle_at_top_right,rgba(255,133,27,0.1),transparent)]">
         <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-brand-orange" />
            <span className="bg-brand-orange/20 text-brand-orange px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Premium Trial</span>
         </div>
         <h3 className="text-xl font-display font-bold text-white">Status da Assinatura</h3>
         <p className="text-sm text-gray-500 mt-2">Você está no período de gratuidade de 60 dias.</p>
         <button className="mt-6 w-full bg-brand-orange text-white py-3 rounded-2xl font-bold hover:opacity-90 transition-all">
            GERENCIAR PLANO
         </button>
      </section>
    </div>
  );
};
