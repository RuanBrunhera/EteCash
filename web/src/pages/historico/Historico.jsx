import { Plus, Minus } from 'lucide-react'

const transacoes = [
  { id: 1, tipo: 'crédito', valor: 50.00, formaPagamento: 'PIX', data: '29/04/2026' },
  { id: 2, tipo: 'débito', valor: 8.50, formaPagamento: 'Saldo', data: '28/04/2026' },
  { id: 3, tipo: 'débito', valor: 12.00, formaPagamento: 'Saldo', data: '27/04/2026' },
  { id: 4, tipo: 'crédito', valor: 100.00, formaPagamento: 'Cartão', data: '26/04/2026' },
  { id: 5, tipo: 'débito', valor: 6.00, formaPagamento: 'Saldo', data: '25/04/2026' },
]

function TransacaoCard({ tipo, valor, formaPagamento, data }) {
  const isCredito = tipo === 'crédito'

  return (
    <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isCredito ? 'bg-emerald-400/10' : 'bg-red-500/10'
        }`}>
            {isCredito ? 
            <Plus size={18} className='text-emerald-400'/>
            :
            <Minus size={18} className='text-red-400'/>   
          }
        </div>
        <div>
          <p className={`font-medium capitalize ${isCredito ? 'text-emerald-400' : 'text-red-400'}`}>
            {tipo}
          </p>
          <p className="text-sm text-zinc-500">{formaPagamento}</p>
        </div>
      </div>

      <div className="text-right">
        <p className={`font-bold text-lg ${isCredito ? 'text-emerald-400' : 'text-red-400'}`}>
          {isCredito ? '+' : '-'} R$ {valor.toFixed(2)}
        </p>
        <p className="text-sm text-zinc-500">{data}</p>
      </div>

    </div>
  )
}

export default function Historico() {
  return (
    <div className="p-8 space-y-4">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Histórico de transações</h2>
        <p className="text-zinc-400 text-sm mt-1">Todas as suas movimentações</p>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {transacoes.map((t) => (
          <TransacaoCard key={t.id} {...t} />
        ))}
      </div>

    </div>
  )
}