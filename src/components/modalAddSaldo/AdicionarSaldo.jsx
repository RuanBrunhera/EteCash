import { useState } from 'react'

function AdicionarSaldoModal({ isOpen, onClose }) {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [valor, setValor] = useState('')
  const [selectedFlag, setSelectedFlag] = useState('')

  const flags = [
    { caption: 'Pix', color: 'bg-red-400' },
    { caption: 'Boleto', color: 'bg-blue-400' },
  ]

  const formatarCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  const formatarDinheiro = (value) => {
    let numero = value.replace(/\D/g, '')
    numero = (numero / 100).toFixed(2) + ''
    numero = numero.replace('.', ',')
    numero = numero.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    return 'R$ ' + numero
  }

  const handleSave = () => {
    if (!nome || !cpf || !email || !valor || !selectedFlag) {
      // Seu desafio: validar campos e salvar no localStorage
      alert('Preencha todos os campos!!')
      return
    }

    const newItem = {
      id: Date.now(),
      tipo: 'crédito',
      formaPagamento: selectedFlag,
      valor: parseFloat(valor.replace(/\D/g, '')) / 100,
      data: new Date().toLocaleDateString('pt-BR'),
    }

    const stored = localStorage.getItem('historico')
    const list = stored ? JSON.parse(stored) : []
    localStorage.setItem('historico', JSON.stringify([...list, newItem]))

    alert('Depósito realizado com sucesso!')
    onClose();
  }

  if (!isOpen) return null  // se fechado, não renderiza nada

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          <h2 className="text-xl font-bold">Adicionar saldo</h2>
          <button onClick={handleSave} className="text-blue-600 hover:text-blue-800 font-semibold">✓</button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Seu desafio: campos de nome, cpf, email, valor */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <label className='block text-sm font-medium text-gray-700'>CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <label className='block text-sm font-medium text-gray-700'>E-mail</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <label className='block text-sm font-medium text-gray-700'>Valor a depositar</label>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(formatarDinheiro(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Flags de pagamento */}
        <div className="mt-4">
          <p className="font-bold mb-2">Método de pagamento:</p>
          <div className="flex gap-3">
            {flags.map((flag) => (
              <button
                key={flag.caption}
                onClick={() => setSelectedFlag(flag.caption)}
                className={`px-4 py-2 rounded-xl text-white ${flag.color} ${selectedFlag === flag.caption ? 'ring-2 ring-offset-2 ring-gray-400' : 'opacity-60'
                  }`}
              >
                {flag.caption}
              </button>
            ))}
          </div>
        </div>

        {/* Botão continuar */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Continuar para pagamento
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdicionarSaldoModal