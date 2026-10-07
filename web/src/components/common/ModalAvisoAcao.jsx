import { TriangleAlert } from "lucide-react";

export default function ModalAvisoAcao({
    titulo,
    mensagem,
    textoBotaoPrimario,
    onBotaoPrimario,
    textoBotaoSecundario,
    onClose,
}) {

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4'
            onClick={onClose}
        >
            <div
                className='bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-xl'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='size-12 rounded-2xl bg-amber-500/10 grid place-items-center mb-4'>
                    <TriangleAlert className='size-6 text-amber-400' aria-hidden='true' />
                </div>

                <h3 className='text-white font-semibold text-lg mb-1'>{titulo}</h3>
                <p className='text-zinc-400 text-sm mb-6'>{mensagem}</p>

                <div className='flex gap-3'>
                    <button
                        onClick={onClose}
                        className='flex-1 rounded-xl bg-zinc-800 text-white text-sm font-medium py-2.5 hover:bg-zinc-700 transition-colors'
                    >
                        {textoBotaoSecundario}
                    </button>
                    <button
                        onClick={onBotaoPrimario}
                        className='flex-1 rounded-xl bg-red-600 text-white text-sm font-medium py-2.5 hover:bg-red-700 transition-colors'
                    >
                        {textoBotaoPrimario}
                    </button>
                </div>
            </div>
        </div>
    )
}