import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  BrainCircuit, 
  ShieldCheck, 
  BarChart3, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Cpu,
  Layers,
  Sparkles,
  ChevronRight,
  Lock,
  Search,
  MessageSquare,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="bg-[#05070A] text-white overflow-x-hidden font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Neural Network Substrate */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_20%,#3b82f615,transparent_60%)]" />
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <svg className="w-full h-full">
            <pattern id="neural-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#3b82f6" opacity="0.3" />
              <path d="M 2 2 L 50 50 M 2 2 L 0 50" stroke="#3b82f6" strokeWidth="0.5" fill="none" opacity="0.1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#neural-pattern)" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#05070A]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={onLoginClick}>
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="w-10 h-10 bg-black border border-blue-900/50 rounded-xl flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-6 h-6 text-blue-400 fill-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                </motion.div>
                <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-blue-400/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
            <span className="text-2xl font-display font-black tracking-tighter uppercase text-white">ZEUS</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#features" className="hover:text-blue-400 transition-colors">Tecnologia</a>
            <a href="#about" className="hover:text-blue-400 transition-colors">Sistema</a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors">Assinatura</a>
          </div>
          <button 
            onClick={onLoginClick}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
          >
            Acessar Sistema
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10"
          >
            <Sparkles className="w-3 h-3 text-blue-400" />
            60 DIAS DE ACESSO ELITE GRATUITO
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-9xl font-display font-black leading-[0.85] tracking-tighter mb-12"
          >
            A INTELIGÊNCIA <br />
            QUE <span className="text-blue-500 italic">TRANSBORDA</span> <br />
            O DIGITAL.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto mb-16 leading-relaxed font-light"
          >
            Zeus não é uma ferramenta, é uma extensão cognitiva. <br className="hidden md:block" />
            Processe contextos complexos, gerencie memórias persistentes e domine sua produtividade.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8"
          >
            <button 
              onClick={onLoginClick}
              className="w-full md:w-auto px-12 py-7 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 text-sm"
            >
              LIBERAR TESTE DE 60 DIAS <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-6 text-slate-500">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <img 
                    key={i}
                    src={`https://i.pravatar.cc/100?u=${i + 50}`} 
                    className="w-10 h-10 rounded-full border-2 border-[#05070A]" 
                    alt="Usuário"
                    referrerPolicy="no-referrer"
                   />
                 ))}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">+500 ASSINANTES ELITE</span>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="max-w-6xl mx-auto mt-32 relative group"
        >
          <div className="absolute inset-0 bg-blue-600/10 blur-[150px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity"></div>
          <div className="relative border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl bg-[#0A0E1A] aspect-[16/8]">
             {/* Abstract Neural Graphics via CSS/SVG */}
             <div className="absolute inset-0 opacity-40">
                <svg className="w-full h-full" viewBox="0 0 1000 500">
                  <motion.circle 
                    cx="500" cy="250" r="200" 
                    stroke="#3b82f6" strokeWidth="0.5" fill="none"
                    animate={{ r: [180, 220, 180], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity }}
                  />
                  {[...Array(20)].map((_, i) => (
                    <motion.line
                      key={i}
                      x1={500 + Math.cos(i) * 200}
                      y1={250 + Math.sin(i) * 200}
                      x2={500 + Math.cos(i * 1.5) * 150}
                      y2={250 + Math.sin(i * 1.5) * 150}
                      stroke="#3b82f6"
                      strokeWidth="0.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: [0, 1, 0] }}
                      transition={{ duration: 3 + Math.random() * 5, repeat: Infinity }}
                    />
                  ))}
                </svg>
             </div>

             <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="p-12 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] max-w-2xl w-full text-center space-y-8 shadow-[0_0_100px_rgba(59,130,246,0.1)]">
                  <div className="flex justify-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-ping [animation-delay:0.4s]"></div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-display font-medium italic text-white tracking-tight leading-snug">
                    "Zeus, cruze os dados de vendas com a localização dos fornecedores no mapa."
                  </h3>
                  <div className="h-[2px] w-24 bg-blue-600/50 mx-auto"></div>
                  <div className="flex items-center justify-center gap-12 pt-4">
                    <div className="flex flex-col items-center gap-3">
                      <Cpu className="w-8 h-8 text-blue-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Neural Engine</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <MapPin className="w-8 h-8 text-blue-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Geo Awareness</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Technology Pillars */}
      <section id="features" className="py-40 px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="inline-block px-5 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                ARQUITETURA ZEUS
              </span>
              <h2 className="text-5xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter mb-10">
                A IA QUE <br />
                NÃO <span className="text-blue-500 italic">ESQUECE.</span>
              </h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed mb-12">
                Diferente de sistemas convencionais, Zeus utiliza memória persistente adaptativa. Ele compreende o histórico de suas notas, cronogramas e dados para oferecer insights contextuais que evoluem com seu uso.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { icon: BrainCircuit, title: "Memória Profunda", desc: "Seu histórico profissional sempre ao alcance." },
                  { icon: Search, title: "Busca Inteligente", desc: "Localize dados em conversas ou tabelas instantaneamente." },
                  { icon: MessageSquare, title: "Chatbot Adaptativo", desc: "O tom e a precisão se ajustam à sua especialidade." },
                  { icon: Globe, title: "Integração Global", desc: "Dados geográficos e mapas em tempo real." }
                ].map((item, i) => (
                  <div key={i} className="space-y-3 group">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <item.icon className="w-5 h-5 text-blue-400 group-hover:text-white" />
                    </div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-wide">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
               <div className="absolute inset-0 bg-blue-600/10 blur-[120px] rounded-full"></div>
               <div className="relative aspect-square rounded-[4rem] bg-[#0A0E1A] border border-white/10 p-12 overflow-hidden">
                  <div className="h-full border border-white/5 rounded-3xl bg-[radial-gradient(circle_at_bottom_left,#3b82f615,transparent)] flex flex-col items-center justify-center text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Layers className="w-20 h-20 text-blue-500 mb-8" />
                    </motion.div>
                    <div className="text-7xl font-display font-black text-white tracking-tighter">60D</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Trial Elite Standard</div>
                    <div className="mt-8 space-y-2">
                       <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-full h-full bg-blue-500"
                          />
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testemunhos" className="py-40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-24">
            <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter mb-6">
              PODER <span className="text-blue-500">MUNDIAL.</span>
            </h2>
            <p className="text-slate-500 text-xl font-light uppercase tracking-widest">A escolha dos profissionais de elite</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 text-left">
            {[
              { 
                name: "Ricardo Mendes", 
                role: "Engenheiro Sênior", 
                quote: "O Zeus mudou como gerencio meus projetos. A capacidade de ele se lembrar de detalhes técnicos é essencial.",
                avatar: "https://i.pravatar.cc/150?u=ricardo"
              },
              { 
                name: "Carla Silveira", 
                role: "Arquiteta e Designer", 
                quote: "Interface rápida e arrojada. A integração com mapas é o diferencial para meu fluxo de trabalho.",
                avatar: "https://i.pravatar.cc/150?u=carla"
              },
              { 
                name: "Bruno Gadelha", 
                role: "Consultor Estratégico", 
                quote: "Melhor investimento do ano. O assistente Zeus Elite economiza pelo menos 10 horas da minha semana.",
                avatar: "https://i.pravatar.cc/150?u=bruno"
              }
            ].map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 bg-[#111827]/40 border border-white/5 rounded-[2.5rem] backdrop-blur-xl relative group"
              >
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex items-center gap-1 text-blue-500 mb-8">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-blue-500" />)}
                </div>
                <p className="text-lg font-light italic text-slate-300 mb-10 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/20" alt={t.name} referrerPolicy="no-referrer" />
                  <div>
                    <div className="font-bold text-white text-lg">{t.name}</div>
                    <div className="text-[10px] text-blue-500 uppercase tracking-widest font-black leading-tight">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Actual Data */}
      <section id="pricing" className="py-40 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-24">
            <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter mb-8">
              PLANOS <span className="text-blue-500">ELITE.</span>
            </h2>
            <div className="inline-block px-10 py-3 rounded-2xl bg-blue-600/10 border border-blue-600/30 text-blue-400 text-sm font-black uppercase tracking-widest">
              60 DIAS DE TRIAL GRATUITO EM QUALQUER PLANO
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "MENSAL", price: "39,90", period: "mês", features: ["Assistente IA Completo", "Tabelas e Mapas", "Memória Adaptativa", "Suporte 24/7"] },
              { name: "SEMESTRAL", price: "180,00", period: "6 meses", features: ["Tudo do Mensal", "Relatórios Geográficos", "Backup Estratégico", "Economia de 25%"], popular: true },
              { name: "ANUAL", price: "300,00", period: "ano", features: ["Poder Zeus Máximo", "Acesso a Beta Tools", "Consultoria de IA", "Economia Total de 37%"], elite: true }
            ].map((plan, i) => (
              <div 
                key={i}
                className={`p-12 rounded-[3rem] border transition-all relative flex flex-col text-left ${plan.popular || plan.elite ? 'bg-[#111827] border-blue-500 shadow-[0_0_80px_rgba(59,130,246,0.15)] scale-105 z-20' : 'bg-white/[0.02] border-white/10'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                    MAIS POPULAR
                  </div>
                )}
                
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-2xl font-light text-slate-500 italic">R$</span>
                  <span className="text-6xl font-display font-black tracking-tighter text-white">{plan.price}</span>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">/{plan.period}</span>
                </div>

                <ul className="space-y-5 mb-12 flex-1">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-slate-400 group">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                      <span className="group-hover:text-white transition-colors">{feat}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={onLoginClick}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all text-xs flex items-center justify-center gap-2 ${plan.popular || plan.elite ? 'bg-blue-600 text-white hover:bg-white hover:text-black shadow-xl' : 'bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black'}`}
                >
                  ASSINAR AGORA <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-5xl mx-auto rounded-[4rem] bg-blue-600 p-16 md:p-32 relative overflow-hidden group">
           <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl opacity-30" />
           
           <h2 className="text-6xl md:text-8xl font-display font-black text-white leading-none tracking-tighter mb-10 relative z-10">
             O FUTURO <br /> NÃO ESPERA.
           </h2>
           <p className="text-white/80 text-xl font-medium mb-12 max-w-2xl mx-auto relative z-10">
             Comece hoje sua jornada com o Zeus. 60 dias de trial ilimitado para você provar a diferença da gestão profissional.
           </p>

           <button 
             onClick={onLoginClick}
             className="bg-white text-black px-16 py-8 rounded-[2rem] font-black uppercase tracking-[0.3em] text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_40px_80px_rgba(0,0,0,0.3)] relative z-10"
           >
             LIBERAR ACESSO GRATUITO
           </button>

           <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
             <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Dados Criptografados</div>
             <div className="flex items-center gap-2"><Zap className="w-4 h-4" /> Ativação Instantânea</div>
             <div className="flex items-center gap-2"><Lock className="w-4 h-4" /> Sem Cartão Requerido Agora</div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-8 h-8 bg-black border border-blue-900/50 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-400 fill-blue-400" />
              </div>
              <span className="text-xl font-display font-black tracking-tighter uppercase text-white">ZEUS</span>
            </div>
            <p className="text-slate-600 text-[10px] max-w-xs leading-relaxed font-black uppercase tracking-widest leading-loose">
              O standard de ouro em <br /> inteligência adaptativa.
            </p>
          </div>

          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
             <a href="#" className="hover:text-white transition-colors">Twitter</a>
             <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
             <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center text-slate-700 text-[9px] font-black uppercase tracking-[0.5em] leading-loose">
          © 2026 ZEUS ASSISTENTE ADAPTATIVO. TODOS OS DIREITOS RESERVADOS. <br />
          NEURAL NETWORK DEPLOYED ON GLOBAL EDGE.
        </div>
      </footer>
    </div>
  );
};
