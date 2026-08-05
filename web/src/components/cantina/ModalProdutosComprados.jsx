export default function ModalProdutosComprados({ itens, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">Produtos comprados</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            Fechar
          </button>
        </div>

        {itens.length === 0 ? (
          <p className="text-zinc-400">Nenhum item encontrado.</p>
        ) : (
          <div className="space-y-3">
            {itens.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold">{item.produto_nome}</p>
                    <p className="text-zinc-400 text-sm">
                      Quantidade: {item.quantidade}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white">
                      R$ {item.preco_unitario.toFixed(2)}
                    </p>
                    <p className="text-zinc-400 text-sm">
                      Subtotal: R$ {item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}