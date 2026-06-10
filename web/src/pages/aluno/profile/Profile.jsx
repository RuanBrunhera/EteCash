import { useState } from "react";
import { Camera } from "lucide-react";
import quandale from "../../assets/knpgsvnouo191.jpg";

//temporário
const alunoMock = {
  nome: "Ruan",
  rm: "20242460054",
  serie: "3º DS",
  foto: quandale,
};

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

export default function Profile() {
  const [foto, setFoto] = useState(alunoMock.foto);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // transformar o arquivo em URL usando: URL.createObjectURL(file)
      const objectUrl = URL.createObjectURL(file);
      setFoto(objectUrl);
    }
  };

  const iniciais = alunoMock.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-3xl shadow-sm ring-1 ring-gray-100 p-8">
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
              //exibir iniciais quando não houver foto
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
        <ProfileInfoCard titulo="RM" info={alunoMock.rm} />
        <ProfileInfoCard titulo="Nome" info={alunoMock.nome} />
        <ProfileInfoCard titulo="Série" info={alunoMock.serie} />
      </div>
      </div>
    </div>
  );
}
