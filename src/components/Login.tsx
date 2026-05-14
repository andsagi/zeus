import React from 'react';
import { motion } from 'motion/react';
import { LogIn, Shield, Cpu, Zap } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

export const Login = () => {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-6 bg-[grid-white-5] relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10 text-center"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-brand-orange rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(255,133,27,0.3)] animate-pulse">
            <span className="text-3xl font-display font-black text-white italic">Z</span>
          </div>
        </div>

        <h1 className="text-5xl font-display font-black text-white tracking-tight mb-4">
          ZEUS <span className="text-brand-orange">APP</span>
        </h1>
        <p className="text-gray-400 text-lg mb-12 font-medium">
          Seu assistente de produtividade definitivo, alimentado por inteligência artificial.
        </p>

        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-orange/30 transition-colors">
            <Cpu className="w-6 h-6 text-brand-orange" />
            <div>
              <h4 className="text-white font-bold text-sm">IA Especializada</h4>
              <p className="text-gray-500 text-xs">Adaptada à sua profissão e necessidades reais.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-orange/30 transition-colors">
            <Shield className="w-6 h-6 text-brand-orange" />
            <div>
              <h4 className="text-white font-bold text-sm">Privacidade Total</h4>
              <p className="text-gray-500 text-xs">Dados criptografados e filtros de segurança avançados.</p>
            </div>
          </div>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-orange hover:text-white transition-all shadow-xl active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          ENTRAR COM CONTA GOOGLE
        </button>

        <p className="mt-8 text-xs text-gray-600 uppercase tracking-widest font-bold">
          PRIMEIROS 60 DIAS TOTALMENTE GRATUITOS
        </p>
      </motion.div>
      
      <div className="absolute bottom-8 text-center">
        <div className="flex items-center gap-2 justify-center text-gray-500 text-xs mb-2">
          <Zap className="w-4 h-4 text-brand-orange" />
          <span>POTENCIALIZADO POR GEMINI 3 FLASH</span>
        </div>
        <p className="text-gray-700 text-[10px] uppercase font-bold tracking-tighter">
          ZEUS INC. © 2026 • TODOS OS DIREITOS RESERVADOS
        </p>
      </div>
    </div>
  );
};
