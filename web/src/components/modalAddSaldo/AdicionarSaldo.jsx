import { useState } from "react";

function AdicionarSaldoModal({ isOpen, onClose }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [valor, setValor] = useState("");
  const [selectedFlag, setSelectedFlag] = useState("");

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
    let valor = value.replace(/\D/g, "");
    valor = (valor / 100).toFixed(2) + "";
    valor = valor.replace(".", ",");
    valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return "R$ " + valor;
  };

  const handleSave = () => {
    if (!nome || !cpf || !email || !valor || !selectedFlag) {
      alert('Preencha todos os campos!')
      return
    }

    const newItem = {
      id: Date.now(),
      tipo: 'crédito',
      formaPagamento: selectedFlag,
      valor: parseFloat(valor.replace(/\D/g, '')) / 100,
      data: new Date().toLocaleDateString('pt-BR'),
    }

    const stored = localStorage.getItem('historico')
    const list = stored ? JSON.parse(stored) : []
    localStorage.setItem('historico', JSON.stringify([...list, newItem]))

    alert('Depósito registrado com sucesso!')
    onClose()
  };

  if (!isOpen) return null; // se fechado, não renderiza nada

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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              placeholder="ex: John Doe"
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              value={email}
              placeholder="ex: email.example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor
            </label>
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
          <button className="bg-blue-500 text-white px-4 py-2 rounded-xl w-full">
            Continuar para pagamento
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdicionarSaldoModal;
