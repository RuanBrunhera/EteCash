import { useEffect, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { API_URL } from '../../../config/api'

function TransacaoCard({ tipo, valor, formaPagamento, data_hora }) {
  const isCredito = tipo === 'credito'

  const formatarData = (dataISO) => {
    return new Date(dataISO).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isCredito ? 'bg-emerald-400/10' : 'bg-red-500/10'
        }`}>
          {isCredito
            ? <Plus size={18} className='text-emerald-400' />
            : <Minus size={18} className='text-red-400' />
          }
        </div>
        <div>
          <p className={`font-medium capitalize ${isCredito ? 'text-emerald-400' : 'text-red-400'}`}>
            {isCredito ? 'Crédito' : 'Débito'}
          </p>
          <p className="text-sm text-zinc-500">{formaPagamento}</p>
        </div>
      </div>

      <div className="text-right">
        <p className={`font-bold text-lg ${isCredito ? 'text-emerald-400' : 'text-red-400'}`}>
          {isCredito ? '+' : '-'} R$ {valor.toFixed(2)}
        </p>
        <p className="text-sm text-zinc-500">{formatarData(data_hora)}</p>
      </div>
    </div>
  )
}

export default function Historico() {
  const [transacoes, setTransacoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch(`${API_URL}/api/aluno/historico`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setTransacoes(data.historico || [])
      })
      .catch(err => console.error('Erro ao buscar histórico:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8 space-y-4">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Histórico de transações</h2>
        <p className="text-zinc-400 text-sm mt-1">Todas as suas movimentações</p>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-zinc-400">Carregando...</p>
      ) : transacoes.length === 0 ? (
        <p className="text-zinc-400">Nenhuma transação encontrada.</p>
      ) : (
        <div className="space-y-3">
          {transacoes.map((t) => (
            <TransacaoCard key={t.id} {...t} />
          ))}
        </div>
      )}

    </div>
  )
}