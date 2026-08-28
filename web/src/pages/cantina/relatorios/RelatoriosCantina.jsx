import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { API_URL } from "../../../config/api";

const MESES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

// Tooltip customizado para o gráfico de barras
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2">
        <p className="text-zinc-400 text-xs">{label}</p>
        <p className="text-white font-bold">R$ {payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

//Tick customizado
const CustomXAxisTick = ({ x, y, payload }) => {
  const hoje = new Date();
  const mesAtual = MESES[hoje.getMonth()];
  const destacado = payload.value === mesAtual;
  return (
    <text
      x={x}
      y={y + 15}
      textAnchor="middle"
      fontSize={12}
      fill={destacado ? "#ffffff" : "#71717a"}
      fontWeight={destacado ? "bold" : "normal"}
    >
      {payload.value}
    </text>
  );
};

function corDoRanking(posicao) {
  if (posicao === 1) return "bg-yellow-500"; // ouro
  if (posicao === 2) return "bg-zinc-400"; // prata
  if (posicao === 3) return "bg-amber-700"; // bronze
  return "bg-zinc-700"; // outros produtos
}

export default function RelatoriosCantina() {
  const [dados, setDados] = useState({
    faturamento_semana: [],
    faturamento_mensal: [],
    top_produtos: [],
  });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/func/relatorio-vendas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setDados({
          faturamento_semana: data.faturamento_semana || [],
          faturamento_mensal: data.faturamento_mensal || [],
          top_produtos: data.top_produtos || [],
        });
      })
      .catch((err) => {
        console.error("Erro ao buscar relatórios:", err);
        setErro("Erro ao carregar relatório.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-400">
        Carregando relatório...
      </div>
    );
  }

  const relatorioSemana = dados.faturamento_semana;
  const relatorioMensal = dados.faturamento_mensal;
  const topProdutos = dados.top_produtos;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-white text-2xl font-semibold">
          Relatório de vendas
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Faturamento e produtos mais vendidos
        </p>
      </div>

      {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna esquerda: os 2 gráficos empilhados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gráfico 1: faturamento por dia da semana */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-white font-semibold mb-6">
              Faturamento por semana
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={relatorioSemana}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="dia"
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255, 255, 255, 0.5)" }}
                />
                <Bar dataKey="valor" fill="#dc2626" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 2: faturamento por mês (6 meses) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-white font-semibold mb-6">
              Faturamento por mês
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={relatorioMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="mes"
                  tick={<CustomXAxisTick />}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255, 255, 255, 0.5)" }}
                />
                <Bar dataKey="valor" fill="#dc2626" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coluna direita: top 10 produtos, com scroll */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h3 className="text-white font-semibold mb-4">
            Top 10 produtos mais vendidos
          </h3>
          {topProdutos.length === 0 ? (
            <p className="text-zinc-400 text-sm mt-1">Nenhuma venda registrada esse mês ainda...</p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {topProdutos.map((produto, index) => (
                <div
                  key={produto.nome}
                  className="flex items-center justify-between rounded-2xl bg-zinc-800 border border-zinc-700 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className={`size-7 rounded-full ${corDoRanking(index+1)} text-white text-sm font-bold flex items-center justify-center`}>
                      {index + 1}
                    </span>
                    <p className="text-white font-semibold">{produto.nome}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {produto.quantidade} un.
                    </p>
                    <p className="text-zinc-500 text-xs">vendidas</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
