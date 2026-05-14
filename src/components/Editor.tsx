import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Save, Eye, Edit3, Trash2, Star, Share2 } from 'lucide-react';
import { useUser } from '../lib/UserContext';

export const Editor = () => {
  const { userData } = useUser();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Nova Nota');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="h-full flex flex-col bg-brand-black">
      {/* Top Bar */}
      <div className="h-16 border-b border-white/5 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
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
          
          <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="ml-2 bg-brand-orange text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all">
            <Save className="w-4 h-4" />
            {userData?.language === 'pt' ? 'Salvar' : 'Save'}
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
