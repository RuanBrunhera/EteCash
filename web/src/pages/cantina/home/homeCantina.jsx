import {
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
  const colors = {
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
    green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  }
}

export default function HomeCantina() {
  return <h1 className="text-white text-2xl">Home Cantina</h1>
}