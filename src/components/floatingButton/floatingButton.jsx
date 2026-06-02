import { useState } from "react";
import "./styles.css"
import AdicionarSaldoModal from "../modalAddSaldo/AdicionarSaldo"

const options = [
  { emoji: "💲", label: "Adicionar saldo" }
];

export default function FloatingButton() {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="fab-wrapper">
        {open && (
          <div className="fab-menu">
            {options.map((opt, i) => (
              <div key={i} className={`fab-option ${open ? "visible" : ""}`}>
                <span className="fab-label">{opt.label}</span>
                <button
                  className="fab-option-btn"
                  onClick={() => setModalOpen(true)}
                  title={opt.label}
                >
                  {opt.emoji}
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          className="fab-main"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          <span className={`fab-icon ${open ? "open" : ""}`}>+</span>
        </button>
      </div>

        <AdicionarSaldoModal
        isOpen={isModalOpen()}
        onClose={() => setModalOpen(false)}
        />
    </>
  );
}