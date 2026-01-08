export function parseInsight(texto) {
  if (!texto || typeof texto !== 'string') {
    return { resumo: '', atencao: [], oportunidades: [] }
  }

  // Remove formatação Markdown (**, *, etc)
  const textoLimpo = texto.replace(/\*\*/g, '').replace(/\*/g, '')

  // Regex mais flexível para capturar as seções
  const resumoMatch = textoLimpo.match(/📌\s*Resumo Executivo:?\s*([\s\S]*?)(?=⚠️|🚀|$)/i)
  const atencaoMatch = textoLimpo.match(/⚠️\s*Pontos de Atenção:?\s*([\s\S]*?)(?=🚀|📌|$)/i)
  const oportunidadesMatch = textoLimpo.match(/🚀\s*Oportunidades:?\s*([\s\S]*?)$/i)

  const resumo = resumoMatch ? resumoMatch[1].trim() : ''

  const atencao = atencaoMatch
    ? atencaoMatch[1]
        .split('\n')
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0)
    : []

  const oportunidades = oportunidadesMatch
    ? oportunidadesMatch[1]
        .split('\n')
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0)
    : []

  return { resumo, atencao, oportunidades }
}