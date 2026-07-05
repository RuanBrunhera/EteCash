// src/pages/cantina/profile/profileCantina.jsx
import { useState } from "react";
import { Camera } from "lucide-react";

// Dados mockados
const funcionarioMock = {
  nome: "João Silva",
  cpf: "000.000.000-00",
  cargo: "Atendente",
  email: "joao@etec.sp.gov.br",
  foto: null,
};

function ProfileInfoCard({
  titulo,
  info,
  cor = "bg-gray-800",
  borda = "border-red-500",
}) {
  return(
  <div className={`rounded-2xl ${cor} text-white p-4 border-2 ${borda}`}>
    <div className="text-xs text-white/70 pb-2 mb-2 border-b border-white/20">
      {titulo}
    </div>
    <p className="font-semibold">{info}</p>
  </div>
)}

export default function ProfileCantina() {
  const [foto, setFoto] = useState(funcionarioMock.foto);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFoto(objectUrl);
    }
  };

  const iniciais = funcionarioMock.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-gray-100 p-8">
        {/* Foto / Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {foto ? (
              <img
                src={foto}
                alt="Foto do funcionário"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              //Exibir iniciais quando não tiver foto
              <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                {iniciais}
              </div>
            )}

            {/* Botão de trocar foto */}
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
          <ProfileInfoCard titulo="Nome" info={funcionarioMock.nome} />
          <ProfileInfoCard titulo="Cargo" info={funcionarioMock.cargo} />
          <ProfileInfoCard titulo="E-mail" info={funcionarioMock.email} />
          <ProfileInfoCard titulo="CPF" info={funcionarioMock.cpf} />
        </div>
      </div>
    </div>
  );
}
