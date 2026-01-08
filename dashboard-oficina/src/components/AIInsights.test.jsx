import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AIInsights } from './AIInsights';
import { parseInsight } from '../utils/parseInsight';
import * as aiService from '../services/aiService';

globalThis.fetch = vi.fn();

const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('AIInsights', () => {
  beforeEach(() => {
    fetch.mockClear();
    consoleErrorSpy.mockClear();
    vi.clearAllMocks();
  });

  it('renderiza o título corretamente', () => {
    render(<AIInsights dados={[]} />);
    expect(screen.getByText(/insights inteligentes/i)).toBeInTheDocument();
  });

  it('renderiza estado vazio quando não há dados', () => {
    const { container } = render(<AIInsights dados={[]} />);
    expect(container.innerHTML).toMatch(/Resumo Executivo/);
    expect(container.innerHTML).toMatch(/Nenhum ponto crítico identificado/);
    expect(container.innerHTML).toMatch(/Continue focando no crescimento/);
  });

  it('parseInsight retorna dados corretamente', () => {
    const texto = `📌 Resumo Executivo:\nResumo aqui\n⚠️ Pontos de Atenção:\n- Atenção 1\n- Atenção 2\n🚀 Oportunidades:\n- Oportunidade 1\n- Oportunidade 2`;
    const result = parseInsight(texto);
    expect(result.resumo).toMatch(/Resumo aqui/);
    expect(result.atencao).toContain('Atenção 1');
    expect(result.oportunidades).toContain('Oportunidade 1');
  });

  it('parseInsight retorna resumo vazio quando não encontra padrão', () => {
    const textoSemResumo = `⚠️ Pontos de Atenção:\n- Atenção 1\n🚀 Oportunidades:\n- Oportunidade 1`;
    const result = parseInsight(textoSemResumo);
    expect(result.resumo).toBe('');
    expect(result.atencao).toContain('Atenção 1');
    expect(result.oportunidades).toContain('Oportunidade 1');
  });

  it('chama a API do Gemini quando há dados', async () => {
    const mockGeminiResponse = {
      candidates: [{
        content: {
          parts: [{
            text: '📌 Resumo Executivo:\nAnálise completa\n⚠️ Pontos de Atenção:\n- Ponto 1\n🚀 Oportunidades:\n- Oportunidade 1'
          }]
        }
      }]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGeminiResponse
    });

    const dados = [{ _id: '1', cliente: 'Teste' }];
    render(<AIInsights dados={dados} />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('generativelanguage.googleapis.com'),
        expect.any(Object)
      );
    });
  });

  it('renderiza lista de pontos de atenção', async () => {
    const mockGeminiResponse = {
      candidates: [{
        content: {
          parts: [{
            text: '📌 Resumo Executivo:\nResumo\n⚠️ Pontos de Atenção:\n- Atenção teste 1\n- Atenção teste 2\n🚀 Oportunidades:\n- Oportunidade 1'
          }]
        }
      }]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGeminiResponse
    });

    render(<AIInsights dados={[{ _id: '1' }]} />);

    await waitFor(() => {
      expect(screen.getByText(/Atenção teste 1/)).toBeInTheDocument();
      expect(screen.getByText(/Atenção teste 2/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renderiza lista de oportunidades', async () => {
    const mockGeminiResponse = {
      candidates: [{
        content: {
          parts: [{
            text: '📌 Resumo Executivo:\nResumo\n⚠️ Pontos de Atenção:\n- Atenção 1\n🚀 Oportunidades:\n- Oportunidade teste 1\n- Oportunidade teste 2'
          }]
        }
      }]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGeminiResponse
    });

    render(<AIInsights dados={[{ _id: '1' }]} />);

    await waitFor(() => {
      expect(screen.getByText(/Oportunidade teste 1/)).toBeInTheDocument();
      expect(screen.getByText(/Oportunidade teste 2/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renderiza fallback quando API falha', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<AIInsights dados={[{ _id: '1' }]} />);

    await waitFor(() => {
      expect(screen.getByText(/Modo Demo/)).toBeInTheDocument();
    });
  });

  it('loga erro no componente quando gerarInsight lança exceção', async () => {
    const mockError = new Error('Falha direta no componente');
    vi.spyOn(aiService, 'gerarInsight').mockRejectedValueOnce(mockError);

    render(<AIInsights dados={[{ _id: '1', cliente: 'Teste' }]} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Erro na IA:', mockError);
      expect(screen.getByText(/Modo Demo/)).toBeInTheDocument();
    });
  });

  it('retorna antecipadamente quando dadosString já foi processado', async () => {
    const gerarInsightSpy = vi
        .spyOn(aiService, 'gerarInsight')
        .mockResolvedValue('📌 Resumo Executivo:\nResumo teste');

    const dados = [{ _id: '1', cliente: 'Teste' }];

    const { rerender } = render(<AIInsights dados={dados} />);

    await waitFor(() => {
        expect(gerarInsightSpy).toHaveBeenCalledTimes(1);
    });

    const mesmosDadosNovoArray = [{ _id: '1', cliente: 'Teste' }];

    rerender(<AIInsights dados={mesmosDadosNovoArray} />);

    await new Promise((r) => setTimeout(r, 50));

    expect(gerarInsightSpy).toHaveBeenCalledTimes(1);
  });

});