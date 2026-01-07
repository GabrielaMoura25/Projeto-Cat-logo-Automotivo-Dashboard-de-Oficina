import { useOrders } from "./hooks/userOrders"
import { Indicators } from "./components/Indicators"
import { AIInsights } from "./components/AIInsights"
import OrdersTable from "./components/OrdersTable"
import "./App.css"

function App() {
  const dados = useOrders()

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Dashboard da Oficina</h1>
      </header>

      <div className="dashboard-grid">
        <Indicators {...dados} />
      </div>

      <div className="dashboard-grid">
        <AIInsights dados={dados} />
      </div>

      <div className="dashboard-grid">
        <OrdersTable orders={dados.orders} />
      </div>
    </div>
  )
}

export default App
