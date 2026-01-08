import "./Indicators.css"

export function Indicators({ totalFaturado, ticketMedio, abertas, fechadas }) {
  const indicators = [
    {
      emoji: "💰",
      value: `R$ ${totalFaturado.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      label: "Total Faturado",
      color: "success",
      trend: "+12%",
      trendPositive: true,
    },
    {
      emoji: "📊",
      value: `R$ ${ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      label: "Ticket Médio",
      color: "primary",
      trend: "-3%",
      trendPositive: false,
    },
    {
      emoji: "🔧",
      value: abertas,
      label: "Ordens Abertas",
      color: "warning",
      subtitle: "Em andamento",
    },
    {
      emoji: "✅",
      value: fechadas,
      label: "Ordens Fechadas",
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