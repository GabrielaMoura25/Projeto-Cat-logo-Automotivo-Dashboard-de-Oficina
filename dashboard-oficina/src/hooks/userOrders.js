import { orders } from "../data/orders.mock";

export function useOrders() {
  const totalFaturado = orders
    .filter(o => o.status === "fechada")
    .reduce((sum, o) => sum + o.valor, 0);

  const fechadas = orders.filter(o => o.status === "fechada");
  const abertas = orders.filter(o => o.status === "aberta");

  const ticketMedio =
    fechadas.length > 0
      ? totalFaturado / fechadas.length
      : 0;

  return {
    orders,
    totalFaturado,
    ticketMedio,
    abertas: abertas.length,
    fechadas: fechadas.length,
  };
}
