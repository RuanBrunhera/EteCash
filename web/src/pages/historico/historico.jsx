// src/pages/historico/Historico.jsx

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
    <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100">
      
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${isCredito ? 'bg-green-500' : 'bg-red-500'}`} />
        <div>
          <p className="font-medium text-gray-900 capitalize">{tipo}</p>
          <p className="text-sm text-gray-500">{formaPagamento}</p>
        </div>
      </div>

      <div className="text-right">
        <p className={`font-bold ${isCredito ? 'text-green-600' : 'text-red-600'}`}>
          {isCredito ? '+' : '-'} R$ {valor.toFixed(2)}
        </p>
        <p className="text-sm text-gray-400">{data}</p>
      </div>

    </div>
  )
}

export default function Historico() {
  return (
    <div className="space-y-3 p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Histórico de transações</h2>
      {transacoes.map((t) => (
        <TransacaoCard key={t.id} {...t} />
      ))}
    </div>
  )
}