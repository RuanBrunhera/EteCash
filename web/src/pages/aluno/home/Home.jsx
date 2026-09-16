import { useState, useEffect } from "react"
import WelcomeCardAluno from "../../../components/dashboard/WelcomeCardAluno.jsx"
import { Wallet, ShoppingBag, TrendingDown } from "lucide-react"
import { alunoService } from "../../../services/alunoService.js"

function ResumoCard({ title, value, icon: Icon, color }) {
  const colors = {
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
    green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  }

  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-zinc-400">{title}</p>
        <Icon size={20} className={colors[color].split(' ')[0]} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-500 mt-1">mês atual</p>
    </div>
  )
}

export default function Home() {
  const [resumo, setResumo] = useState({
    totalDepositos: 0,
    totalGasto: 0,
    numeroPedidos: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarResumo() {
    try {
      const { data, error } = await alunoService.buscarResumoMes()

      if (!error && data) {
        setResumo({
          totalDepositos: data.totalDepositos,
          totalGasto: data.totalGasto,
          numeroPedidos: data.numeroPedidos,
        })
      }
    } finally {
      setLoading(false)
    }
    }
    carregarResumo()
  }, [])
  
  const mes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <main className="flex-1 overflow-auto p-8">
      <div className="space-y-6">
        <WelcomeCardAluno />

        {/* Resumo do mês */}
        <div>
          <h2 className="text-white font-semibold mb-4">
            Resumo de {mes}
          </h2>
          {loading ? (
            <p className="text-zinc-400">Carregando resumo do mês...</p>
          ): (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <ResumoCard 
                title="Total Depositado"
                value={`R$ ${resumo.totalDepositos.toFixed(2)}`}
                icon={Wallet}
                color="green"
              />
               <ResumoCard 
                title="Total gasto"
                value={`R$ ${resumo.totalGasto.toFixed(2)}`}
                icon={TrendingDown}
                color="red"
              /> 
              <ResumoCard 
                title="Pedidos realizados"
                value={`${resumo.numeroPedidos}`}
                icon={ShoppingBag}
                color="blue"
              />
            </div>
          )}
        </div>

      </div>
    </main>
  )
}