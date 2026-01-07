import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (e) {
    console.error("Erro ao inicializar Gemini:", e);
  }
} else {
  console.warn("VITE_GEMINI_API_KEY não informada — IA desativada");
}

/**
 * IA ANALISTA — recebe dados reais da oficina
 */
export async function gerarInsight(dados) {
  if (!genAI) {
    return "IA não configurada. Análise automática indisponível.";
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `
    Você é um analista de gestão de oficinas mecânicas.

    A partir dos dados abaixo (JSON real), gere uma análise gerencial estruturada EXATAMENTE neste formato:

    📌 Resumo Executivo:
    - 2 a 3 frases objetivas interpretando o cenário geral.

    ⚠️ Pontos de Atenção:
    - Liste de 2 a 4 possíveis problemas operacionais ou riscos.

    🚀 Oportunidades:
    - Liste de 2 a 4 ações práticas para melhoria do negócio.

    Regras:
    - Não descreva gráficos
    - Não repita números
    - Interprete os dados
    - Use linguagem clara, direta e executiva

    Dados:
    ${JSON.stringify(dados, null, 2)}
    `;

    const result = await model.generateContent(prompt);

    const response = result.response;

    if (typeof response.text === "function") {
      return response.text();
    }

    if (typeof response.text === "string") {
      return response.text;
    }

    return "Não foi possível gerar uma análise clara.";
  } catch (error) {
    console.error("Erro ao gerar insight via IA:", error);
    return "Erro ao gerar análise inteligente.";
  }
}
