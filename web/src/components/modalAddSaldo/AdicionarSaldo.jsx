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
    // Seu desafio: adaptar a função que você já tinha!
    return value 
  }

  const formatarDinheiro = (value) => {
    // Seu desafio: adaptar a função que você já tinha!
  }

  const handleSave = () => {
    // Seu desafio: validar campos e salvar no localStorage
  }

  if (!isOpen) return null  // se fechado, não renderiza nada

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* Seu desafio: botão fechar + título + botão confirmar */}
          <Button title="Fechar" onClick={onClose}/>
          <h2 className="text-xl font-bold">Adicionar saldo</h2>
          <Button title="Confirmar" onClick={handleSave}/>
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
            <input 
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <input 
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <input 
                type="text"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
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
                className={`px-4 py-2 rounded-xl text-white ${flag.color} ${
                  selectedFlag === flag.caption ? 'ring-2 ring-offset-2 ring-gray-400' : 'opacity-60'
                }`}
              >
                {flag.caption}
              </button>
            ))}
          </div>
        </div>

        {/* Botão continuar */}
        <div className="mt-6">
          {/* Seu desafio: botão de continuar para pagamento */}
        </div>

      </div>
    </div>
  )
}

export default AdicionarSaldoModal