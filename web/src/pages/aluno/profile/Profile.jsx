import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import quandale from "../../../assets/knpgsvnouo191.jpg";
import { API_URL } from "../../../config/api"

function ProfileInfoCard({
  titulo,
  info,
  cor = "bg-gray-800",
  borda = "border-red-500 ",
}) {
  return (
    <div className={`rounded-2xl ${cor} text-white p-4 border-2 ${borda}`}>
      <div className="text-xs text-white/70 pb-2 mb-2 border-b border-white/20">
        {titulo}
      </div>
      <p className="font-semibold">{info}</p>
    </div>
  );
}

const PERIODOS = {
  manha: "Manhã",
  tarde: "Tarde",
  noite: "Noturno",
}

export default function Profile() {
  const [aluno, setAluno] = useState(
    JSON.parse(localStorage.getItem("aluno")) || {
      nome: "Aluno",
      rm: "",
      serie: "",
      curso: null,
    }
  );
  const [foto, setFoto] = useState(quandale);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/aluno/perfil`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.aluno) {
        setAluno(data.aluno);
        localStorage.setItem("aluno", JSON.stringify(data.aluno));
      } else {
        setErro("Não foi possível carregar o perfil.");
      }
    })
    .catch((err) => {
      console.error("Erro ao buscar o perfil:", err);
      setErro("Erro ao conectar com o servidor")
    })
    .finally(() => setLoading(false));
  },[])

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // transformar o arquivo em URL usando: URL.createObjectURL(file)
      const objectUrl = URL.createObjectURL(file);
      setFoto(objectUrl);
      // quando existir endpoint de upload de foto, enviar o `file` pro backend aqui
    }
  };

  const iniciais = (aluno.nome || "Aluno")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formatarCurso = (aluno) => {
    if (!aluno.curso || !aluno.curso.nome) return "-";
    const periodo = PERIODOS[aluno.curso.periodo] || aluno.curso.periodo;
    return `${aluno.serie}º ${aluno.curso.nome} - ${periodo}`;
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-zinc-400">
        Carregando perfil...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-3xl shadow-sm ring-1 ring-gray-100 p-8">
        {erro && (
          <p className="text-red-600 text-sm text-center mb-4">{erro}</p>
        )}

        {/* Foto / Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {foto ? (
              <img
                src={foto}
                alt="Foto do aluno"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                {iniciais}
              </div>
            )}

            <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 cursor-pointer hover:bg-blue-700">
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
          <ProfileInfoCard titulo="RM" info={aluno.rm || "—"} />
          <ProfileInfoCard titulo="Nome" info={aluno.nome} />
          <ProfileInfoCard titulo="Curso" info={formatarCurso(aluno)} />
        </div>
      </div>
    </div>
  );
}