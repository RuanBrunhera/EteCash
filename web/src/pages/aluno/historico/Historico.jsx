import { useEffect, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { alunoService } from '../../../services/alunoService'
import ModalProdutosComprados from '../../../components/venda/ModalProdutosComprados'

function TransacaoCard({ tipo, valor, formaPagamento, data_hora, transacao_id, onDetalhes, carregandoDetalhes }) {
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
        {tipo === 'debito' && transacao_id && (
          <button
  type="button"
  onClick={() => onDetalhes(transacao_id)}
  disabled={carregandoDetalhes}
  className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"
>
  {carregandoDetalhes ? 'Carregando...' : 'Ver produtos'}
</button>
        )}
      </div>
    </div>
  )
}

export default function Historico() {
  const [transacoes, setTransacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null)
  const [transacaoCarregando, setTransacaoCarregando] = useState(null)
  const [erroDetalhe, setErroDetalhe] = useState(null)
  const [erroHistorico, setErroHistorico] = useState(null)

  const buscarDetalhe = async (transacaoId) => {
    setTransacaoCarregando(transacaoId)
    setErroDetalhe(null)

    const { data, error } = await alunoService.buscarDetalheTransacao(transacaoId)

    if (error) {
      setErroDetalhe(error)
    } else {
      setTransacaoSelecionada(data)
      setErroDetalhe(null)
    }

    setTransacaoCarregando(null)
  }

  useEffect(() => {
    async function carregarHistorico() {
      setErroHistorico(null)

      try {
        const { data, error } = await alunoService.buscarHistorico()

        if (error) {
          setErroHistorico(error)
          return
        }

        setTransacoes(data || [])
      } finally {
        setLoading(false)
      }
    }

    carregarHistorico()
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
      ) : erroHistorico ? (
        <p className="text-red-400" role="alert">{erroHistorico}</p>
      ) : transacoes.length === 0 ? (
        <p className="text-zinc-400">Nenhuma transação encontrada.</p>
      ) : (
        <div className="space-y-3">
          {transacoes.map((t) => (
            <TransacaoCard
              key={t.id}
              {...t}
              onDetalhes={buscarDetalhe}
              carregandoDetalhes={transacaoCarregando === t.transacao_id}
            />
          ))}
        </div>
      )}

      {erroDetalhe && (
  <p className="text-red-400 flex items-center gap-2 text-sm" role="alert">
    {erroDetalhe}
    <button
      type="button"
      onClick={() => setErroDetalhe(null)}
      className="underline hover:text-red-300"
    >
      Fechar
    </button>
  </p>
)}

      {transacaoSelecionada && (
        <ModalProdutosComprados
          itens={transacaoSelecionada.itens || []}
          onClose={() => {
            setTransacaoSelecionada(null)
            setErroDetalhe(null)
          }}
        />
      )}
    </div>
  )
}