import { useState } from "react";
import "./styles.css"

const options = [
  { emoji: "💲", label: "Adicionar saldo" }
];

export default function FloatingButton() {
  const [open, setOpen] = useState(false);

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
                  onClick={() => alert(`Clicou em: ${opt.label}`)}
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
    </>
  );
}