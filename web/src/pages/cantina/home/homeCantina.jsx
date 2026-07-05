import {
<<<<<<< HEAD
  DollarSign, 
  ShoppingBag,
  Trophy,
} from 'lucide-react'

const resumoDia = {
  faturamento: 245.00,
  numeroVendas: 15,
  produtoMaisVendido: "Coxinha"
}

function ResumoCardCantina({ title, value, icon: Icon, color }) {
=======
  DollarSign,
  ShoppingBag,
  Trophy,
} from 'lucide-react'
import WelcomeCardCantina from '../../../components/cantina/welcomeCardCantina'

//Dados mockado
const resumoDia = {
  faturamento: 245.99,
  numeroVendas: 18,
  produtoMaisVendido: 'Coxinha',
}

function ResumoCardCantina({title, value, icon: Icon, color}) {
>>>>>>> 93a96ba57647061c92e3be03111aca2f214f5da4
  const colors = {
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
    green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  }
<<<<<<< HEAD
=======

  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <p className='text-sm text-zinc-400'>{title}</p>
      <Icon size={24} className={colors[color].split(' ')[0]}/>
      <span className='text-2xl font-bold text-white'>{value}</span>
    </div>
  )
>>>>>>> 93a96ba57647061c92e3be03111aca2f214f5da4
}

export default function HomeCantina() {
  return (
    <div className='p-8 space-y-6'>
      <div>
        <WelcomeCardCantina />
        <h2 className='text-white font-semibold mb-4 mt-6'>Resumo de hoje</h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <ResumoCardCantina 
          title="Faturamento"
          value={`R$ ${resumoDia.faturamento.toFixed(2)}`}
          icon={DollarSign}
          color="green"
          />
          <ResumoCardCantina 
          title="Numero de vendas"
          value={resumoDia.numeroVendas}
          icon={ShoppingBag}
          color="blue"
          />
          <ResumoCardCantina 
          title="Produto mais vendido"
          value={resumoDia.produtoMaisVendido}
          icon={Trophy}
          color="red"
          />
        </div>
      </div>
    </div>
  )
}