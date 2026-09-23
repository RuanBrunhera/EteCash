import { useEffect, useState } from "react";
import { Plus, Pencil, X, Package } from "lucide-react";
import { produtoService } from "../../../services/produtoService";

function getEstoqueStatus(estoque) {
  if (estoque === 0) return "esgotado";
  if (estoque <= 10) return "baixo";
  return "normal";
}

function getEstoqueCor(status) {
  if (status === "esgotado") return "text-red-400";
  if (status === "baixo") return "text-yellow-400";
  return "text-zinc-500";
}

function ProdutoCard({ produto, onEdit }) {
  const status = getEstoqueStatus(produto.estoque);
  const estoqueLabel = getEstoqueCor(status);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="size-10 rounded-xl bg-red-600/10 grid place-items-center">
          <Package className="size-5 text-red-500" />
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            produto.ativo
              ? "bg-emerald-400/10 text-emerald-400"
              : "bg-zinc-700 text-zinc-400"
          }`}
        >
          {produto.ativo ? "Ativo" : "Inativo"}
        </span>
      </div>

      <div>
        <h3 className="text-white font-semibold">{produto.nome}</h3>
        {produto.descricao && (
          <p className="text-zinc-500 text-sm mt-1 line-clamp-2">
            {produto.descricao}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-800">
        <div>
          <p className="text-white font-bold text-lg">
            R$ {produto.preco.toFixed(2)}
          </p>
          <p className={`text-xs ${estoqueLabel}`}>
            Estoque: {produto.estoque}
          </p>
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
  );
}

function ProdutoModal({ produto, onClose, onSave }) {
  const isEdicao = Boolean(produto?.id);

  const [form, setForm] = useState({
    nome: produto?.nome || "",
    descricao: produto?.descricao || "",
    preco: produto?.preco ?? "",
    estoque: produto?.estoque ?? "",
    ativo: produto?.ativo ?? true,
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);

    if (!form.nome || !form.preco) {
      setErro("Preencha nome e preço.");
      return;
    }

    setSalvando(true);
    const payload = {
      nome: form.nome,
      descricao: form.descricao || null,
      preco: parseFloat(form.preco),
      ativo: form.ativo,
    };

    const estoqueTexto = String(form.estoque).trim();
    if (estoqueTexto !== "") {
      payload.estoque = parseInt(estoqueTexto, 10);
    }

    const resultado = await onSave(payload);
    if (resultado.error) {
      setErro(resultado.error);
    }
    setSalvando(false);
  };

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
            {isEdicao ? "Editar produto" : "Novo produto"}
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
              onChange={(e) => handleChange("nome", e.target.value)}
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
              required
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">
              Descrição
            </label>
            <textarea
              value={form.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              rows={2}
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.preco}
                onChange={(e) => handleChange("preco", e.target.value)}
                className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                required
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">
                Estoque
              </label>
              <input
                type="number"
                min="0"
                value={form.estoque}
                onChange={(e) => handleChange("estoque", e.target.value)}
                className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {isEdicao && (
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={form.ativo}
                onChange={(e) => handleChange("ativo", e.target.checked)}
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
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReceberCargaModal({ produtos, onClose, onConfirm }) {
  const [quantidades, setQuantidades] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleQuantidadeChange = (produtoId, valor) => {
    setQuantidades((prev) => ({ ...prev, [produtoId]: valor }));
  };

 const handleConfirmar = async () => {
  setErro(null)
  setSalvando(true)

  const entradasEstoque = Object.entries(quantidades)
    .filter(([produtoId, quantidadeRecebida]) => Number(quantidadeRecebida) > 0)
    .map(([produtoId, quantidadeRecebida]) => ({
      produtoId,
      quantidadeRecebida: Number(quantidadeRecebida),
    }))

  const { falhas } = await onConfirm(entradasEstoque)

  if (falhas && falhas.length > 0) {
    setErro(falhas.join(' | '))
  } else {
    onClose()
  }

  setSalvando(false)
}

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-lg shadow-xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Receber carga</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {erro && <p className="text-red-400 text-sm mb-3">{erro}</p>}

        <div className="space-y-2 overflow-y-auto flex-1">
          {produtos.map((p) => (
            <div key={p.id} className="bg-zinc-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold">{p.nome}</h4>
                  <p className="text-zinc-400 text-sm">
                    Estoque atual: {p.estoque}
                  </p>
                </div>
                <input
                  type="number"
                  min="0"
                  value={quantidades[p.id] || ""}
                  onChange={(e) => handleQuantidadeChange(p.id, e.target.value)}
                  className="w-20 rounded-lg bg-zinc-700 border border-zinc-600 px-2 py-1 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4 mt-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-zinc-800 text-white text-sm font-medium py-2.5 hover:bg-zinc-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={salvando}
            className="flex-1 rounded-xl bg-red-600 text-white text-sm font-medium py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Confirmar entrada"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProdutosCantina() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);
  const [modalProdutoAberto, setModalProdutoAberto] = useState(false);
  const [modalReceberCargaAberto, setModalReceberCargaAberto] = useState(false);
  const [filtroEstoque, setFiltroEstoque] = useState("todos"); //pode ser "todos", "baixo" ou "esgotado"

  const buscarProdutos = async () => {
    try {
      const { data, error } = await produtoService.listarProdutos();

      if (!error && data) {
        setProdutos(data);
      } else {
        setErro("Erro ao carregar os produtos.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  const abrirNovoProduto = () => {
    setProdutoEmEdicao(null);
    setModalProdutoAberto(true);
  };

  const abrirEdicao = (produto) => {
    setProdutoEmEdicao(produto);
    setModalProdutoAberto(true);
  };

  const fecharModal = () => {
    setModalProdutoAberto(false);
    setProdutoEmEdicao(null);
  };

  const salvarProduto = async (dados) => {
    const isEdicao = Boolean(produtoEmEdicao?.id);

    const { data, error } = isEdicao
      ? await produtoService.atualizarProduto(produtoEmEdicao.id, dados)
      : await produtoService.criarProduto(dados);

    if (error) {
      return { error };
    }

    fecharModal();
    buscarProdutos();
    return { data, error: null };
  };

  const confirmarCarga = async (entradasEstoque) => {
    const resultados = await Promise.all(
      entradasEstoque.map(async ({ produtoId, quantidadeRecebida }) => {
        const produto = produtos.find((p) => p.id === Number(produtoId));
        if (!produto) {
          return { error: `Produto com ID ${produtoId} não encontrado.` };
        }

        const novoEstoque = produto.estoque + quantidadeRecebida;
        const { error } = await produtoService.atualizarProduto(produtoId, {
          estoque: novoEstoque,
        });
        return { error: error ? `${produto.nome} : ${error}` : null };
      }),
    );

    const falhas = resultados.filter((r) => r.error).map((r) => r.error);

    buscarProdutos();
    return { falhas };
  };

  const produtosFiltrado = produtos.filter((p) => {
    const status = getEstoqueStatus(p.estoque);
    return filtroEstoque === "todos" || status === filtroEstoque;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Produtos</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Gerencie o catálogo da cantina
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setModalReceberCargaAberto(true)}
            className="flex items-center gap-2 rounded-xl bg-zinc-800 text-white text-sm font-medium px-4 py-2.5 hover:bg-zinc-700 transition-colors"
          >
            Adicionar carga
          </button>
          <button
            onClick={abrirNovoProduto}
            className="flex items-center gap-2 rounded-xl bg-red-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-red-700 transition-colors"
          >
            <Plus size={18} />
            Novo produto
          </button>
        </div>
      </div>

      {erro && <p className="text-red-400 text-sm">{erro}</p>}

      {loading ? (
        <p className="text-zinc-400">Carregando produtos...</p>
      ) : (
        <>
          {/* Botões de filtro */}
          <div className="flex gap-2">
            <button
              onClick={() => setFiltroEstoque("todos")}
              className={`text-sm px-4 py-2 rounded-xl transition-colors ${
                filtroEstoque === "todos"
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              Todos os produtos
            </button>
            <button
              onClick={() => setFiltroEstoque("baixo")}
              className={`text-sm px-4 py-2 rounded-xl transition-colors ${
                filtroEstoque === "baixo"
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              Estoque baixo
            </button>
            <button
              onClick={() => setFiltroEstoque("esgotado")}
              className={`text-sm px-4 py-2 rounded-xl transition-colors ${
                filtroEstoque === "esgotado"
                  ? "bg-red-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              Fora de estoque
            </button>
          </div>

          {/* Lista única já filtrada */}
          {produtosFiltrado.length === 0 ? (
            <p className="text-zinc-400">Nenhum produto encontrado</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {produtosFiltrado.map((p) => (
                <ProdutoCard key={p.id} produto={p} onEdit={abrirEdicao} />
              ))}
            </div>
          )}
        </>
      )}

      {modalProdutoAberto && (
        <ProdutoModal
          produto={produtoEmEdicao}
          onClose={fecharModal}
          onSave={salvarProduto}
        />
      )}

      {modalReceberCargaAberto && (
        <ReceberCargaModal
          produtos={produtos}
          onClose={() => setModalReceberCargaAberto(false)}
          onConfirm={confirmarCarga}
        />
      )}
    </div>
  );
}
