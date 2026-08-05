import { useEffect, useState } from "react"
import { API_URL } from "../../config/api" 
import ModalSucesso from "../common/ModalSucesso"
import { Search } from 'lucide-react'

export default function CarrinhoVenda({ onClose }) {
  const [etapa, setEtapa] = useState('buscar-aluno')
  const [dadosVenda, setDadosVenda] = useState({
    aluno: null,
    itens: [],
    pin: '',
  })
  const [rmInput, setRmInput] = useState('')
  const [buscandoAluno, setBuscandoAluno] = useState(false)
  const [erroAluno, setErroAluno] = useState('')
  const [produtos, setProdutos] = useState([])
  const [carregandoProdutos, setCarregandoProdutos] = useState(false)
  const [erroProdutos, setErroProdutos] = useState('')
  const [finalizando, setFinalizando] = useState(false)
  const [erroFinalizar, setErroFinalizar] = useState('')
  const [vendaConcluida, setVendaConcluida] = useState(false)
  const [buscaProduto, setBuscaProduto] = useState('')

  const produtosFiltrados = produtos.filter(produto => produto.nome.toLowerCase().includes(buscaProduto.toLocaleLowerCase()))

  function buscarAluno() {
    const token = localStorage.getItem('token')

    if (!token) {
      setErroAluno('Token de autenticação não encontrado. Faça login novamente.')
      return
    }

    setErroAluno('')
    setBuscandoAluno(true)

    fetch(`${API_URL}/api/func/aluno/${rmInput}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.aluno) {
          setDadosVenda((prevDadosVenda) => {
            return { ...prevDadosVenda, aluno: data.aluno }
          })
        } else {
          setErroAluno(data.error || 'Erro ao buscar aluno')
        }
      })
      .catch((err) => {
        console.error('Erro ao buscar aluno:', err)
        setErroAluno('Erro ao buscar aluno. Verifique o RM e tente novamente.')
      })
      .finally(() => setBuscandoAluno(false))
  }

  useEffect(() => {
    if (etapa !== 'produtos') return

    const token = localStorage.getItem('token')
    if (!token) {
      setErroProdutos('Token de autenticação não encontrado. Faça login novamente.')
      return
    } 

    setErroProdutos('')
    setCarregandoProdutos(true)

    fetch(`${API_URL}/api/func/produtos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => res.json())
    .then((data) => {
      setProdutos(data.produtos) 
    })
    .catch((err) => setErroProdutos('Não foi possível carregar os produtos. Tente novamente mais tarde.'))
    .finally(() => setCarregandoProdutos(false))
  }, [etapa])

  useEffect(() => {
      if (etapa !== 'confirmar-pin') return
      setDadosVenda((prevDadosVenda) => ({  ...prevDadosVenda, pin: '' }))
  }, [etapa])

  function quantidadeDoProduto(produtoId) {
    const item = dadosVenda.itens.find((item) => item.produto_id === produtoId)
    return item ? item.quantidade : 0
  }

  function alterarQuantidade(produtoId, delta) {
    const quantidadeAtual = quantidadeDoProduto(produtoId)
    const novaQuantidade = Math.max(0, quantidadeAtual + delta)

    setDadosVenda((prevDadosVenda) => {
      if (novaQuantidade === 0) {
        // Caso 1: quantidade zerou, remove o item do array
        return {
          ...prevDadosVenda,
          itens: prevDadosVenda.itens.filter(item => item.produto_id !== produtoId)
        }
      }

      if (quantidadeAtual === 0) {
        // Caso 2: item ainda não estava no carrinho, adicionar um novo no array
          return {
            ...prevDadosVenda,
            itens: [ ...prevDadosVenda.itens, {produto_id: produtoId, quantidade: novaQuantidade }]
          }
      }

      // Caso 3: item ja ta no carrinho, só atualiza a quantidade dele
      return {
        ...prevDadosVenda,
        itens: prevDadosVenda.itens.map((item) =>
          item.produto_id === produtoId ? { ...item, quantidade: novaQuantidade } : item
        )
      }
    })
  }

  function totalParcial() {
    return dadosVenda.itens.reduce((total, item) => {
      const produto = produtos.find(p => p.id === item.produto_id)
      if (produto) {
        return total + (produto.preco * item.quantidade)
      }
      return total
    }, 0)
  }

  function finalizarVenda() {
    const token = localStorage.getItem('token')

    if (!token) {
      setErroFinalizar('Token de autenticação não encontrado. Faça login novamente.')
      return
    }

    const payload = {
      aluno_rm: dadosVenda.aluno.rm,
      aluno_pin: dadosVenda.pin,
      itens: dadosVenda.itens
    }

    setErroFinalizar('')
    setFinalizando(true)

    fetch(`${API_URL}/api/func/transacao`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    .then(res => res.json())
    .then(data => {
      if (data.transacao) {
        setVendaConcluida(true)
      } else {
        setErroFinalizar(data.error || 'Erro ao finalizar a venda')
        setDadosVenda((prevDadosVenda) => ({ ...prevDadosVenda, pin: '' }))
      }
    })

  .catch((err) => {
    console.error('Erro ao finalizar a venda:', err)
    setErroFinalizar('Erro ao finalizar a venda. Tente novamente mais tarde.')
  })

  .finally(() => setFinalizando(false))
  }

  return (
    <div className="p-6">
      {etapa === 'buscar-aluno' && (
  <div className="max-w-md space-y-4">
    <h2 className="text-white font-semibold text-lg">
      {dadosVenda.aluno ? 'Confirmar aluno' : 'Buscar aluno'}
    </h2>

    {!dadosVenda.aluno ? (
      <>
        <input
          type="text"
          value={rmInput}
          onChange={(e) => setRmInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') buscarAluno()
          }}
          placeholder="Digite o RM do aluno"
          className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
          maxLength={11}
        />
        <button
          onClick={buscarAluno}
          disabled={buscandoAluno}
          className="w-full rounded-xl bg-red-600 text-white text-sm font-medium py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buscandoAluno ? 'Buscando...' : 'Buscar aluno'}
        </button>
        {erroAluno && <p className="text-red-500 text-sm">{erroAluno}</p>}
      </>
    ) : (
      <div className="space-y-3">
        <div className="rounded-2xl bg-zinc-800 border border-zinc-700 p-4">
          <p className="text-white font-semibold">{dadosVenda.aluno.nome}</p>
          <p className="text-zinc-400 text-sm">RM: {dadosVenda.aluno.rm}</p>
        </div>

        <div className="flex gap-3">
  <button
    onClick={() =>
      setDadosVenda((prevDadosVenda) => ({ ...prevDadosVenda, aluno: null }))
    }
    className="flex-1 rounded-xl bg-zinc-800 text-white text-sm font-medium py-2.5 hover:bg-zinc-700 transition-colors"
  >
    Trocar aluno
  </button>
  <button
    onClick={() => setEtapa('produtos')}
    className="flex-1 rounded-xl bg-red-600 text-white text-sm font-medium py-2.5 hover:bg-red-700 transition-colors"
  >
    Confirmar
  </button>
</div>
      </div>
    )}
  </div>
)}

      {etapa === 'produtos' && (
  <div className="max-w-2xl space-y-4">
    <h2 className="text-white font-semibold text-lg">Selecionar produtos</h2>

    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
      <input 
        type="text"
        value={buscaProduto}
        onChange={(e) => setBuscaProduto(e.target.value)}
        placeholder="Buscar produto..."
        className="w-full rounded-xl bg-zinc-800 border border-zinc-700 pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
      />
    </div>

    <div className="border-t border-zinc-800 pt-4 space-y-3">
      {carregandoProdutos && <p className="text-zinc-400">Carregando produtos...</p>}
      {erroProdutos && <p className="text-red-500 text-sm">{erroProdutos}</p>}

      {produtosFiltrados.map((produto) => {
        const quantidade = quantidadeDoProduto(produto.id)
        return (
          <div
            key={produto.id}
            className="flex items-center justify-between rounded-2xl bg-zinc-800 border border-zinc-700 p-4"
          >
            <div>
              <p className="text-white font-semibold">{produto.nome}</p>
              <p className="text-zinc-400 text-sm">R$ {produto.preco.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => alterarQuantidade(produto.id, -1)}
                disabled={quantidade === 0}
                className="size-8 rounded-lg bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="text-white font-medium w-4 text-center">{quantidade}</span>
              <button
                onClick={() => alterarQuantidade(produto.id, 1)}
                className="size-8 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        )
      })}
    </div>

    <div className="rounded-2xl bg-zinc-800 border border-zinc-700 p-4">
      <p className="text-white font-semibold">
        Total parcial: <span className="text-emerald-400">R$ {totalParcial().toFixed(2)}</span>
      </p>
    </div>

    <div className="flex gap-3">
      <button
        onClick={() => {
          setDadosVenda({ aluno: null, itens: [], pin: '' })
          setRmInput('')
          setEtapa('buscar-aluno')
        }}
        className="flex-1 rounded-xl bg-zinc-800 text-white text-sm font-medium py-2.5 hover:bg-zinc-700 transition-colors"
      >
        Voltar
      </button>
      <button
        onClick={() => setEtapa('confirmar-pin')}
        disabled={dadosVenda.itens.length === 0}
        className="flex-1 rounded-xl bg-red-600 text-white text-sm font-medium py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar
      </button>
    </div>
  </div>
)}

      {etapa === 'confirmar-pin' && (
  <div className="max-w-2xl space-y-4">
    <h2 className="text-white font-semibold text-lg">Confirmar com PIN</h2>

    <div className="rounded-2xl bg-zinc-800 border border-zinc-700 p-4">
      <p className="text-white font-semibold">
        Total da compra: <span className="text-emerald-400">R$ {totalParcial().toFixed(2)}</span>
      </p>
    </div>

    <input
      value={dadosVenda.pin}
      onChange={(e) => setDadosVenda((prevDadosVenda) => ({ ...prevDadosVenda, pin: e.target.value }))}
      onKeyDown={(e) => {
        if (e.key === 'Enter') finalizarVenda()
      }}
      type="password"
      maxLength={4}
      placeholder="Digite o PIN do aluno"
      autoComplete="new-password"
      className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
    />

    {erroFinalizar && <p className="text-red-500 text-sm">{erroFinalizar}</p>}

    <div className="flex gap-3">
      <button
        onClick={() => setEtapa('produtos')}
        className="flex-1 rounded-xl bg-zinc-800 text-white text-sm font-medium py-2.5 hover:bg-zinc-700 transition-colors"
      >
        Voltar
      </button>
      <button
        onClick={finalizarVenda}
        disabled={finalizando}
        className="flex-1 rounded-xl bg-red-600 text-white text-sm font-medium py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {finalizando ? 'Finalizando...' : 'Finalizar'}
      </button>
    </div>
  </div>
)}

      {vendaConcluida && (
        <ModalSucesso 
          titulo="Venda concluída com sucesso!"
          mensagem="A transação foi registrada com sucesso."
          onFechar={() => {
            setDadosVenda({ aluno: null, itens: [], pin: '' })
            setRmInput('')
            setProdutos([])
            setErroAluno('')
            setErroProdutos('')
            setErroFinalizar('')
            setVendaConcluida(false)
            setEtapa('buscar-aluno')
          }}
        />
      )}

    </div>
  )
}