import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Timer, CreditCard } from 'lucide-react';
import { differenceInDays, addDays, formatDistanceToNow } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useUser } from '../lib/UserContext';

export const TrialBanner = ({ onNavigate }: { onNavigate?: (view: string) => void }) => {
  const { userData } = useUser();
  const [isVisible, setIsVisible] = useState(true);
  const [lastClosed, setLastClosed] = useState<number | null>(null);

  useEffect(() => {
    if (!isVisible && lastClosed) {
      const timer = setInterval(() => {
        const now = Date.now();
        if (now - lastClosed > 20 * 60 * 1000) { // 20 minutes
          setIsVisible(true);
          setLastClosed(null);
        }
      }, 10000); // Check every 10s
      return () => clearInterval(timer);
    }
  }, [isVisible, lastClosed]);

  if (!userData || userData.subscriptionStatus !== 'trial') return null;

  const getTrialStartDate = () => {
    if (!userData.trialStartDate) return new Date();
    // Handle Firestore Timestamp
    if (userData.trialStartDate.toDate) {
      return userData.trialStartDate.toDate();
    }
    // Handle ISO string or other date formats
    return new Date(userData.trialStartDate);
  };

  const trialStartDate = getTrialStartDate();
  const trialEnd = addDays(trialStartDate, 60);
  const daysLeft = Math.max(0, differenceInDays(trialEnd, new Date()));
  const locale = userData.language === 'pt' ? ptBR : enUS;

  const close = () => {
    setIsVisible(false);
    setLastClosed(Date.now());
  };

  const handleUpgrade = () => {
    if (onNavigate) {
      onNavigate('settings');
      close();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="pointer-events-auto bg-black/90 backdrop-blur-3xl border border-blue-500/30 rounded-[2.5rem] p-8 max-w-md w-full shadow-[0_0_80px_rgba(59,130,246,0.2)] flex flex-col items-center text-center space-y-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center relative shadow-lg">
                <Timer className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-blue-400 text-xs font-black uppercase tracking-[0.3em]">
                {userData.language === 'pt' ? 'Acesso VIP Zeus' : 'Zeus VIP Access'}
              </h3>
              <p className="text-white text-lg font-black italic tracking-tight">
                {userData.language === 'pt' 
                  ? `VOCÊ TEM ${daysLeft} DIAS RESTANTES`
                  : `YOU HAVE ${daysLeft} DAYS REMAINING`}
              </p>
              <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">
                {userData.language === 'pt' ? 'Gratuidade ativa no período de teste' : 'Free trial period active'}
              </p>
            </div>
            
            <div className="w-full space-y-3 pt-2">
              <button 
                onClick={handleUpgrade}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" />
                {userData.language === 'pt' ? 'ASSINAR ZEUS AGORA' : 'UPGRADE TO ZEUS NOW'}
              </button>
              <button 
                onClick={close} 
                className="w-full py-3 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                {userData.language === 'pt' ? 'CONTINUAR TESTANDO' : 'CONTINUE TESTING'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
