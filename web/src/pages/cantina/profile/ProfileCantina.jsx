import { useState, useEffect } from "react";
import { Camera, Pencil } from "lucide-react";
import { API_URL } from "../../../config/api";
import ModalEditarCampo from "../../../components/common/ModalEditarCampo";
import ModalSucesso from "../../../components/common/ModalSucesso";

const camposEmail = [{ chave: "email", label: "Novo e-mail", tipo: "text" }];
const camposTelefone = [
  { chave: "telefone", label: "Novo telefone", tipo: "text" },
];
const camposSenha = [
  { chave: "senhaAtual", label: "Senha atual", tipo: "password" },
  { chave: "novaSenha", label: "Nova senha", tipo: "password" },
  {
    chave: "confirmarSenhaNova",
    label: "Confirmar nova senha",
    tipo: "password",
  },
];

const MODAIS = {
  email: {
    titulo: "Alterar e-mail",
    campos: camposEmail,
    endpoint: "/api/func/perfil",
    mensagemSucesso: "E-mail alterado com sucesso!",
  },
  telefone: {
    titulo: "Alterar telefone",
    campos: camposTelefone,
    endpoint: "/api/func/perfil",
    mensagemSucesso: "Telefone alterado com sucesso!",
  },
  senha: {
    titulo: "Alterar senha",
    campos: camposSenha,
    endpoint: "/api/func/senha",
    mensagemSucesso: "Senha alterada com sucesso!",
  },
};

function ProfileInfoCard({ titulo, info }) {
  return (
    <div className="rounded-2xl bg-zinc-800 border border-zinc-700 text-white p-4">
      <div className="text-xs text-zinc-400 pb-2 mb-2 border-b border-zinc-700">
        {titulo}
      </div>
      <p className="font-semibold">{info}</p>
    </div>
  );
}

export default function ProfileCantina() {
  const [funcionario, setFuncionario] = useState(
    JSON.parse(localStorage.getItem("funcionario")) || {
      nome: "Funcionário",
      cpf: "",
      email: null,
      telefone: null,
    },
  );
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [modalAberto, setModalAberto] = useState(null);
  const [sucessoAberto, setSucessoAberto] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/func/perfil`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.funcionario) {
          setFuncionario(data.funcionario);
          localStorage.setItem("funcionario", JSON.stringify(data.funcionario));
        } else {
          setErro("Não foi possível carregar o perfil.");
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar o perfil:", err);
        setErro("Erro ao conectar com o servidor.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFoto(objectUrl);
    }
  };

  const formatarCPF = (cpf) => {
    if (!cpf || cpf.length !== 11) return cpf || "-";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const iniciais = (funcionario.nome || "Funcionário")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSuccess = (mensagem) => {
    setModalAberto(null);
    setMensagemSucesso(mensagem);
    setSucessoAberto(true);
  };

  const getModalProps = () => MODAIS[modalAberto] || null;

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-zinc-400">
        Carregando perfil...
      </div>
    );
  }

  const modalProps = getModalProps();

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-zinc-900 rounded-3xl shadow-sm ring-1 ring-zinc-800 p-8">
        {erro && (
          <p className="text-red-400 text-sm text-center mb-4">{erro}</p>
        )}

        {/* Foto / Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {foto ? (
              <img
                src={foto}
                alt="Foto do funcionário"
                className="w-24 h-24 rounded-full object-cover ring-2 ring-zinc-800"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-red-600 text-white flex items-center justify-center text-2xl font-bold">
                {iniciais}
              </div>
            )}

            <label className="absolute bottom-0 right-0 bg-red-600 rounded-full p-1.5 cursor-pointer hover:bg-red-700 transition-colors">
              <Camera size={14} className="text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFotoChange}
              />
            </label>
          </div>
        </div>

        {/* Informações */}
        <div className="space-y-3">
          <ProfileInfoCard titulo="Nome" info={funcionario.nome} />
          <ProfileInfoCard titulo="CPF" info={formatarCPF(funcionario.cpf)} />
          <ProfileInfoCard titulo="E-mail" info={funcionario.email || "-"} />
          <ProfileInfoCard
            titulo="Telefone"
            info={funcionario.telefone || "-"}
          />
        </div>
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 mb-3 font-semibold">SEGURANÇA</p>
          <div className="flex gap-3">
            <button
              onClick={() => setModalAberto("email")}
              className="flex-1 min-w-0 rounded-xl bg-zinc-800 text-white text-sm font-medium py-2.5 px-2 hover:bg-zinc-700 transition-colors flex flex-col items-center justify-center gap-1 text-center"
            >
              <Pencil size={14} />
              <span className="leading-tight">Alterar e-mail</span>
            </button>
            <button
              onClick={() => setModalAberto("telefone")}
              className="flex-1 min-w-0 rounded-xl bg-zinc-800 text-white text-sm font-medium py-2.5 px-2 hover:bg-zinc-700 transition-colors flex flex-col items-center justify-center gap-1 text-center"
            >
              <Pencil size={14} />
              <span className="leading-tight">Alterar telefone</span>
            </button>
            <button
              onClick={() => setModalAberto("senha")}
              className="flex-1 min-w-0 rounded-xl bg-zinc-800 text-white text-sm font-medium py-2.5 px-2 hover:bg-zinc-700 transition-colors flex flex-col items-center justify-center gap-1 text-center"
            >
              <Pencil size={14} />
              <span className="leading-tight">Alterar senha</span>
            </button>
          </div>
        </div>
      </div>

      {modalProps && (
        <ModalEditarCampo
          isOpen={modalAberto !== null}
          onClose={() => setModalAberto(null)}
          titulo={modalProps.titulo}
          campos={modalProps.campos}
          endpoint={modalProps.endpoint}
          onSuccess={() => handleSuccess(modalProps.mensagemSucesso)}
        />
      )}

      {sucessoAberto && (
        <ModalSucesso
          titulo="Sucesso!"
          mensagem={mensagemSucesso}
          onClose={() => setSucessoAberto(false)}
        />
      )}
    </div>
  );
}
