import { useEffect, useState } from 'react'
import { vendaService } from '../../../services/vendaService'
import ModalProdutosComprados from '../../../components/venda/ModalProdutosComprados'
import { formatarMoeda } from '../../../utils/formatarMoeda'

function formatarData(dataISO) {
  return new Date(dataISO).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const MESES = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

function agruparTransacoesPorMes(transacoes) {
  const grupos = new Map()

  transacoes.forEach((transacao) => {
    const data = new Date(transacao.data_hora)
    const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
    const grupo = grupos.get(chave) || {
      chave,
      titulo: `${MESES[data.getMonth()]}/${data.getFullYear()}`,
      transacoes: [],
    }

    grupo.transacoes.push(transacao)
    grupos.set(chave, grupo)
  })

  return Array.from(grupos.values()).sort((a, b) => b.chave.localeCompare(a.chave))
}

export default function HistoricoCantina() {
  const [transacoes, setTransacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null)
  const [erro, setErro] = useState("")
  const [mesSelecionado, setMesSelecionado] = useState("todos")
  const [anoSelecionado, setAnoSelecionado] = useState("todos")

  const anosDisponiveis = Array.from(
    new Set(
      transacoes
        .map((transacao) => String(new Date(transacao.data_hora).getFullYear()))
        .filter((ano) => ano !== "NaN"),
    ),
  ).sort((a, b) => Number(b) - Number(a))

  const transacoesFiltradas = transacoes.filter((transacao) => {
    const data = new Date(transacao.data_hora)
    const mesCorresponde =
      mesSelecionado === "todos" ||
      data.getMonth() + 1 === Number(mesSelecionado)
    const anoCorresponde =
      anoSelecionado === "todos" ||
      data.getFullYear() === Number(anoSelecionado)

    return mesCorresponde && anoCorresponde
  })

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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-white text-2xl font-semibold">Histórico de vendas</h1>
        <p className="text-zinc-400 mt-1">
          Lista de transações com data, aluno, valor total e itens comprados.
        </p>
      </div>

      {erro && <p className="text-red-500 text-sm">{erro}</p>}

      {loading ? (
        <p className="text-zinc-400">Carregando...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-md">
            <label className="space-y-2 text-sm text-zinc-400">
              <span>Mês</span>
              <select
                value={mesSelecionado}
                onChange={(event) => setMesSelecionado(event.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-blue-500"
              >
                <option value="todos">Todos os meses</option>
                {MESES.map((mes, index) => (
                  <option key={mes} value={String(index + 1)}>
                    {mes}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-zinc-400">
              <span>Ano</span>
              <select
                value={anoSelecionado}
                onChange={(event) => setAnoSelecionado(event.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-blue-500"
              >
                <option value="todos">Todos os anos</option>
                {anosDisponiveis.map((ano) => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {transacoes.length === 0 ? (
            <p className="text-zinc-400">Nenhuma venda encontrada.</p>
          ) : transacoesFiltradas.length === 0 ? (
            <p className="text-zinc-400">
              Nenhuma venda encontrada para os filtros selecionados.
            </p>
      ) : (
        <div className="space-y-8">
          {agruparTransacoesPorMes(transacoesFiltradas).map((grupo) => (
            <section key={grupo.chave} className="space-y-4">
              <h2 className="border-b border-zinc-800 pb-3 text-lg font-semibold text-white">
                {grupo.titulo}
              </h2>
              {grupo.transacoes.map((transacao) => (
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
                        Total: {formatarMoeda(transacao.valor_total)}
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
            </section>
          ))}
        </div>
          )}
        </>
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