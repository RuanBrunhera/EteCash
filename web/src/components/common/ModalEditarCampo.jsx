import { useState } from "react";
import { API_URL } from "../../config/api";

export default function ModalEditarCampo({
  isOpen,
  onClose,
  titulo,
  campos,      // array de { chave, label, tipo }
  endpoint,    // ex: "/api/aluno/senha"
  onSuccess,   // função chamada depois do PATCH dar certo
}) {
    
  const [valores, setValores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleChange = (chave, valor) => {
    setValores((prev) => ({
      ...prev,
      [chave]: valor,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(valores),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setValores({});
      } else {
        const data = await res.json();
        setErro(data.error || "Erro ao atualizar");
        setValores({});
      }
    } catch (err) {
      setErro("Erro ao conectar com o servidor");
      setValores({});
    } finally {
      setEnviando(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const getInputType = (tipo) => {
    if (tipo === "password") return "password";
    if (tipo === "pin") return "text";
    return "text";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white font-semibold text-lg mb-4">{titulo}</h2>

        {erro && <p className="text-red-400 text-sm mb-4">{erro}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {campos.map((campo) => (
            <div key={campo.chave}>
              <label className="block text-white text-sm font-medium mb-2">
                {campo.label}
              </label>
              <input
                type={getInputType(campo.tipo)}
                maxLength={campo.tipo === "pin" ? 4 : undefined}
                inputMode={campo.tipo === "pin" ? "numeric" : "text"}
                value={valores[campo.chave] || ""}
                onChange={(e) => handleChange(campo.chave, e.target.value)}
                className="w-full rounded-xl bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-zinc-800 text-white text-sm font-medium py-2.5 hover:bg-zinc-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 rounded-xl bg-red-600 text-white text-sm font-medium py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {enviando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}