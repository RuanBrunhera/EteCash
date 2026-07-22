import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { API_URL } from '../../../config/api'

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
  const [funcionario, setFuncionario] = useSZZate(
    JSON.parse(localStorage.getItem("funcionario")) || {
      nome: "Funcionário",
      cpf: "",
      email: null,
      telefone: null,
    }
  );
  const [foto, setFoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setLoading(false)
      return;
    }

    fetch(`${API_URL}/api/func/perfil`, {
      headers: { Authorization: `Bearer ${token}` }
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
  .slice(0,2)
  .toUpperCase()

  if (loading) {
    return (
      <div className='max-w-md mx-auto mt-10 text-center text-zinc-400'>
        Carregando perfil...
      </div>
    )
  }

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
          <ProfileInfoCard titulo="Telefone" info={funcionario.telefone || "-"} />
        </div>
      </div>
    </div>
  );
}
