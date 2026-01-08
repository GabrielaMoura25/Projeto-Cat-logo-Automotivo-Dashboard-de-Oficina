"use client"

import { useState, useEffect, useRef } from "react"
import { gerarInsight } from "../services/aiService"
import { parseInsight } from "../utils/parseInsight"
import "./AIInsights.css"

const FALLBACK_INSIGHTS = {
  resumo:
    "A operação demonstra boa capacidade de entrega com ordens concluídas e faturamento positivo. O ticket médio está equilibrado, indicando um mix saudável de serviços básicos e complexos.",
  atencao: [
    "Monitore o tempo médio de conclusão das ordens abertas para evitar atrasos",
    "Acompanhe a disponibilidade de estoque de peças para serviços mais demandados",
    "Avalie a capacidade da equipe em períodos de maior demanda",
  ],
  oportunidades: [
    "Implementar programa de manutenção preventiva para fidelizar clientes",
    "Criar pacotes de serviços para aumentar o ticket médio",
    "Estabelecer parcerias com fornecedores para reduzir custos de peças",
    "Utilizar dados históricos para prever demanda e otimizar agenda",
  ],
}

export function AIInsights({ dados }) {
  const [insight, setInsight] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [modoOffline, setModoOffline] = useState(false)

  const dadosProcessadosRef = useRef("")
  const analisandoRef = useRef(false)

  useEffect(() => {
    const dadosString = JSON.stringify(dados)

    if (!dados || dados.length === 0) {
      return
    }

    if (dadosString === dadosProcessadosRef.current || analisandoRef.current) {
      return
    }

    async function analisar() {
      try {
        analisandoRef.current = true
        setCarregando(true)
        setModoOffline(false)
        
        const resultado = await gerarInsight(dados)

        if (resultado.includes("Erro") || resultado.includes("não configurada") || resultado.includes("indisponível")) {
          setModoOffline(true)
        } else {
          setInsight(resultado)
          dadosProcessadosRef.current = dadosString
        }
      } catch (error) {
        console.error("Erro na IA:", error)
        setModoOffline(true)
      } finally {
        setCarregando(false)
        analisandoRef.current = false
      }
    }

    analisar()
  }, [dados])

  const { resumo, atencao, oportunidades } = modoOffline ? FALLBACK_INSIGHTS : parseInsight(insight)

  return (
    <div className="ai-insights">
      <div className="ai-header">
        <span className="ai-icon">🤖</span>
        <h2>Insights Inteligentes</h2>
        {modoOffline && <span className="offline-badge">Modo Demo</span>}
      </div>

      {carregando ? (
        <div className="ai-loading-state">
          <div className="loading-spinner"></div>
          <p>Analisando seus dados com IA...</p>
        </div>
      ) : (
        <div className="ai-sections">
          <div className="ai-section ai-summary">
            <div className="section-header">
              <span className="section-icon">📊</span>
              <h3>Resumo Executivo</h3>
            </div>
            <p className="section-content">{resumo}</p>
          </div>

          <div className="ai-section ai-warning">
            <div className="section-header">
              <span className="section-icon">⚠️</span>
              <h3>Pontos de Atenção</h3>
            </div>
            {atencao.length > 0 ? (
              <ul className="section-list">
                {atencao.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="section-content empty">Nenhum ponto crítico identificado</p>
            )}
          </div>

          <div className="ai-section ai-opportunity">
            <div className="section-header">
              <span className="section-icon">💡</span>
              <h3>Oportunidades</h3>
            </div>
            {oportunidades.length > 0 ? (
              <ul className="section-list">
                {oportunidades.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="section-content empty">Continue focando no crescimento</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}