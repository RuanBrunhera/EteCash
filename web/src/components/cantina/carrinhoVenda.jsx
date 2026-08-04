import { useEffect, useState } from "react"
import { API_URL } from "../../config/api" 
import ModalSucesso from "../common/ModalSucesso"

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

      {etapa === 'confirmar-pin' && (
        <div className="space-y-4">
    <h2 className="text-white font-semibold text-lg">Confirmar com PIN</h2>

    {/* TODO 1: mostra o total da compra, reaproveitando totalParcial() 
        que você já escreveu na etapa 2 */}

        <p className='text-white font-semibold'>Total da compra: R$ {totalParcial().toFixed(2)}</p>

    {/* TODO 2: input controlado pro PIN —
        value={dadosVenda.pin}
        onChange atualizando dadosVenda via spread (mesmo padrão
        que você já usa pra outros campos desse objeto)
        Dica de UX: pensa em usar type="password" já que é um PIN,
        e maxLength={4} já que o backend só aceita 4 dígitos */}

        <input 
          value={dadosVenda.pin}
          onChange={(e) => setDadosVenda((prevDadosVenda) => ({ ...prevDadosVenda, pin: e.target.value}))}
          type="password"
          maxLength={4}
          placeholder="Digite o PIN do aluno"
          autoComplete="new-password"
        />

    {/* TODO 3: botão "Finalizar" chamando finalizarVenda(),
        desabilitado quando finalizando === true
        (mesmo padrão do botão "Buscar aluno") */}

      <button
        onClick={finalizarVenda}
        disabled={finalizando}
        className={`px-4 py-2 rounded ${finalizando ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
      >
        Finalizar
      </button>

    {/* TODO 4: se erroFinalizar não for vazio, mostra a mensagem
        (mesmo padrão dos outros erros) */}
      {erroFinalizar && (
        <p className='text-red-600'>{erroFinalizar}</p>
      )}

    {/* TODO 5 (opcional): um botão "Voltar" pra etapa 'produtos',
        caso o funcionário queira revisar o carrinho antes de finalizar */}
        <button
          onClick={() => setEtapa('produtos')}
          className='px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white'
        >
          Voltar
        </button>
  </div>
      )}

      {/* TODO 6: renderize o ModalSucesso condicionalmente aqui,
    fora de todos os blocos de etapa (ele deve aparecer por cima
    de tudo, independente de qual etapa estiver ativa) —
    só quando vendaConcluida === true.
    No onFechar, resete TODOS os estados: dadosVenda de volta pro
    inicial, rmInput vazio, produtos, erros, vendaConcluida false,
    e etapa de volta pra 'buscar-aluno' */}

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