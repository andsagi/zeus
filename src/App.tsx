import React, { useState } from 'react';
import { useUser } from './lib/UserContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';
import { Chatbot } from './components/Chatbot';
import { TrialBanner } from './components/TrialBanner';
import { Login } from './components/Login';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const { user, loading, userData } = useUser();
  const [currentView, setCurrentView] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-16 h-16 bg-brand-orange rounded-2xl animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'notes': return <Editor />;
      case 'settings': return <SettingsView />;
      default: return (
        <div className="flex items-center justify-center h-full text-gray-500 italic">
          Funcionalidade "{currentView}" em desenvolvimento para a ZEUS v1.0
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen ${userData?.theme === 'light' ? 'bg-gray-50 text-black' : 'bg-brand-black text-white'} flex overflow-hidden`}>
      <Sidebar onNavigate={setCurrentView} currentView={currentView} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <TrialBanner />
        
        <div className={`flex-1 overflow-y-auto ${userData?.subscriptionStatus === 'trial' ? 'pt-12' : ''}`}>
          {renderView()}
        </div>

        <Chatbot />
      </main>
    </div>
  );
}
