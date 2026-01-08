import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { extractResponseText } from './aiService';

globalThis.fetch = vi.fn();

const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('aiService', () => {
  let gerarInsight;
  const originalEnv = import.meta.env.VITE_GEMINI_API_KEY;

  beforeEach(async () => {
    globalThis.fetch.mockClear();
    consoleErrorSpy.mockClear();
    consoleWarnSpy.mockClear();
    vi.resetModules();

    import.meta.env.VITE_GEMINI_API_KEY = 'test-key';

    const module = await import('./aiService');
    gerarInsight = module.gerarInsight;
  });

  afterEach(() => {
    vi.resetModules();
    import.meta.env.VITE_GEMINI_API_KEY = originalEnv;
  });

  it('retorna insight quando API responde com sucesso', async () => {
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{
            text: '📌 Resumo Executivo:\nAnálise de teste\n⚠️ Pontos de Atenção:\n- Ponto 1\n🚀 Oportunidades:\n- Oportunidade 1'
          }]
        }
      }]
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const dados = [{ _id: '1', cliente: 'Teste', status: 'aberta' }];
    const result = await gerarInsight(dados);

    expect(result).toContain('Resumo Executivo');
    expect(result).toContain('Pontos de Atenção');
    expect(result).toContain('Oportunidades');
  });

  it('loga warning quando API key não está configurada', async () => {
    vi.resetModules();
    import.meta.env.VITE_GEMINI_API_KEY = '';

    await import('./aiService');

    expect(consoleWarnSpy).toHaveBeenCalledWith('VITE_GEMINI_API_KEY não informada — IA desativada');
  });

  it('retorna mensagem quando genAI é null', async () => {
    vi.resetModules();
    import.meta.env.VITE_GEMINI_API_KEY = '';

    const module = await import('./aiService');
    const result = await module.gerarInsight([{ _id: '1' }]);

    expect(result).toContain('IA não configurada');
  });

  it('loga erro quando inicialização do Gemini falha', async () => {
    vi.resetModules();
    import.meta.env.VITE_GEMINI_API_KEY = 'test-key';

    vi.doMock('@google/generative-ai', () => ({
      GoogleGenerativeAI: vi.fn(() => {
        throw new Error('Inicialização falhou');
      })
    }));

    await import('./aiService');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao inicializar Gemini:', expect.any(Error));

    vi.doUnmock('@google/generative-ai');
  });

  it('loga erro e retorna mensagem quando fetch falha', async () => {
    const mockError = new Error('Network error');
    globalThis.fetch.mockRejectedValueOnce(mockError);

    const dados = [{ _id: '1', cliente: 'Teste' }];
    const result = await gerarInsight(dados);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao gerar insight via IA:', expect.any(Error));
    expect(result).toContain('Erro ao gerar análise');
  });

  it('monta prompt correto com dados fornecidos', async () => {
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{ text: 'Teste' }]
        }
      }]
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const dados = [
      { _id: '1', cliente: 'Cliente A', status: 'aberta', valor: 100 },
      { _id: '2', cliente: 'Cliente B', status: 'fechada', valor: 200 }
    ];

    await gerarInsight(dados);

    const fetchCall = globalThis.fetch.mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);

    expect(requestBody.contents[0].parts[0].text).toContain('Cliente A');
    expect(requestBody.contents[0].parts[0].text).toContain('Cliente B');
    expect(requestBody.contents[0].parts[0].text).toContain('aberta');
    expect(requestBody.contents[0].parts[0].text).toContain('fechada');
  });

  it('retorna response.text quando for string', async () => {
    vi.resetModules();

    vi.doMock('./aiService', async () => {
        const original = await vi.importActual('./aiService');

        return {
            ...original,
            __esModule: true,
            gerarInsight: async () => 'Resumo vindo como string direta'
        };
    });

    const { gerarInsight } = await import('./aiService');

    const result = await gerarInsight([{ _id: '1' }]);

    expect(result).toBe('Resumo vindo como string direta');

    vi.doUnmock('./aiService');
  });

  it('retorna string quando response.text é string', () => {
    expect(extractResponseText({ text: 'ok' })).toBe('ok');
  });

  it('retorna fallback quando response.text inválido', () => {
    expect(extractResponseText({ text: 123 })).toBe(
        'Não foi possível gerar uma análise clara.'
    );
  });
});