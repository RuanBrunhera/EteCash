import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { alunoService } from "../../services/alunoService";
import ModalSucesso from "../common/ModalSucesso";
import ModalAvisoAcao from "../common/ModalAvisoAcao";

function AdicionarSaldoModal({ isOpen, onClose, modo = "deposito" }) {
  const [valor, setValor] = useState("");
  const [selectedFlag, setSelectedFlag] = useState("");
  const [loading, setLoading] = useState(false);
  const [etapa, setEtapa] = useState("form"); // "form" | "pagamento"
  const [codigoPagamento, setCodigoPagamento] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [sucessoAberto, setSucessoAberto] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [avisoChavePixAberto, setAvisoChavePixAberto] = useState(false);
  const navigate = useNavigate();

  const flags = [
    { caption: "Pix", value: "pix", color: "bg-red-800" },
    { caption: "Boleto", value: "boleto", color: "bg-blue-800" },
  ];

  // valor já convertido, usado na validação e na tela da etapa 2
  const valorNumerico = Number(valor.replace(/\D/g, "")) / 100;

  useEffect(() => {
    // checa chave Pix só no modo retirada
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

  const formatarDinheiro = (value) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    return (Number(digits) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const gerarCodigoPagamento = (forma) => {
    const gerarAleatorio = (tamanho) =>
      Array.from({ length: tamanho }, () => Math.floor(Math.random() * 10)).join("");

    if (forma === "pix") {
      const codigoAleatorio = gerarAleatorio(40);
      return `00020126${codigoAleatorio}52040000`;
    }

    const linhaDigitavel = gerarAleatorio(47);
    return `${linhaDigitavel.slice(0, 5)} ${linhaDigitavel.slice(5, 15)} ${linhaDigitavel.slice(15, 26)} ${linhaDigitavel.slice(26, 36)} ${linhaDigitavel.slice(36, 47)}`;
  };

  const validar = () => {
    if (!valor || valorNumerico <= 0) {
      alert("Informe um valor válido para continuar.");
      return false;
    }

    if (modo !== "retirada" && !selectedFlag) {
      alert("Selecione uma forma de pagamento.");
      return false;
    }

    return true;
  };

  const handleContinuar = () => {
    if (!validar()) return;

    setCodigoPagamento(gerarCodigoPagamento(selectedFlag));
    setEtapa("pagamento");
  };

  const handleConfirmar = async () => {
    if (!validar()) return;

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

      const valorFormatado = valorNumerico.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      setMensagemSucesso(
        modo === "retirada"
          ? `Retirada de ${valorFormatado} realizada com sucesso.`
          : `Saldo de ${valorFormatado} adicionado com sucesso.`,
      );
      setSucessoAberto(true);
    } catch (err) {
      console.error(err);
      alert("Não foi possível concluir a operação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copiarCodigo = async () => {
    if (!codigoPagamento) return;

    try {
      await navigator.clipboard.writeText(codigoPagamento);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Não foi possível copiar o código.");
    }
  };

  // ignora pedidos de fechar enquanto a requisição está em andamento
  const handleFechar = () => {
    if (loading) return;
    onClose();
  };

  const fecharAvisoChavePix = () => {
    setAvisoChavePixAberto(false);
    onClose();
  };

  return (
    <>
      {isOpen && !avisoChavePixAberto && !sucessoAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={handleFechar}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg">
                {modo === "retirada"
                  ? "Retirar saldo"
                  : etapa === "pagamento"
                    ? `Pagamento via ${selectedFlag === "pix" ? "Pix" : "Boleto"}`
                    : "Adicionar saldo"}
              </h2>
              <button
                onClick={handleFechar}
                aria-label="Fechar"
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {etapa === "form" ? (
              <>
                <div>
                  <label
                    htmlFor="valor-saldo"
                    className="text-xs text-zinc-400 block mb-1"
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
                    className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                {modo !== "retirada" && (
                  <div className="mt-4">
                    <span className="text-xs text-zinc-400 block mb-2">
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
                          className={`${flag.color} flex-1 rounded-xl px-4 py-2 text-white text-sm ${
                            selectedFlag === flag.value
                              ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          {flag.caption}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={modo === "retirada" ? handleConfirmar : handleContinuar}
                  disabled={loading}
                  className="mt-6 w-full rounded-xl bg-red-600 text-white text-sm font-medium py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading
                    ? "Processando..."
                    : modo === "retirada"
                      ? "Confirmar retirada"
                      : "Continuar para pagamento"}
                </button>
              </>
            ) : (
              <>
                <p className="text-zinc-400 text-sm">Valor a pagar</p>
                <p className="text-white text-2xl font-bold mb-4">
                  {valorNumerico.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>

                {selectedFlag === "pix" && (
                  <div className="mb-4 flex justify-center">
                    {/* QR de enfeite */}
                    <div className="size-40 rounded-2xl border border-zinc-700 bg-zinc-800 grid place-items-center text-zinc-500 text-xs">
                      QR Code (simulado)
                    </div>
                  </div>
                )}

                <p className="text-xs text-zinc-400 mb-1">
                  {selectedFlag === "pix" ? "Pix copia e cola" : "Linha digitável"}
                </p>
                <div className="flex gap-2 mb-6">
                  <p className="flex-1 break-all rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-300 text-xs">
                    {codigoPagamento}
                  </p>
                  <button
                    onClick={copiarCodigo}
                    className="rounded-xl bg-zinc-800 text-white text-sm px-3 hover:bg-zinc-700 transition-colors"
                  >
                    {copiado ? "Copiado!" : "Copiar"}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEtapa("form")}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-zinc-800 text-white text-sm font-medium py-2.5 hover:bg-zinc-700 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleConfirmar}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-red-600 text-white text-sm font-medium py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Processando..." : "Simular pagamento confirmado"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {sucessoAberto && (
        <ModalSucesso
          titulo="Sucesso!"
          mensagem={mensagemSucesso}
          onClose={() => {
            setSucessoAberto(false);
            onClose();
          }}
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