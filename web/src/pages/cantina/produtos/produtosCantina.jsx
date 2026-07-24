// src/pages/cantina/produtos/produtosCantina.jsx
import { useEffect, useState } from 'react'
import { Plus, Pencil, X, Package } from 'lucide-react'
import { API_URL } from '../../../config/api'

function ProdutoCard({ produto, onEdit }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="size-10 rounded-xl bg-red-600/10 grid place-items-center">
          <Package className="size-5 text-red-500" />
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            produto.ativo
              ? 'bg-emerald-400/10 text-emerald-400'
              : 'bg-zinc-700 text-zinc-400'
          }`}
        >
          {produto.ativo ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <div>
        <h3 className="text-white font-semibold">{produto.nome}</h3>
        {produto.descricao && (
          <p className="text-zinc-500 text-sm mt-1 line-clamp-2">{produto.descricao}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-800">
        <div>
          <p className="text-white font-bold text-lg">R$ {produto.preco.toFixed(2)}</p>
          <p className="text-xs text-zinc-500">Estoque: {produto.estoque}</p>
        </div>
        <button
          onClick={() => onEdit(produto)}
          className="rounded-lg bg-zinc-800 p-2 hover:bg-zinc-700 transition-colors"
          aria-label="Editar produto"
        >
          <Pencil size={16} className="text-zinc-300" />
        </button>
      </div>
    </div>
  )
}

function ProdutoModal({ produto, onClose, onSave }) {
  const isEdicao = Boolean(produto?.id)

  const [form, setForm] = useState({
    nome: produto?.nome || '',
    descricao: produto?.descricao || '',
    preco: produto?.preco ?? '',
    estoque: produto?.estoque ?? '',
    ativo: produto?.ativo ?? true,
  })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro(null)

    if (!form.nome || !form.preco) {
      setErro('Preencha nome e preço.')
      return
    }

    setSalvando(true)
    try {
      await onSave({
        nome: form.nome,
        descricao: form.descricao || null,
        preco: parseFloat(form.preco),
        estoque: parseInt(form.estoque, 10) || 0,
        ativo: form.ativo,
      })
    } catch (err) {
      setErro(err.message || 'Erro ao salvar produto.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">
            {isEdicao ? 'Editar produto' : 'Novo produto'}
          </h3>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && <p className="text-red-400 text-sm">{erro}</p>}

          <div>
            <label className="text-xs text-zinc-400 block mb-1">Nome</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
              required
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              rows={2}
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.preco}
                onChange={(e) => handleChange('preco', e.target.value)}
                className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                required
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Estoque</label>
              <input
                type="number"
                min="0"
                value={form.estoque}
                onChange={(e) => handleChange('estoque', e.target.value)}
                className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {isEdicao && (
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={form.ativo}
                onChange={(e) => handleChange('ativo', e.target.checked)}
                className="rounded"
              />
              Produto ativo
            </label>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-zinc-800 text-white text-sm font-medium py-2.5 hover:bg-zinc-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 rounded-xl bg-red-600 text-white text-sm font-medium py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ProdutosCantina() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)

  const token = localStorage.getItem('token')

  const buscarProdutos = () => {
    if (!token) {
      setLoading(false)
      return
    }

    fetch(`${API_URL}/api/func/produtos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProdutos(data.produtos || []))
      .catch((err) => {
        console.error('Erro ao buscar produtos:', err)
        setErro('Erro ao carregar produtos.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    buscarProdutos()
  }, [])

  const abrirNovoProduto = () => {
    setProdutoEmEdicao(null)
    setModalAberto(true)
  }

  const abrirEdicao = (produto) => {
    setProdutoEmEdicao(produto)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setProdutoEmEdicao(null)
  }

  const salvarProduto = async (dados) => {
    const isEdicao = Boolean(produtoEmEdicao?.id)
    const url = isEdicao
      ? `${API_URL}/api/func/produto/${produtoEmEdicao.id}`
      : `${API_URL}/api/func/produto`
    const method = isEdicao ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao salvar produto')
    }

    fecharModal()
    buscarProdutos()
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Produtos</h2>
          <p className="text-zinc-400 text-sm mt-1">Gerencie o catálogo da cantina</p>
        </div>
        <button
          onClick={abrirNovoProduto}
          className="flex items-center gap-2 rounded-xl bg-red-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-red-700 transition-colors"
        >
          <Plus size={18} />
          Novo produto
        </button>
      </div>

      {erro && <p className="text-red-400 text-sm">{erro}</p>}

      {loading ? (
        <p className="text-zinc-400">Carregando...</p>
      ) : produtos.length === 0 ? (
        <p className="text-zinc-400">Nenhum produto cadastrado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {produtos.map((p) => (
            <ProdutoCard key={p.id} produto={p} onEdit={abrirEdicao} />
          ))}
        </div>
      )}

      {modalAberto && (
        <ProdutoModal
          produto={produtoEmEdicao}
          onClose={fecharModal}
          onSave={salvarProduto}
        />
      )}
    </div>
  )
}