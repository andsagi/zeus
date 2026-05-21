import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, Mic, Globe, Zap } from 'lucide-react';
import { useUser } from '../lib/UserContext';
import { getAIResponse } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';
import { handleFirestoreError, OperationType } from '../lib/firestore-utils';

export const Chatbot = () => {
  const { userData, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string, sources?: { uri: string, title: string }[] }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load History
  useEffect(() => {
    if (!user || !supabase) return;
    
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching messages from supabase:', error);
        return;
      }
      if (data) {
        const history = data
          .map(doc => ({
            role: doc.role as 'user' | 'model',
            text: doc.text as string,
            sources: doc.sources as { uri: string, title: string }[] | undefined,
          }))
          .reverse();
        setMessages(history);
      }
    };
    fetchHistory();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !userData || !user || !supabase) return;

    const userMessage = input;
    setInput('');
    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]); // Optmistic UI since we removed onSnapshot

    try {
      // Save User Message
      await supabase.from('messages').insert({
        user_id: user.uid,
        role: 'user',
        text: userMessage
      });

      // Get AI Response
      const response = await getAIResponse(userMessage, messages.map(m => ({ role: m.role, text: m.text })), userData.specialization, userData.language, useWebSearch);
      
      // Save AI Response
      await supabase.from('messages').insert({
        user_id: user.uid,
        role: 'model',
        text: response.text,
        sources: response.sources || []
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text, sources: response.sources }]); // Optimistic UI
    } catch (error) {
      console.error('Error saving message to Supabase', error);
      alert('Houve um erro ao se comunicar com o sistema. Tente novamente.');
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
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
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
            className="bg-black border border-blue-500/20 w-[350px] md:w-[400px] h-[500px] rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col overflow-hidden mb-4 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="bg-black/80 border-b border-blue-500/20 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 animate-pulse"></div>
                  <div className="bg-slate-900 border border-blue-500/30 p-2 rounded-xl relative">
                    <Zap className="w-5 h-5 text-blue-400 fill-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-black text-white text-sm italic tracking-tight">ZEUS ASSISTANT</h3>
                  <p className="text-[10px] text-blue-400/60 uppercase tracking-[0.2em] font-black">
                    {userData?.specialization || 'Personal Assistant'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg">
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
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-[0_0_20px_rgba(37,99,235,0.2)]' 
                      : 'bg-white/5 border border-blue-500/10 text-gray-200 rounded-tl-none'
                  }`}>
                    <div className="markdown-body text-xs prose prose-invert overflow-hidden">
                      <ReactMarkdown>
                        {m.text}
                      </ReactMarkdown>
                    </div>
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Fontes verificadas:</p>
                        <div className="flex flex-wrap gap-2">
                          {m.sources.map((source, idx) => (
                            <a 
                              key={idx} 
                              href={source.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] text-blue-400 hover:underline bg-blue-500/5 px-2 py-1 rounded-md border border-blue-500/10 transition-all flex items-center gap-1"
                            >
                              <Globe className="w-2.5 h-2.5" />
                              {source.title.length > 20 ? source.title.substring(0, 20) + '...' : source.title}
                            </a>
                          ))}
                        </div>
                        <p className="text-[8px] text-slate-600 italic">
                          * As buscas na web podem conter imprecisões. Sempre valide informações críticas separadamente.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce shadow-[0_0_5px_rgba(96,165,250,0.5)]" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s] shadow-[0_0_5px_rgba(96,165,250,0.5)]" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s] shadow-[0_0_5px_rgba(96,165,250,0.5)]" />
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
                  className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-white/10 text-blue-400'}`}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={userData?.language === 'pt' ? 'Pergunte ao Zeus...' : 'Ask Zeus...'}
                  className="flex-1 bg-black/40 border border-blue-500/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 transition-colors text-white placeholder:text-white/20"
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-600 p-2 rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="mt-3 flex justify-center gap-4 text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">
                 <button 
                  onClick={() => setUseWebSearch(!useWebSearch)}
                  className={`flex items-center gap-1.5 transition-all ${useWebSearch ? 'text-blue-400' : 'text-white/20 hover:text-white/40'}`}
                 >
                   <Globe className={`w-3 h-3 ${useWebSearch ? 'animate-spin-slow' : ''}`} /> 
                   SYSTEM SEARCH {useWebSearch ? 'ACTIVE' : 'OFFLINE'}
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-0.5"
      >
        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <div className={`w-16 h-16 bg-black border border-blue-900/50 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.25)] transition-all duration-500 ${isOpen ? 'rotate-90 scale-90' : 'hover:scale-110 hover:-translate-y-1'}`}>
           <motion.div
             animate={isOpen ? { rotate: 0 } : { rotate: 360 }}
             transition={isOpen ? { duration: 0.3 } : { duration: 6, repeat: Infinity, ease: "linear" }}
           >
             {isOpen ? <X className="w-8 h-8 text-blue-400" /> : <Zap className="w-8 h-8 text-blue-400 fill-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" />}
           </motion.div>
           <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-blue-400/10 to-transparent pointer-events-none"></div>
           
           {!isOpen && (
             <div className="absolute top-2 right-2 flex gap-0.5">
               <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(96,165,250,0.5)]"></div>
             </div>
           )}
        </div>
      </button>
    </div>
  );
};
