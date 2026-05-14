import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Save, Eye, Edit3, Trash2, Star, Share2, CheckCircle, ChevronLeft, Mic } from 'lucide-react';
import { useUser } from '../lib/UserContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-utils';

export const Editor = ({ onNavigate }: { onNavigate?: (view: string) => void }) => {
  const { userData } = useUser();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Nova Nota');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [isListening, setIsListening] = useState(false);

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
      setContent(prev => prev + (prev ? ' ' : '') + transcript);
    };
    recognition.start();
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    const path = `users/${auth.currentUser.uid}/notes`;
    try {
      await addDoc(collection(db, path), {
        title,
        content,
        updatedAt: serverTimestamp(),
        priority: content.toLowerCase().includes('aniversario') || content.toLowerCase().includes('importante')
      });
      alert(userData?.language === 'pt' ? 'Nota salva!' : 'Note saved!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = async () => {
    await handleSave();
    if (onNavigate) onNavigate('dashboard');
  };

  return (
    <div className="h-full flex flex-col bg-brand-black">
      {/* Top Bar */}
      <div className="h-16 border-b border-white/5 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate?.('dashboard')}
            className="p-2 text-slate-500 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-xl font-display font-bold text-white focus:outline-none border-b border-transparent focus:border-brand-orange transition-colors"
          />
          <Star className="w-4 h-4 text-gray-600 hover:text-yellow-400 cursor-pointer" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 rounded-xl p-1 mr-4">
            <button
              onClick={() => setMode('edit')}
              className={`p-2 rounded-lg transition-all ${mode === 'edit' ? 'bg-brand-orange text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`p-2 rounded-lg transition-all ${mode === 'preview' ? 'bg-brand-orange text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={startVoice}
            className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          >
            <Mic className="w-4 h-4" />
          </button>
          
          <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="ml-2 border border-brand-orange/50 text-brand-orange px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-brand-orange/10 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {userData?.language === 'pt' ? 'Salvar' : 'Save'}
          </button>

          <button 
            onClick={handleFinish}
            disabled={saving}
            className="ml-2 bg-brand-orange text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            {userData?.language === 'pt' ? 'Finalizar' : 'Finish'}
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-y-auto px-8 py-10 max-w-4xl mx-auto w-full">
        {mode === 'edit' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={userData?.language === 'pt' ? 'Comece a escrever ou use / para comandos...' : 'Start writing or type / for commands...'}
            className="w-full h-full bg-transparent resize-none focus:outline-none text-gray-300 leading-relaxed text-lg font-sans placeholder:text-white/10"
          />
        ) : (
          <div className="markdown-body prose prose-invert max-w-none">
            <ReactMarkdown>{content || '*Nenhum conteúdo ainda*'}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
