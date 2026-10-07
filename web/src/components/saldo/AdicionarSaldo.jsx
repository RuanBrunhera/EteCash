import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { alunoService } from "../../services/alunoService";
import ModalSucesso from "../common/ModalSucesso";
import ModalAvisoAcao from "../common/ModalAvisoAcao";

function AdicionarSaldoModal({ isOpen, onClose, modo = "deposito" }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [valor, setValor] = useState("");
  const [selectedFlag, setSelectedFlag] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucessoAberto, setSucessoAberto] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [avisoChavePixAberto, setAvisoChavePixAberto] = useState(false);
  const navigate = useNavigate();

  const flags = [
    { caption: "Pix", value: "pix", color: "bg-red-800" },
    { caption: "Boleto", value: "boleto", color: "bg-blue-800" },
  ];

  useEffect(() => {
    if (!isOpen || modo !== "retirada") {
      setAvisoChavePixAberto(false);
      return;
    }

    try {
      const aluno = JSON.parse(localStorage.getItem("aluno") || "{}");
      setAvisoChavePixAberto(!aluno.chave_pix);
    } catch {
      setAvisoChavePixAberto(true);
    }
  }, [isOpen, modo]);

  const formatarCPF = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatarDinheiro = (value) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";

    return (Number(digits) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleSave = async () => {
    if (!valor) {
      alert("Preencha o valor!");
      return;
    }

    const valorNumerico = Number(valor.replace(/\D/g, "")) / 100;
    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      alert("Valor inválido!");
      return;
    }

    if (modo !== "retirada") {
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  if (
    !nome.trim() ||
    cpf.replace(/\D/g, "").length !== 11 ||
    !emailValido ||
    !selectedFlag
  ) {
    alert("Preencha nome, CPF, e-mail e escolha a forma de pagamento.");
    return;
  }
}

    setLoading(true);
    try {
      const { data, error } =
        modo === "retirada"
          ? await alunoService.retirarSaldo({ valor: valorNumerico })
          : await alunoService.adicionarSaldo({
              valor: valorNumerico,
              forma_pagamento: selectedFlag,
            });

      if (error) {
        alert(error);
        return;
      }

      localStorage.setItem("aluno", JSON.stringify(data));
      window.dispatchEvent(new Event("saldoAtualizado"));
      setMensagemSucesso(
        `Saldo de R$ ${valorNumerico.toFixed(2).replace(".", ",")} ${modo === "retirada" ? "retirado" : "adicionado"} com sucesso!`,
      );
      setSucessoAberto(true);
      onClose()
    } catch {
      alert("Não foi possível processar a operação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const fecharAvisoChavePix = () => {
    setAvisoChavePixAberto(false);
    onClose();
  };

  return (
    <>
      {isOpen && !avisoChavePixAberto && !sucessoAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-red-900"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold">
                {modo === "retirada" ? "Retirar saldo" : "Adicionar saldo"}
              </h2>
            </div>

            <div className="space-y-4">
              {modo !== "retirada" && (
                <>
                  <div>
                    <label
                      htmlFor="nome-aluno"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nome
                    </label>
                    <input
                      id="nome-aluno"
                      type="text"
                      autoComplete="name"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-2 py-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cpf-aluno"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      CPF
                    </label>
                    <input
                      id="cpf-aluno"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={cpf}
                      onChange={(e) => setCpf(formatarCPF(e.target.value))}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-2 py-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email-aluno"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      E-mail
                    </label>
                    <input
                      id="email-aluno"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-2 py-1"
                    />
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor="valor-saldo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Valor
                </label>
                <input
                  id="valor-saldo"
                  type="text"
                  value={valor}
                  placeholder="R$0,00"
                  inputMode="decimal"
                  onChange={(e) => setValor(formatarDinheiro(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-2 py-1"
                />
              </div>
            </div>

            {modo !== "retirada" && (
              <div className="mt-4">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Forma de pagamento
                </span>
                <div
                  className="flex gap-3"
                  role="group"
                  aria-label="Forma de pagamento"
                >
                  {flags.map((flag) => (
                    <button
                      key={flag.value}
                      type="button"
                      aria-pressed={selectedFlag === flag.value}
                      onClick={() => setSelectedFlag(flag.value)}
                      className={`${flag.color} flex-1 rounded-xl px-4 py-2 text-white ${selectedFlag === flag.value ? "ring-2 ring-offset-2 ring-gray-700" : "opacity-80 hover:opacity-100"}`}
                    >
                      {flag.caption}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl w-full"
              >
                {loading
                  ? "Processando..."
                  : modo === "retirada"
                    ? "Confirmar retirada"
                    : "Continuar para pagamento"}
              </button>
            </div>
          </div>
        </div>
      )}

      {sucessoAberto && (
        <ModalSucesso
          titulo="Sucesso!"
          mensagem={mensagemSucesso}
          onClose={() => setSucessoAberto(false)}
        />
      )}

      {avisoChavePixAberto && (
        <ModalAvisoAcao
          titulo="Chave Pix necessária"
          mensagem="Cadastre uma chave Pix no seu perfil antes de retirar saldo."
          textoBotaoPrimario="Cadastrar agora"
          onBotaoPrimario={() => {
            setAvisoChavePixAberto(false);
            onClose();
            navigate("/aluno/profile");
          }}
          textoBotaoSecundario="Cadastrar depois"
          onClose={fecharAvisoChavePix}
        />
      )}
    </>
  );
}

export default AdicionarSaldoModal;
