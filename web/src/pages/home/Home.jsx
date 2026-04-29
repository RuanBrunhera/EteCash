import WelcomeCard from "../../components/dashboard/welcomeCard.jsx"
import Sidebar from "../../components/sideBar/sideBar.jsx"
import StatCard from "../../components/dashboard/statCard.jsx"
import { Wallet, ShoppingBag, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50 m-3">

      <main className="flex-1 overflow-auto bg-white rounded-r-3xl p-8">
        <div className="space-y-6">

          {/* WelcomeCard ocupa a linha inteira */}
          <WelcomeCard />

          {/* StatCards em grid na linha abaixo */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <StatCard title="Saldo" value="R$ 47,50" icon={Wallet} />
            <StatCard title="Pedidos" value="12" icon={ShoppingBag} />
            <StatCard title="Gasto este mês" value="R$ 89,00" icon={TrendingUp} />
          </div>

        </div>
      </main>
    </div>
  )
}