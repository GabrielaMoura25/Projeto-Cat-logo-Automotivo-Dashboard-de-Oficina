import "./OrdersTable.css"

export default function OrdersTable({ orders }) {
  const getStatusColor = (status) => {
    return status === "aberta" ? "warning" : "success"
  }

  return (
    <div className="orders-table-card">
      <div className="orders-table-header">
        <h2>Ordens de Serviço</h2>
        <div className="orders-count">
          <span>
            {orders.length} {orders.length === 1 ? "ordem" : "ordens"}
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Valor</th>
              <th>Abertura</th>
              <th>Fechamento</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <span className="order-id">#{order.id}</span>
                </td>
                <td>
                  <span className={`status-badge status-${getStatusColor(order.status)}`}>{order.status}</span>
                </td>
                <td className="value-cell">R$ {order.valor.toFixed(2)}</td>
                <td className="date-cell">{order.dataAbertura}</td>
                <td className="date-cell">{order.dataFechamento || <span className="empty-value">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
