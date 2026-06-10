// src/pages/statistics/Statistics.jsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

// Dados mockados
const gastosPorMes = [
  { mes: 'Jan', valor: 45.00 },
  { mes: 'Fev', valor: 78.50 },
  { mes: 'Mar', valor: 32.00 },
  { mes: 'Abr', valor: 89.50 },
  { mes: 'Mai', valor: 56.00 },
  { mes: 'Jun', valor: 120.00 },
]

const metodosPagamento = [
  { name: 'PIX', value: 60 },
  { name: 'Boleto', value: 40 },
]

const COLORS = ['#dc2626', '#3b82f6']

// Tooltip customizado para o BarChart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2">
        <p className="text-zinc-400 text-xs">{label}</p>
        <p className="text-white font-bold">R$ {payload[0].value.toFixed(2)}</p>
      </div>
    )
  }
  return null
}

export default function Statistics() {
  return (
    <div className="p-8 space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white">Estatísticas</h2>
        <p className="text-zinc-400 text-sm mt-1">Relatório completo das suas movimentações</p>
      </div>

      {/* Gráfico de barras - Gastos por mês */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <h3 className="text-white font-semibold mb-6">Gastos por mês</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={gastosPorMes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="mes" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="valor" fill="#dc2626" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de pizza - Métodos de pagamento */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <h3 className="text-white font-semibold mb-6">Métodos de pagamento</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={metodosPagamento}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {metodosPagamento.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#a1a1aa' }}
            />
            <Legend
              formatter={(value) => <span style={{ color: '#a1a1aa', fontSize: 13 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}