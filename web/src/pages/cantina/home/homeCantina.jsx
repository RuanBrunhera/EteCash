import { useEffect, useState } from 'react'
import {
  DollarSign,
  ShoppingBag,
  Trophy,
} from 'lucide-react'
import WelcomeCardCantina from '../../../components/cantina/welcomeCardCantina'
import { API_URL } from '../../../config/api'

function ResumoCardCantina({ title, value, icon: Icon, color }) {
  const colors = {
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
    green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  }

  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <p className='text-sm text-zinc-400'>{title}</p>
      <Icon size={24} className={colors[color].split(' ')[0]} />
      <span className='text-2xl font-bold text-white'>{value}</span>
    </div>
  )
}

export default function HomeCantina() {
  const [resumo, setResumo] = useState({
    faturamento: 0,
    numero_vendas: 0,
    produto_mais_vendido: '—',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    fetch(`${API_URL}/api/func/resumo-dia`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setResumo({
          faturamento: data.faturamento || 0,
          numero_vendas: data.numero_vendas || 0,
          produto_mais_vendido: data.produto_mais_vendido || '—',
        })
      })
      .catch((err) => console.error('Erro ao buscar resumo do dia:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className='p-8 space-y-6'>
      <div>
        <WelcomeCardCantina />
        <h2 className='text-white font-semibold mb-4 mt-6'>Resumo de hoje</h2>
        {loading ? (
          <p className="text-zinc-400">Carregando...</p>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <ResumoCardCantina
              title="Faturamento"
              value={`R$ ${resumo.faturamento.toFixed(2)}`}
              icon={DollarSign}
              color="green"
            />
            <ResumoCardCantina
              title="Numero de vendas"
              value={resumo.numero_vendas}
              icon={ShoppingBag}
              color="blue"
            />
            <ResumoCardCantina
              title="Produto mais vendido"
              value={resumo.produto_mais_vendido}
              icon={Trophy}
              color="red"
            />
          </div>
        )}
      </div>
    </div>
  )
}