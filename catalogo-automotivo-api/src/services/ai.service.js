const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

/**
 * Inicializa a API apenas se a chave estiver presente
 */
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (e) {
    console.error('Falha ao inicializar GoogleGenerativeAI:', e);
    genAI = null;
  }
} else {
  console.warn('GEMINI_API_KEY não informada — chamadas à IA serão ignoradas');
}

/**
 * Função de uso exclusivo para testes unitários.
 * Permite mockar o objeto genAI e aumentar a cobertura de testes.
 * Não utilizar em produção.
 */
function __setGenAI(mock) {
  genAI = mock;
}

async function gerarDescricao(nome, categoria) {
  // Se não há cliente de IA configurado, devolve null para que o fluxo trate a ausência
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
    });

    const prompt = `Crie uma descrição técnica e curta (máximo 500 caracteres) para o produto automotivo "${nome}" da categoria "${categoria}".\nNão inclua dicas de marketing, apenas o texto da descrição.\nUse um tom profissional.`;

    const result = await model.generateContent([prompt]);

    // O SDK pode retornar a resposta em estruturas diferentes dependendo da versão
    if (!result) return null;

    const response = result.response || result;

    // response.text pode ser uma função ou string dependendo da lib
    if (typeof response.text === 'function') {
      return response.text();
    }

    if (typeof response.text === 'string') {
      return response.text;
    }

    // Tentativa de extrair texto de campos comuns
    if (response.output && typeof response.output === 'string')
      return response.output;
    if (
      Array.isArray(response.outputs) &&
      response.outputs[0] &&
      response.outputs[0].content
    ) {
      return String(response.outputs[0].content) || null;
    }

    return null;
  } catch (error) {
    console.error('Erro ao gerar descrição via IA:', error);
    return null;
  }
}

/**
 * Circuit breaker/retry simples
 */
async function gerarDescricaoComRetry(
  nome,
  categoria,
  tentativas = 3,
  timeoutMs = 7000
) {
  const service = module.exports;

  for (let i = 0; i < tentativas; i++) {
    let timeoutId;

    try {
      const resultado = await Promise.race([
        service.gerarDescricao(nome, categoria),
        new Promise((_, reject) => {
          timeoutId = setTimeout(
            () => reject(new Error('Timeout IA')),
            timeoutMs
          );
        }),
      ]);

      clearTimeout(timeoutId);

      if (resultado) return resultado;
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`Tentativa ${i + 1} falhou:`, err.message);
      if (i === tentativas - 1) return null;
    }
  }

  return null;
}

module.exports = { gerarDescricao, gerarDescricaoComRetry, __setGenAI };
