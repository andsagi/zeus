import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Shield, Cpu, Zap, Fingerprint } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

export const Login = () => {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    // Check if device supports platform authenticator (Biometrics/FaceID)
    const checkBiometrics = async () => {
      if (window.PublicKeyCredential && 
          typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
        const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setIsBiometricAvailable(available);
      }
    };
    checkBiometrics();
  }, []);

  const handleBiometricLogin = async () => {
    try {
      // In a full production app, this would query your backend for a challenge.
      // Here we trigger the native biometric prompt using a dummy passkey challenge to demonstrate the flow.
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      
      await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          rpId: window.location.hostname,
          userVerification: "required",
        }
      });
      // If success, we would exchange the response for an auth token.
      alert('Biometria reconhecida! Para o primeiro acesso neste dispositivo, por favor, vincule sua conta Google.');
      signInWithGoogle();
    } catch (error) {
      console.log('Biometric auth cancelled or failed', error);
      // Fallback
      signInWithGoogle();
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center p-6 bg-[grid-white-5] relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10 text-center"
      >
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="w-20 h-20 bg-black border border-blue-900/50 rounded-[2rem] flex items-center justify-center relative overflow-hidden shadow-2xl">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               >
                 <Zap className="w-10 h-10 text-blue-400 fill-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
               </motion.div>
               <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-blue-400/10 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        <h1 className="text-5xl font-display font-black text-white tracking-tight mb-4">
          ZEUS
        </h1>
        <p className="text-gray-400 text-lg mb-12 font-medium">
          Seu assistente de produtividade definitivo, alimentado por inteligência artificial.
        </p>

        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
            <Cpu className="w-6 h-6 text-blue-400" />
            <div>
              <h4 className="text-white font-bold text-sm">IA Especializada</h4>
              <p className="text-gray-500 text-xs">Adaptada à sua profissão e necessidades reais.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
            <Shield className="w-6 h-6 text-blue-400" />
            <div>
              <h4 className="text-white font-bold text-sm">Privacidade Total</h4>
              <p className="text-gray-500 text-xs">Dados criptografados e filtros de segurança avançados.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl active:scale-95 shadow-blue-500/20"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            ENTRAR COM CONTA GOOGLE
          </button>

          {isBiometricAvailable && (
            <button
              onClick={handleBiometricLogin}
              className="w-full bg-slate-900 border border-slate-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl active:scale-95"
            >
              <Fingerprint className="w-6 h-6 text-blue-400" />
              ACESSAR COM BIOMETRIA / FACE ID
            </button>
          )}
        </div>

        <p className="mt-8 text-xs text-gray-600 uppercase tracking-widest font-black">
          PRIMEIROS 60 DIAS TOTALMENTE GRATUITOS
        </p>
      </motion.div>
      
      <div className="absolute bottom-8 text-center">
        <div className="flex items-center gap-2 justify-center text-gray-500 text-xs mb-2">
          <Zap className="w-4 h-4 text-blue-500" />
          <span>POTENCIALIZADO POR GEMINI 3 FLASH</span>
        </div>
        <p className="text-gray-700 text-[10px] uppercase font-bold tracking-tighter">
          ZEUS INC. © 2026 • TODOS OS DIREITOS RESERVADOS
        </p>
      </div>
    </div>
  );
};
