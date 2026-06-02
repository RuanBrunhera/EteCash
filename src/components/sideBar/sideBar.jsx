import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  MessageCircle,
  BarChart3,
  Shield,
  TabletSmartphone,
  UserRound,
  LogIn,
  LogOut,
  ChevronFirst,
  ChevronLast,
  ScrollText,
} from 'lucide-react'

const items = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/historico', label: "Histórico", icon: ScrollText },
  { href: '/profile', label: 'Perfil', icon: UserRound },
  { href: '#', label: 'Messages', icon: MessageCircle },
  { href: '#', label: 'Statistics', icon: BarChart3 },
  { href: '#', label: 'Security', icon: Shield },
  { href: '#', label: 'Devices', icon: TabletSmartphone },
  { href: '#', label: 'Signin', icon: LogIn },
  { href: '/', label: 'Logout', icon: LogOut },
]

function Sidebar() {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  // Carregar estado do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-open')
    if (saved) setOpen(saved === '1')
  }, [])

  // Salvar estado do localStorage ao mudar
  useEffect(() => {
    localStorage.setItem('sidebar-open', open ? '1' : '0')
  }, [open])

  const handleNavigation = (href) => {
    navigate(href)
  }

  return (
    <aside
      className={`bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-[width] duration-300 rounded-l-3xl flex flex-col h-full ${
        open ? 'w-52' : 'w-20'
      }`}
      aria-label="Primary navigation"
    >
      {/* Header com logo e botão toggle */}
      <div className="flex items-center justify-between gap-2 px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-white/20 grid place-items-center font-bold">LMR</div>
          <span className={`${open ? 'block' : 'hidden'} text-sm font-semibold`}>EteCash</span>
        </div>
        <button
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg bg-white/20 p-1.5 hover:bg-white/30 transition-colors"
        >
          {open ? <ChevronFirst className="size-5" /> : <ChevronLast className="size-5" />}
        </button>
      </div>

      {/* Menu de navegação */}
      <nav className="mt-2 flex-1">
        <ul className="flex flex-col gap-1 px-3">
          {items.map(({ href, label, icon: Icon }) => {
            const active = location.pathname === href || (href !== '/' && location.pathname?.startsWith(href))
            return (
              <li key={href}>
                <button
                  onClick={() => handleNavigation(href)}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${
                    active ? 'bg-white text-blue-600' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <Icon className={`size-5 ${active ? 'text-blue-600' : 'text-white'}`} />
                  <span className={`${open ? 'block' : 'hidden'} text-sm`}>{label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

    </aside>
  )
}

export default Sidebar