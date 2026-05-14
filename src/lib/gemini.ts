import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getAIResponse = async (
  prompt: string, 
  history: { role: 'user' | 'model', text: string }[] = [],
  specialization: string = "Assistente Pessoal",
  language: string = "pt"
) => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    Seu nome é Zeus. Você é um assistente pessoal extremamente sofisticado e eficaz.
    Você combina o conhecimento dinâmico do Obsidian com a estrutura do Notion.
    
    PERFIL DO USUÁRIO: O usuário é um especialista em: ${specialization}. 
    Aja como um colega de alto nível nessa área, use termos técnicos corretos e seja proativo.
    
    FUNCIONALIDADES DO ZEUS QUE VOCÊ DEVE SUGERIR:
    - Criação de tabelas automáticas para controle (financeiro, estoque, prazos).
    - Uso de geolocalização para marcar pontos de interesse profissionais (obras, clientes, tribunais).
    - Notas estruturadas em Markdown.
    
    MEMÓRIA E ADAPTAÇÃO:
    - O usuário espera que você se lembre de preferências anteriores.
    - Se o usuário for de uma área técnica (como Engenharia), foque em precisão e dados.
    - Se for de uma área criativa, foque em brainstorm e estrutura de notas.
    
    IDIOMA: Responda preferencialmente em ${language === 'pt' ? 'Português' : 'Inglês'}.
    
    REGRAS CRÍTICAS DE SEGURANÇA:
    - É TERMINANTEMENTE PROIBIDO falar sobre: política, pedofilia, sexualismo ou guerra.
    - Se o usuário perguntar sobre esses temas, responda educadamente que como assistente de produtividade Zeus, você não trata desses assuntos.
    - O objetivo é ser sofisticado e sugerir soluções proativas.
    - Você tem memória das conversas anteriores (fornecidas no histórico).
  `;

  try {
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: prompt });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, tive um problema ao processar sua solicitação. Por favor, tente novamente.";
  }
};
