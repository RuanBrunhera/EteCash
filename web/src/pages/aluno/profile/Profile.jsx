import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import quandale from "../../../assets/knpgsvnouo191.jpg";
import { API_URL } from "../../../config/api";
import ModalEditarCampo from "../../../components/common/ModalEditarCampo";
import ModalSucesso from "../../../components/common/ModalSucesso";

const camposSenha = [
  { chave: "senhaAtual", label: "Senha atual", tipo: "password" },
  { chave: "novaSenha", label: "Nova senha", tipo: "password" },
  { chave: "confirmarSenhaNova", label: "Confirmar nova senha", tipo: "password" },
];

const camposPin = [
  { chave: "pinAtual", label: "PIN atual", tipo: "pin" },
  { chave: "novoPIN", label: "Novo PIN", tipo: "pin" },
  { chave: "confirmarNovoPIN", label: "Confirmar novo PIN", tipo: "pin" },
];

function ProfileInfoCard({ titulo, info }) {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
      <div className="text-xs text-zinc-500 pb-2 mb-2 border-b border-zinc-800">
        {titulo}
      </div>
      <p className="font-semibold text-white">{info}</p>
    </div>
  )
}

export default function Profile() {
  const [aluno, setAluno] = useState(
    JSON.parse(localStorage.getItem("aluno")) || {
      nome: "Aluno",
      rm: "",
      serie: "",
      curso: null
    }
  )
  const [foto, setFoto] = useState(quandale)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [modalAberto, setModalAberto] = useState(null)
  const [sucessoAberto, setSucessoAberto] = useState(false)
  const [mensagemSucesso, setMensagemSucesso] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    
    if (!token) {
      setLoading(false)
      return
    }

    fetch(`${API_URL}/api/aluno/perfil`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.aluno) {
        setAluno(data.aluno)
        localStorage.setItem("aluno", JSON.stringify(data.aluno))
      } else {
        setErro("Não foi possível carregar o perfil")
      }
    })
    .finally(() => setLoading(false))
  }, [])

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0]

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFoto(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSuccess = (mensagem) => {
    setModalAberto(null)
    setMensagemSucesso(mensagem)
    setSucessoAberto(true)
  }

  const getModalProps = () => {
    if (modalAberto === "senha") {
      return {
        titulo: "Alterar senha",
        campos: camposSenha,
        endpoint: "/api/aluno/senha",
      }
    }
    if (modalAberto === "pin") {
      return {
        titulo: "Alterar pin",
        campos: camposPin,
        endpoint: "/api/aluno/pin"
      }
    }
    return null
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 flex items-center justify-center h-screen">
        <p className="text-zinc-400">Carregando perfil...</p>
      </div>
    )
  }

  const modalProps = getModalProps()

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-zinc-950 rounded-3xl shadow-sm ring-1 ring-zinc-800 p-8">
        {/* Foto/Avatar */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative">
            <img 
              src={foto}
              alt="Foto do aluno"
              className="w-20 h-20 rounded-full object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-red-600 rounded-full p-2 cursor-pointer hover:bg-red-700 transition-colors">
              <Camera className="size-4 text-white"/>
              <input 
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />
            </label>
        </div>
      </div>

        {erro && (
          <p>{erro}</p>
        )}

        <div className="space-y-3">
          <ProfileInfoCard titulo="RM" info={aluno.rm || "—"} />
          <ProfileInfoCard titulo="Nome" info={aluno.nome} />
          <ProfileInfoCard titulo="Curso" info={aluno.curso?.nome || "—"} />
        </div>

        {/* TODO 4: nova seção "Segurança" com os dois botões
            - "Alterar senha" -> setModalAberto("senha")
            - "Alterar PIN" -> setModalAberto("pin")
            pensa no estilo visual: pode ser dois botões simples,
            estilo secundário (zinc-800), abaixo dos ProfileInfoCard */}
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 mb-3 font-semibold">SEGURANÇA</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setModalAberto("senha")}
                    className="flex-1 rounded-xl bg-zinc-800 text-white text-sm font-medium py-2.5 hover:bg-zinc-700 transition-colors"
                  >
                    Alterar senha
                  </button>
                  <button
                    onClick={() => setModalAberto("pin")}
                    className="flex-1 rounded-xl bg-zinc-800 text-white text-sm font-medium py-2.5 hover:bg-zinc-700 transition-colors"
                  >
                    Alterar PIN
                  </button>
                </div>
            </div>
      </div>

      {/* TODO 5: renderizar o ModalEditarCampo condicionalmente
          - isOpen={modalAberto === "senha"}, com titulo, campos=camposSenha,
            endpoint="/api/aluno/senha", onClose, onSuccess
          - o mesmo pra "pin", trocando titulo/campos/endpoint

          dica: dá pra usar UM ModalEditarCampo só, calculando as props
          dinamicamente com base em `modalAberto`, ou DOIS <ModalEditarCampo>
          (um pra cada), cada um controlando seu próprio isOpen.
          pense em qual é mais simples de entender e manter */}

        {modalProps && (
          <ModalEditarCampo 
            isOpen={modalAberto !== null}
            onClose={() => setModalAberto(null)}
            titulo={modalProps.titulo}
            campos={modalProps.campos}
            endpoint={modalProps.endpoint}
            onSuccess={() => handleSuccess(
              modalAberto === "senha"
              ? "Senha alterada com sucesso!"
              : "PIN alterado com sucesso!"
            )}
          />
        )}

      {/* TODO 6: renderizar o ModalSucesso condicionalmente,
          igual o carrinho já faz */}
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