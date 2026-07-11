import {useEffect, useState} from 'react'
import etecashLogo from '../../assets/etecash_logo.png'
import { API_URL } from '../../config/api'

function WelcomeCard() {
  
  const [aluno, setAluno] = useState(
    JSON.parse(localStorage.getItem('aluno')) || {nome: 'Aluno', saldo: 0}
  )

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch(`${API_URL}/api/aluno/perfil`, {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(res => res.json())
    .then(data => {
      if (data.aluno) {
        setAluno(data.aluno)
        localStorage.setItem('aluno', JSON.stringify(data.aluno))
      }
    })
    .catch(err => console.error('Erro ao buscar perfil: ', err))
  }, [])

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-800 p-6 text-white border border-zinc-700">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        {/* Lado esquerdo */}
        <div className="max-w-xl md:w-3/5">
          <p className="text-zinc-400 text-sm mb-1">Bem-vindo de volta,</p>
          <h1 className="text-3xl font-semibold">{aluno.nome} 👋</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Sistema de pagamentos digitais da cantina escolar.
          </p>
          <div className="mt-6 flex items-center gap-4 rounded-2xl bg-zinc-700/50 border border-zinc-600 px-4 py-3 text-sm">
            <span className="text-2xl font-bold text-red-500">R$</span>
            <div>
              <div className="font-medium text-zinc-300">Saldo atual</div>
              <div className="text-white font-bold text-lg">R$ {aluno.saldo?.toFixed(2) || '0,00'}</div>
            </div>
          </div>
        </div>

        {/* Lado direito - decorativo */}
        <div className="relative lg:w-2/5 flex items-center justify-center">
          <div className="text-8xl">
            <img 
            src={etecashLogo} 
            alt=""
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-red-600/10 blur-2xl" />
    </section>
  )
}

export default WelcomeCard