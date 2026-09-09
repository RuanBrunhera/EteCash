import {
  Home,
  HandCoins,
  ShoppingBasket,
  ScrollText,
  Landmark,
  ChartNoAxesCombined,
  BarChart3,
  UserRound,
} from 'lucide-react'

export const itemsAluno = [
  { href: '/aluno/home', label: 'Home', icon: Home },
  { href: '/aluno/historico', label: 'Histórico', icon: ScrollText },
  { href: '/aluno/statistics', label: 'Estatísticas', icon: BarChart3 },
  { href: '/aluno/profile', label: 'Perfil', icon: UserRound },
]

export const itemsCantina = [
  { href: '/cantina/home', label: 'Home', icon: Home },
  { href: '/cantina/vendas', label: 'Vendas', icon: HandCoins },
  { href: '/cantina/produtos', label: 'Produtos', icon: ShoppingBasket },
  { href: '/cantina/historico', label: 'Histórico de vendas', icon: ScrollText },
  { href: '/cantina/relatorios', label: 'Relatório', icon: ChartNoAxesCombined },
  { href: '/cantina/profile', label: 'Info func.', icon: Landmark },
]