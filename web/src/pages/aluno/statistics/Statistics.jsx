import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { API_URL } from '../../../config/api'

const COLORS = ['#dc2626', '#3b82f6']

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

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

// Agrupa os débitos por mês dos últimos 6 meses corridos INCLUINDO o mes atual
function agruparGastosPorMes(historico) {
  const hoje = new Date()
  const meses = []

  for (let i = 5; i >= 0; i--) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    meses.push({
      mes: MESES[data.getMonth()],
      ano: data.getFullYear(),
      mesIndex: data.getMonth(),
      valor: 0,
    })
  }

  historico
    .filter((h) => h.tipo === 'debito')
    .forEach((h) => {
      const data = new Date(h.data_hora)
      const alvo = meses.find(
        (mn) => m.mesIndex === data.getMonth() && m.ano === daa.getFullYear()
      )
      if (alvo) alvo.valor += h.valor
    })

    return meses.map(({ mes, valor }) => ({ mes, valor }))
}

// Conta só os debitos por forma de pagamento
function agruparMetodosPagamento(historico) {
  const contagem = { pix: 0, boleto: 0 }

  historico
    .filter((h) => h.tipo === 'debito')
    .forEach((h) => {
      if (contagem[h.forma_pagamento] !== undefined) {
        contagem[h.forma_pagamento]++
      }
    })

    const total = contagem.pix + contagem.boleto
    if (total === 0) return []

    return [
      { name: 'PIX', value: contagem.pix},
      { name: 'Boleto', value: contagem.boleto},
    ].filter((m) => m.value > 0)
}


export default function Statistics() {
  const [historico, setHistorico] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    fetch(`${API_URL}/api/aluno/historico`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setHistorico(data.historico || [])
      })
      .catch((err) => {
        console.error('Erro ao buscar histórico:', err)
        setErro('Erro ao carregar estatísticas.')
      })
      .finally(() => setLoading(false))
  }, [])

    const gastosPorMes = agruparGastosPorMes(historico)
    const metodosPagamento = agruparMetodosPagamento(historico)
    const semGastos = historico.filter((h) => h.tipo === 'debito').lenght === 0

    if (loading) {
      return (
        <div className='p-8 text-center text-zinc-400'>Carregando estatísticas...</div>
      )
    }
  
  return (
    <div className='p-8 space-y-8'>
      
      {/* Header */}
      <div>
        <h2 className='text-2xl font-semibold text-white'>Estatísticas</h2>
        <p className='text-zinc-400 text-sm mt-1'>Relatório completo das suas movimentações</p>
      </div>

      {erro && <p className='text-red-400 text-sm'>{erro}</p>}

      {/* Gráfico de Barras - Gastos por mês */}
      <div className='bg-zinc-900 border border-zinc-800 rounded-3xl p-6'>
        <h3 className='text-white font-semibold mb-6'>Gastos por mês</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={gastosPorMes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
            <XAxis dataKey="mes" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.5)' }} />
            <Bar dataKey="valor" fill="#dc2626" radius={[8, 8, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de pizza - Métodos de pagamento */}
      <div className='bg-zinc-900 border border-zinc-800 rounded-3xl p-6'>
        <h3 className='text-white font-semibol mb-6'>Métodos de pagamento</h3>
        {semGastos ? (
          <p>
            Nenhum gasto registrado ainda.
          </p>
        ) : (
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
                {metodosPagamento.map(( entry, index ) => (
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
        )}
      </div>

    </div>
  )
}