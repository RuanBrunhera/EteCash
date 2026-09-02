import { useEffect, useState } from 'react'
import etecashLogo from '../../assets/etecash_logo.png'
import { API_URL } from '../../config/api'

function WelcomeCardCantina() {
  const [funcionario, setFuncionario] = useState(
    JSON.parse(localStorage.getItem('funcionario')) || { nome: 'Funcionário' }
  )
  const [resumo, setResumo] = useState({ faturamento: 0, numero_vendas: 0 })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch(`${API_URL}/api/func/resumo-dia`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setResumo({
          faturamento: data.faturamento || 0,
          numero_vendas: data.numero_vendas || 0,
        })
      })
      .catch((err) => console.error('Erro ao buscar resumo do dia:', err))
  }, [])

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-800 p-6 text-white border border-zinc-700">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        {/* Lado esquerdo */}
        <div className="max-w-xl md:w-3/5">
          <p className="text-zinc-400 text-sm mb-1">Bem-vindo de volta,</p>
          <h1 className="text-3xl font-semibold">{funcionario.nome} 👋</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Sistema de pagamentos digitais da cantina escolar.
          </p>

          {/* Data do dia */}
          <div className="mt-4 flex items-center gap-4 rounded-2xl bg-zinc-700/50 border border-zinc-600 px-4 py-3 text-sm">
            <span className="text-2xl">📅</span>
            <div>
              <div className="font-medium text-zinc-300">Hoje é</div>
              <div className="text-white font-bold text-lg capitalize">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
              </div>
            </div>
          </div>

          {/* Mini cards de faturamento e vendas */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-zinc-700/50 border border-zinc-600 px-4 py-3">
              <div className="text-xs text-zinc-400">Faturamento hoje</div>
              <div className="font-bold text-lg text-emerald-400">
                R$ {resumo.faturamento.toFixed(2)}
              </div>
            </div>
            <div className="rounded-2xl bg-zinc-700/50 border border-zinc-600 px-4 py-3">
              <div className="text-xs text-zinc-400">Vendas hoje</div>
              <div className="text-white font-bold text-lg">{resumo.numero_vendas}</div>
            </div>
          </div>
        </div>

        {/* Lado direito - Logo */}
        <div className="relative lg:w-2/5 flex items-center justify-center">
          <img src={etecashLogo} alt="EteCash Logo" className="opacity-90" />
        </div>
      </div>

      <div className="pointer-events-none absolute -right-10 -top-10 size-60 rounded-full bg-red-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 size-40 rounded-full bg-zinc-600/20 blur-2xl" />
    </section>
  )
}

export default WelcomeCardCantina