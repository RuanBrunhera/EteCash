import { useState } from "react";
import { API_URL } from "../../config/api";

function AdicionarSaldoModal({ isOpen, onClose }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [valor, setValor] = useState("");
  const [selectedFlag, setSelectedFlag] = useState("");
  const [loading, setLoading] = useState(false);

  const flags = [
    { caption: "Pix", color: "bg-red-800" },
    { caption: "Boleto", color: "bg-blue-800" },
  ];

  const formatarCPF = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatarDinheiro = (value) => {
    let numero = value.replace(/\D/g, "");
    numero = (numero / 100).toFixed(2) + "";
    numero = numero.replace(".", ",");
    numero = numero.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return "R$ " + numero;
  };

  const handleSave = async () => {
    if (!nome || !cpf || !email || !valor || !selectedFlag) {
      alert("Preencha todos os campos!");
      return;
    }

    const valorNumerico = parseFloat(valor.replace(/\D/g, "")) / 100;

    if (valorNumerico <= 0) {
      alert("Valor inválido!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/aluno/saldo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          valor: valorNumerico,
          forma_pagamento: selectedFlag.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao adicionar saldo");
        return;
      }

      // Atualiza o aluno no localStorage com o novo saldo
      localStorage.setItem("aluno", JSON.stringify(data.aluno));

      alert(`Saldo de R$ ${valorNumerico.toFixed(2)} adicionado com sucesso!`);

      localStorage.setItem("aluno", JSON.stringify(data.aluno));
      window.dispatchEvent(new Event('saldoAtualizado'))
      onClose();

    } catch (error) {
      alert("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-gray-600 hover:text-red-900">✕</button>
          <h2 className="text-xl font-bold">Adicionar saldo</h2>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={nome}
              placeholder="ex: John Doe"
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <input
              type="text"
              value={cpf}
              placeholder="ex: 000.000.000-00"
              maxLength={14}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="text"
              value={email}
              placeholder="ex: email.example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
            <input
              type="text"
              value={valor}
              placeholder="R$0,00"
              onChange={(e) => setValor(formatarDinheiro(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-2 py-1"
            />
          </div>
        </div>

        {/* Flags de pagamento */}
        <div className="mt-4">
          <p className="font-bold mb-2">Método de pagamento:</p>
          <div className="flex gap-3">
            {flags.map((flag) => (
              <button
                key={flag.caption}
                onClick={() => setSelectedFlag(flag.caption)}
                className={`px-4 py-2 rounded-xl text-white ${flag.color} ${
                  selectedFlag === flag.caption
                    ? "ring-2 ring-offset-2 ring-gray-400"
                    : "opacity-60"
                }`}
              >
                {flag.caption}
              </button>
            ))}
          </div>
        </div>

        {/* Botão continuar */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl w-full"
          >
            {loading ? "Processando..." : "Continuar para pagamento"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdicionarSaldoModal;