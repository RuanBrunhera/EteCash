import {
  Home,
  HandCoins,
  ShoppingBasket,
  ScrollText,
  Landmark,
  ChartNoAxesCombined,
  BarChart3,
  UserRound,
  GraduationCap,
  Users,
  Store,
  ShieldCheck,
} from 'lucide-react'

export const itemsAdmin = [
  { href:'/admin/alunos', label: 'Alunos', icon: GraduationCap},
  { href:'/admin/funcionarios', label: 'Funcionários', icon: Users},
  { href:'cantina/home', label: 'Ir para a cantina', icon: Store},
]

//aparece na sidebar da cantina só para quem é admin]
export const itemAdminNoMenuCantina = {
  href: '/admin/alunos',
  label: 'Administração',
  icon: ShieldCheck,
}

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