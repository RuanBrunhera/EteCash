import { useEffect, useState } from "react"
import { API_URL } from "../../config/api" 

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

  return (
    <div className="p-6">
      {etapa === 'buscar-aluno' && (
        <div className="space-y-4">
          <h2 className="text-white font-semibold text-lg">
            {dadosVenda.aluno ? 'Confirmar aluno' : 'Buscar aluno'}
          </h2>

          {!dadosVenda.aluno ? (
            <>
              <input
                type="text"
                value={rmInput}
                onChange={(e) => setRmInput(e.target.value)}
                placeholder="Digite o RM do aluno"
              />
              <button onClick={buscarAluno} disabled={buscandoAluno}>
                {buscandoAluno ? 'Buscando...' : 'Buscar aluno'}
              </button>
              {erroAluno && <p className="text-red-500">{erroAluno}</p>}
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-white">
                Aluno encontrado: <strong>{dadosVenda.aluno.nome}</strong>
              </p>
              <p className="text-zinc-400 text-sm">RM: {dadosVenda.aluno.rm}</p>

              <div className="flex gap-3">
                <button onClick={() => setEtapa('produtos')}>Confirmar</button>
                <button
                  onClick={() =>
                    setDadosVenda((prevDadosVenda) => {
                      return { ...prevDadosVenda, aluno: null }
                    })
                  }
                >
                  Trocar aluno
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {etapa === 'produtos' && (
        <div className='space-y-4'>
          <h2 className='text-white font-semibold text-lg'>Selecionar produtos</h2>

            {carregandoProdutos && <p className='text-white'>Carregando produtos...</p>}

          {erroProdutos && <p className='text-red-500'>{erroProdutos}</p>}
    
        {produtos.map((produto) => {
          const quantidade = quantidadeDoProduto(produto.id)
          return (
            <div key={produto.id} className='flex items-center justify-between bg-zinc-800 p-3 rounded'>
              <div>
                <p className='text-white font-semibold'>{produto.nome}</p>
                <p className='text-zinc-400'>R$ {produto.preco.toFixed(2)}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => alterarQuantidade(produto.id, -1)}
                    disabled={quantidade === 0}
                    className='bg-red-600 text-white px-2 py-1 rounded disabled:opacity-50'
                    >
                      -
                    </button>
                    <span className='text-white'>{quantidade}</span>
                    <button
                      onClick={() => alterarQuantidade(produto.id, 1)}
                      className='bg-green-600 text-white px-2 py-1 rounded'
                      >
                        +
                        </button>
                        </div>
                        </div>
        )})}

        {dadosVenda.itens.length > 0 && (
          <p className='text-white font-semibold'>Total parcial: R$ {totalParcial().toFixed(2)}</p>
        )}

        <button
          onClick={() => setEtapa('confirmar-pin')}
          disabled={dadosVenda.itens.length === 0}
          className={`px-4 py-2 rounded ${dadosVenda.itens.length === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          Continuar
        </button>

        <button
          onClick={() => {
            setDadosVenda({ aluno: null, itens: [], pin: '' })
            setRmInput('')
            setEtapa('buscar-aluno')
          }}
          className='px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white'
        >
          Voltar
        </button>
        </div>
      )}
    </div>
  )
}