import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getAIResponse = async (
  prompt: string, 
  history: { role: 'user' | 'model', text: string }[] = [],
  specialization: string = "Assistente Pessoal",
  language: string = "pt",
  useWebSearch: boolean = false
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
    - O usuário espera que você se lembre de preferências anteriores (registradas no histórico).
    - Seja proativo: se o usuário mencionar um problema, sugira uma estrutura de página ou tabela para resolvê-lo.
    - Se o usuário for de uma área técnica (como Engenharia), foque em precisão, cronogramas e dados geográficos.
    - Se for de uma área criativa, foque em brainstorm e estrutura de notas complexas.
    - Use o histórico de mensagens para manter a continuidade da "personalidade" do assistente que aprende com o dono.
    - Faça perguntas de acompanhamento que mostrem que você está pensando à frente (ex: "Quer que eu prepare um lembrete para a próxima etapa deste processo?").
    
    IDIOMA: Responda preferencialmente em ${language === 'pt' ? 'Português' : 'Inglês'}.
    
    REGRAS CRÍTICAS DE SEGURANÇA:
    - É TERMINANTEMENTE PROIBIDO falar sobre: política, pedofilia ou guerra.
    - Se o usuário perguntar sobre esses temas, responda educadamente que como assistente de produtividade Zeus, você não trata desses assuntos.
    - O objetivo é ser sofisticado e sugerir soluções proativas.
    - Você tem memória das conversas anteriores (fornecidas no histórico).

    WEB SEARCH: Se a busca na web estiver ativada (${useWebSearch ? 'SIM' : 'NÃO'}), você pode usar os resultados da pesquisa para fornecer informações atualizadas. Sempre cite as fontes se usar busca na web.
  `;

  try {
    const config: any = {
      systemInstruction,
    };

    if (useWebSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const chat = ai.chats.create({
      model,
      config,
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: prompt });
    
    // Extract grounding URLs
    const sources = result.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        uri: chunk.web?.uri || chunk.maps?.uri,
        title: chunk.web?.title || chunk.maps?.title || 'Fonte'
      })) || [];

    return {
      text: result.text,
      sources: sources
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "Desculpe, tive um problema ao processar sua solicitação. Por favor, tente novamente.",
      sources: []
    };
  }
};
