import { useEffect, useState } from 'react'
import { vendaService } from '../../../services/vendaService'
import ModalProdutosComprados from '../../../components/venda/ModalProdutosComprados'

function formatarData(dataISO) {
  return new Date(dataISO).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function HistoricoCantina() {
  const [transacoes, setTransacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function carregarTransacoes() {
      try {
        const { data, error } = await vendaService.listarTransacoes()
    
        if (!error && data) {
          setTransacoes(data)
        } else {
          setErro("Erro ao carregar histórico de venda.")
        }
      } finally {
        setLoading(false)
      }
    }
    carregarTransacoes()
  },[])

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-white text-2xl font-semibold">Histórico de vendas</h1>
        <p className="text-zinc-400 mt-1">
          Lista de transações com data, aluno, valor total e itens comprados.
        </p>
      </div>

      {erro && <p className="text-red-500 text-sm">{erro}</p>}

      {loading ? (
        <p className="text-zinc-400">Carregando...</p>
      ) : transacoes.length === 0 ? (
        <p className="text-zinc-400">Nenhuma venda encontrada.</p>
      ) : (
        <div className="space-y-4">
          {transacoes.map((transacao) => (
            <div
              key={transacao.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">
                    {formatarData(transacao.data_hora)}
                  </p>
                  <p className="text-white font-semibold">
                    Aluno: {transacao.aluno?.nome || transacao.aluno_rm}
                  </p>
                  <p className="text-emerald-400 font-semibold">
                    Total: R$ {transacao.valor_total.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => setTransacaoSelecionada(transacao)}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
                >
                  Mostrar produtos comprados
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {transacaoSelecionada && (
        <ModalProdutosComprados
          itens={transacaoSelecionada.itens}
          onClose={() => setTransacaoSelecionada(null)}
        />
      )}
    </div>
  )
}