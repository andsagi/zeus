import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Timer, CreditCard } from 'lucide-react';
import { differenceInDays, addDays, formatDistanceToNow } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useUser } from '../lib/UserContext';

export const TrialBanner = () => {
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

  const trialEnd = addDays(new Date(userData.trialStartDate), 60);
  const daysLeft = differenceInDays(trialEnd, new Date());
  const locale = userData.language === 'pt' ? ptBR : enUS;

  const close = () => {
    setIsVisible(false);
    setLastClosed(Date.now());
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 z-50 bg-brand-orange text-black py-2 px-6 flex items-center justify-between shadow-lg font-bold text-xs"
        >
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            <span className="uppercase tracking-tight">
              {userData.language === 'pt' 
                ? `VOCÊ TEM ${daysLeft} DIAS RESTANTES DE GRATUIDADE VIP`
                : `YOU HAVE ${daysLeft} DAYS OF VIP TRIAL REMAINING`}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="bg-black text-white px-4 py-1 rounded-md text-[10px] font-bold hover:bg-white hover:text-black transition-all flex items-center gap-2">
              <CreditCard className="w-3 h-3" />
              {userData.language === 'pt' ? 'ASSINAR AGORA' : 'UPGRADE NOW'}
            </button>
            <button onClick={close} className="opacity-60 hover:opacity-100 transition-opacity">
              {userData.language === 'pt' ? 'FECHAR AVISO [X]' : 'CLOSE NOTICE [X]'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
