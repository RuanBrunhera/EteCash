import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import "./styles.css"
import AdicionarSaldoModal from "../saldo/AdicionarSaldo"
import CarrinhoVenda from "../venda/CarrinhoVenda";

const allOptions = [
  { emoji: "💲", label: "Adicionar saldo", contexto: "aluno", key: "saldo" },
  { emoji: "💸", label: "Retirar saldo", contexto: "aluno", key: "retirada"},
  { emoji: "🛒", label: "Efetuar venda", contexto: "cantina", key: "venda"},
];

export default function FloatingButton() {
  const [open, setOpen] = useState(false);
  const [modalAberto, setModalAberto] = useState(null); //guarda null ou a key, que é a chave para saber se é "venda" (parte do carrinho da cantina) ou "saldo" (parte do adicionar saldo do aluno)
  const fabRef = useRef(null)

  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location?.pathname || "";

  //determino o contexto a partir da rota
  const context = pathname.includes("/cantina") ? "cantina" : "aluno"
  
  //filtra as opções pelo contexto atual
  const options = allOptions.filter((o) => o.contexto === context);

  useEffect(() => {
    if (!open) return

    function handleClickFora(event) {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickFora)
    return () => document.removeEventListener("mousedown", handleClickFora)
  }, [open])

  function abrirModal(key) {
    setOpen(false)
    setModalAberto(key)
    }

  function fecharModal() {
    setModalAberto(null)
  }

  return (
    <>
      <div className='fab-wrapper' ref={fabRef}>
        {open && options.length > 0 && (
          <div className='fab-menu'>
            {options.map((opt) => (
              <div key={opt.key} className={`fab-option ${open ? "visible" : ""}`}>
                <span className='fab-label'>{opt.label}</span>
                <button 
                  className='fab-option-btn'
                  onClick={() => abrirModal(opt.key)}
                  title={opt.label}
                >
                  {opt.emoji}
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          className='fab-main'
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          <span className={`fab-icon ${open ? "open" : ""}`}>+</span>
        </button>
      </div>

        {modalAberto === 'saldo' && (
          <AdicionarSaldoModal 
            isOpen={true}
            onClose={fecharModal}
            modo="deposito"
          />
        )}

        {modalAberto === "retirada" && (
          <AdicionarSaldoModal 
            isOpen={true}
            onClose={fecharModal}
            modo="retirada"
          />
        )}

        {modalAberto === 'venda' && (
          <div 
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4'
            onClick={fecharModal}
          >
            <div 
              className='bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl'
              onClick={(e) => e.stopPropagation()}
            >
              <CarrinhoVenda onClose={fecharModal} />
            </div>
          </div>
        )}
    </>
  );
}