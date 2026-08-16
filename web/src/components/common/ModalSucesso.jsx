export default function ModalSucesso({ titulo, mensagem, onClose }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <div
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="size-12 rounded-2xl bg-emerald-600/10 grid place-items-center mb-4">
                    <span className="text-emerald-400 text-2xl">✓</span>
                </div>

                <h3 className="text-white font-semibold text-lg mb-1">{titulo}</h3>
                <p className="text-zinc-400 text-sm mb-6">{mensagem}</p>
                <button
                    onClick={onClose}
                    className="w-full rounded-xl bg-red-600 text-white text-sm font-medium py-2.5 hover:bg-red-700 transition-colors"
                >   
                    Fechar
                </button>
            </div>
        </div>
    )
}