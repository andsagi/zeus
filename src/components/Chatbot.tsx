import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, Mic, Globe } from 'lucide-react';
import { useUser } from '../lib/UserContext';
import { getAIResponse } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

enum OperationType {
  LIST = 'list',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

export const Chatbot = () => {
  const { userData, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load History
  useEffect(() => {
    if (!user) return;
    const path = `users/${user.uid}/messages`;
    const q = query(
      collection(db, path),
      orderBy('timestamp', 'asc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history = snapshot.docs.map(doc => ({
        role: doc.data().role as 'user' | 'model',
        text: doc.data().text as string
      }));
      setMessages(history);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !userData || !user) return;

    const userMessage = input;
    setInput('');
    setIsTyping(true);

    try {
      // Save User Message
      await addDoc(collection(db, `users/${user.uid}/messages`), {
        role: 'user',
        text: userMessage,
        timestamp: serverTimestamp()
      });

      // Get AI Response
      const response = await getAIResponse(userMessage, messages, userData.specialization, userData.language);
      
      // Save AI Response
      await addDoc(collection(db, `users/${user.uid}/messages`), {
        role: 'model',
        text: response,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/messages`);
    } finally {
      setIsTyping(false);
    }
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Comando de voz não suportado neste navegador.");
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = userData?.language === 'pt' ? 'pt-BR' : 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-brand-black border border-white/10 w-[350px] md:w-[400px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-brand-blue p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-brand-orange p-1.5 rounded-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-medium text-white text-sm">Zeus AI Assistant</h3>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest">
                    {userData?.specialization || 'Personal Assistant'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.length === 0 && (
                <div className="text-center py-10 space-y-2">
                  <p className="text-gray-500 text-sm italic">
                    {userData?.language === 'pt' 
                      ? 'Como posso ajudar você hoje, Especialista?'
                      : 'How can I assist you today, Specialist?'}
                  </p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-brand-orange text-white rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                  }`}>
                    <div className="markdown-body text-xs prose prose-invert overflow-hidden">
                      <ReactMarkdown>
                        {m.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative flex items-center gap-2">
                <button 
                  onClick={startVoice}
                  className="p-2 hover:bg-white/10 rounded-full text-brand-orange transition-colors"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={userData?.language === 'pt' ? 'Pergunte ao Zeus...' : 'Ask Zeus...'}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                />
                <button
                  onClick={handleSend}
                  className="bg-brand-orange p-2 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="mt-2 flex justify-center gap-4 text-[10px] text-white/30 uppercase tracking-widest font-bold">
                 <span className="flex items-center gap-1"><Globe className="w-2.5 h-2.5" /> Web Search ON</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-brand-orange w-16 h-16 rounded-full shadow-2xl shadow-brand-orange/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative ${isOpen ? 'rotate-90' : ''}`}
      >
        {isOpen ? <X className="w-8 h-8 text-black" /> : <MessageSquare className="w-8 h-8 text-black" />}
        {!isOpen && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-slate-900 rounded-full"></div>}
      </button>
    </div>
  );
};
