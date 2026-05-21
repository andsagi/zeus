import React, { useState } from 'react';
import { Globe, User, Palette, Shield, Info, Camera, FileText, Lock, ChevronRight, Zap, Download, HardDrive, Smartphone, AppWindow, CheckCircle2, Share2 } from 'lucide-react';
import { useUser } from '../lib/UserContext';
import { motion } from 'motion/react';

export const SettingsView = () => {
  const { userData, updateUserData } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'legal' | 'backup'>('profile');
  const [showCheckout, setShowCheckout] = useState(false);

  const handleLanguage = (lang: 'pt' | 'en') => {
    updateUserData({ language: lang });
  };

  const handleTheme = (theme: 'light' | 'dark') => {
    updateUserData({ theme });
  };

  const handleUpdate = (field: string, value: string) => {
    updateUserData({ [field]: value });
  };

  const plans = [
    { id: 'monthly', name: 'Mensal', price: '39,90', period: 'mês' },
    { id: 'semiannual', name: 'Semestral', price: '180,00', period: '6 meses' },
    { id: 'annual', name: 'Anual', price: '300,00', period: 'ano' },
  ];

  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1TWv5C00Wff06ScphJUNTyGW', 
        }),
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);
      
      window.location.href = url;
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
      alert('Erro ao processar pagamento. Verifique se a STRIPE_SECRET_KEY está configurada nos Secrets.');
    }
  };

  const downloadJSONBackup = () => {
    const backupData = {
      appName: "Zeus-IA-Profissional",
      exportedAt: new Date().toISOString(),
      userProfile: userData,
      systemConfig: {
        language: userData?.language || 'pt',
        theme: userData?.theme || 'dark',
        version: "1.0.2"
      }
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zeus_backup_dados_${userData?.displayName?.replace(/\s+/g, '_') || 'usuario'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadInstructions = () => {
    const a = document.createElement('a');
    a.href = '/backup_instructions.txt';
    a.download = 'Instrucoes_Lancamento_Zeus.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isSuccess = new URLSearchParams(window.location.search).get('success') === 'true';
  const isCanceled = new URLSearchParams(window.location.search).get('canceled') === 'true';

  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-700">
      {isSuccess && (
        <div className="bg-green-500/20 border border-green-500 rounded-2xl p-4 text-green-400 text-sm font-bold animate-bounce">
          ✓ Pagamento realizado com sucesso! Bem-vindo ao Zeus Elite.
        </div>
      )}
      {isCanceled && (
        <div className="bg-red-500/20 border border-red-500 rounded-2xl p-4 text-red-400 text-sm font-bold">
          ! O pagamento foi cancelado. Se precisar de ajuda, entre em contato.
        </div>
      )}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowCheckout(false)}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-md bg-brand-blue border border-blue-500/30 rounded-3xl p-8 relative z-10 shadow-[0_0_100px_rgba(59,130,246,0.2)]"
          >
             <div className="w-16 h-16 bg-black border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <Zap className="w-8 h-8 text-blue-400 fill-blue-400 animate-pulse" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2 italic">Zeus Elite</h2>
             <p className="text-slate-400 text-sm mb-8 leading-relaxed">
               Você está prestes a desbloquear o potencial máximo da sua IA Profissional.
               Acesso a tabelas avançadas, relatórios geo-espaciais e inteligência ilimitada.
             </p>
             
             <div className="space-y-3 mb-8">
                {plans.map((plan) => (
                  <button 
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all ${selectedPlan.id === plan.id ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-slate-900 border-white/5 hover:border-white/20'}`}
                  >
                    <span className={`text-sm font-bold ${selectedPlan.id === plan.id ? 'text-white' : 'text-slate-400'}`}>{userData?.language === 'pt' ? plan.name : plan.id.toUpperCase()}</span>
                    <span className="text-sm font-mono text-blue-400 font-bold">R$ {plan.price}</span>
                  </button>
                ))}
                <div className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-black mt-4">
                   Cobrança única por período. Cancele quando quiser.
                </div>
             </div>

             <button 
               onClick={handleSubscribe}
               className="w-full bg-blue-600 py-4 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl active:scale-95 shadow-blue-500/20"
             >
                PROSSEGUIR PARA PAGAMENTO SEGURO
             </button>
             <button 
               onClick={() => setShowCheckout(false)}
               className="w-full mt-4 text-xs font-bold text-slate-600 hover:text-white transition-colors"
             >
                CANCELAR
             </button>
          </motion.div>
        </div>
      )}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {userData?.language === 'pt' ? 'Configurações do Zeus' : 'Zeus Settings'}
          </h1>
          <p className="text-slate-500 text-sm">
            {userData?.language === 'pt' 
              ? 'Personalize sua experiência e a inteligência do seu assistente.' 
              : 'Customize your experience and your assistant\'s intelligence.'}
          </p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            {userData?.language === 'pt' ? 'PERFIL' : 'PROFILE'}
          </button>
          <button 
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'appearance' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            {userData?.language === 'pt' ? 'SISTEMA' : 'SYSTEM'}
          </button>
          <button 
            onClick={() => setActiveTab('legal')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'legal' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            {userData?.language === 'pt' ? 'LEGAL' : 'LEGAL'}
          </button>
          <button 
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'backup' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            {userData?.language === 'pt' ? 'LANÇAMENTO' : 'LAUNCH'}
          </button>
        </div>
      </header>

      {activeTab === 'profile' && (
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-blue-500/20 shadow-2xl">
                {userData?.photoURL ? (
                  <img 
                    src={userData.photoURL} 
                    alt={`Foto de perfil de ${userData.displayName || 'Usuário'}`} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <User className="w-12 h-12 text-slate-600" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl cursor-pointer hover:scale-110 transition-transform shadow-xl">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" className="hidden" />
              </label>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 block">URL da Foto de Perfil</label>
                <input 
                  type="text"
                  value={userData?.photoURL || ''}
                  onChange={(e) => handleUpdate('photoURL', e.target.value)}
                  placeholder="https://exemplo.com/sua-foto.jpg"
                  className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 block">Nome Completo</label>
                  <input 
                    type="text"
                    value={userData?.displayName || ''}
                    onChange={(e) => handleUpdate('displayName', e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 block">Especialidade / Profissão</label>
                  <input 
                    type="text"
                    value={userData?.specialization || ''}
                    onChange={(e) => handleUpdate('specialization', e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand-blue/10 border border-blue-500/20 p-6 rounded-3xl flex gap-4">
             <div className="w-10 h-10 bg-black border border-blue-500/30 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-blue-400 fill-blue-400" />
             </div>
             <div>
                <h4 className="text-white font-bold text-sm">Foco Profissional do Zeus</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Ao definir sua especialidade, o Zeus prioriza buscas técnicas, vocabulário específico e sugere automações de mercado. 
                </p>
             </div>
          </div>
        </motion.section>
      )}

      {activeTab === 'appearance' && (
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5 text-blue-500" />
                <h2 className="font-display font-medium text-lg text-white">Visual</h2>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleTheme('dark')}
                  className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${userData?.theme === 'dark' ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-slate-800/30 border-slate-700 text-slate-500'}`}
                >
                  <div className="w-full h-8 bg-black rounded border border-white/10" />
                  <span className="text-xs font-bold tracking-widest uppercase">Escuro</span>
                </button>
                <button 
                  onClick={() => handleTheme('light')}
                  className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${userData?.theme === 'light' ? 'bg-white border-blue-600 text-black' : 'bg-slate-800/30 border-slate-700 text-slate-500'}`}
                >
                  <div className="w-full h-8 bg-gray-100 rounded border border-black/10" />
                  <span className="text-xs font-bold tracking-widest uppercase">Claro</span>
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-5 h-5 text-blue-500" />
                <h2 className="font-display font-medium text-lg text-white">Interface</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleLanguage('pt')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${userData?.language === 'pt' ? 'bg-blue-600 text-white' : 'bg-slate-800/30 border-slate-700 text-slate-400'}`}
                >
                  Português
                </button>
                <button 
                  onClick={() => handleLanguage('en')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${userData?.language === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-800/30 border-slate-700 text-slate-400'}`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {activeTab === 'legal' && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <div className="p-4 bg-brand-blue/30 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Políticas & IA</span>
              </div>
              <span className="text-[10px] text-slate-500">Versão 1.0.2 - Zeus Tech</span>
            </div>
            
            <div className="p-6 space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <h5 className="text-sm font-bold text-white">Termos de Uso</h5>
                    <p className="text-[10px] text-slate-500">Regras de conduta e uso da IA Zeus.</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-all" />
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-blue-500" />
                  <div>
                    <h5 className="text-sm font-bold text-white">Política de Privacidade (LGPD)</h5>
                    <p className="text-[10px] text-slate-500">Proteção de dados.</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-all" />
              </button>
            </div>
          </div>
        </motion.section>
      )}

      {activeTab === 'backup' && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Top Banner: Multiplatform Availability */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[80px] pointer-events-none rounded-full" />
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Disponível em Android, iOS e Web</h3>
                  <p className="text-xs text-slate-400 mt-1">O Zeus está pré-configurado com recursos PWA de última geração (Progressive Web Application).</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-[10px] uppercase font-black tracking-wider shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <CheckCircle2 className="w-3.5 h-3.5" /> PWA Ativo
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 border-t border-white/5 pt-6">
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-1">01. Web App</span>
                  <p className="text-xs text-slate-300">Acesse de qualquer navegador no PC ou celular com sincronização em nuvem Firestore garantida.</p>
                </div>
              </div>
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-1">02. Instalação iOS</span>
                  <p className="text-xs text-slate-300">Pelo Safari, aperte o botão "Compartilhar" e adicione à Tela Inicial para abrir o Zeus em fullscreen.</p>
                </div>
              </div>
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-1">03. Instalação Android</span>
                  <p className="text-xs text-slate-300">Pelo Chrome ou Edge, um aviso surgirá automaticamente na tela para instalar o app instalado.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Area: Backup & Publishing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Baixar Backup de Dados */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                    <HardDrive className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-white font-bold text-sm">Backup de Banco de Dados</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gere um arquivo de backup seguro (.JSON) contendo todas as variáveis de perfil, especialidade profissional e configurações de sistema do seu Zeus localmente.
                </p>
              </div>
              <button 
                onClick={downloadJSONBackup}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> EXPORTAR DADOS (.JSON)
              </button>
            </div>

            {/* Card 2: Instruções de Lançamento / Capacitor Compilation */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-white font-bold text-sm">Guia de Lançamento & Lojas</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Baixe o roteiro estruturado com os comandos prontos para envelopar este projeto com Capacitor e gerar pacotes nativos para Google Play Store e Apple App Store.
                </p>
              </div>
              <button 
                onClick={downloadInstructions}
                className="w-full mt-6 bg-white hover:bg-slate-200 text-black font-black uppercase tracking-widest text-xs py-3.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> BAIXAR MANUAL DE PUBLICAÇÃO
              </button>
            </div>

          </div>

          {/* Backup do Fonte Completo do Projeto */}
          <div className="bg-blue-900/10 border border-blue-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-lg">
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <AppWindow className="w-4 h-4 text-blue-400" /> Backup Completo do Código Fonte (.ZIP)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Você pode exportar a programação completa deste aplicativo web full-stack, incluindo o servidor em Express e banco de dados Firebase, clicando em <b>Configurações / Exportar como ZIP</b> localizado na interface do Google AI Studio à sua direita.
              </p>
            </div>
            <div className="bg-blue-600/10 text-blue-400 border border-blue-500/20 text-xs px-4 py-2 rounded-xl shrink-0 font-bold">
              Exportar ZIP no Painel Principal ↑
            </div>
          </div>
        </motion.section>
      )}

      {/* Monetization / Subscription Widget */}
      <section className="bg-gradient-to-br from-brand-blue to-black border border-blue-500/20 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none group-hover:bg-blue-600/10 transition-all duration-1000" />
         
         <div className="relative z-10 w-full md:w-2/3">
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              {userData?.language === 'pt' ? 'Zeus para Profissionais' : 'Zeus for Professionals'}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Desbloqueie o potencial máximo com o **Plano Zeus Elite**.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <button 
                onClick={() => setShowCheckout(true)}
                className="px-8 py-3 bg-white text-black text-xs font-black rounded-xl hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest shadow-xl active:scale-95"
              >
                ASSINAR ELITE
              </button>
            </div>
         </div>
         
         <div className="text-center md:text-right relative z-10">
            <div className="text-4xl font-light text-blue-400">R$ 300,00</div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Plano Anual Sugerido</p>
         </div>
      </section>
    </div>
  );
};
