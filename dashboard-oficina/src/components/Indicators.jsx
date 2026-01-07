import "./Indicators.css"

export function Indicators({ totalFaturado, ticketMedio, abertas, fechadas }) {
  const indicators = [
    {
      emoji: "💰",
      label: "Total Faturado",
      value: `R$ ${totalFaturado.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color: "success",
      trend: "+12%",
      trendPositive: true,
    },
    {
      emoji: "📊",
      label: "Ticket Médio",
      value: `R$ ${ticketMedio.toFixed(2)}`,
      color: "primary",
      trend: "+5%",
      trendPositive: true,
    },
    {
      emoji: "🔧",
      label: "Ordens Abertas",
      value: abertas,
      color: "warning",
      subtitle: "Em andamento",
    },
    {
      emoji: "✅",
      label: "Ordens Fechadas",
      value: fechadas,
      color: "info",
      subtitle: "Concluídas",
    },
  ]

  return (
    <div className="indicators-container">
      {indicators.map((indicator, index) => (
        <div key={index} className={`indicator-card indicator-${indicator.color}`}>
          <div className="indicator-emoji">{indicator.emoji}</div>

          <div className="indicator-content">
            {indicator.trend && (
              <span className={`indicator-trend ${indicator.trendPositive ? "trend-positive" : "trend-negative"}`}>
                {indicator.trend}
              </span>
            )}
            <div className="indicator-value">{indicator.value}</div>
            <div className="indicator-label">{indicator.label}</div>
            {indicator.subtitle && <div className="indicator-subtitle">{indicator.subtitle}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
