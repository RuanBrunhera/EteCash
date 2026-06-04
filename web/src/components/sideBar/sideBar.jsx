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
  BarChart,
} from 'lucide-react'

const items = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/historico', label: "Histórico", icon: ScrollText },
  { href: '/profile', label: 'Perfil', icon: UserRound },
  { href: '/statistics', label: 'Estatísticas', icon: BarChart3 },
  { href: '#', label: 'Messages', icon: MessageCircle },
  { href: '#', label: 'Security', icon: Shield },
  { href: '#', label: 'Devices', icon: TabletSmartphone },
  { href: '#', label: 'Signin', icon: LogIn },
  { href: '/', label: 'Logout', icon: LogOut },
]

function Sidebar() {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-open')
    if (saved) setOpen(saved === '1')
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebar-open', open ? '1' : '0')
  }, [open])

  return (
    <aside
      className={`bg-gradient-to-b from-zinc-900 to-zinc-950 text-white transition-[width] duration-300 rounded-l-3xl flex flex-col h-full border-r border-zinc-800 ${
        open ? 'w-52' : 'w-20'
      }`}
      aria-label="Primary navigation"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-red-600 grid place-items-center font-bold text-sm">
            EC
          </div>
          <span className={`${open ? 'block' : 'hidden'} text-sm font-semibold text-white`}>
            EteCash
          </span>
        </div>
        <button
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg bg-zinc-800 p-1.5 hover:bg-zinc-700 transition-colors"
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
                  onClick={() => navigate(href)}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${
                    active
                      ? 'bg-red-600 text-white'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <Icon className="size-5" />
                  <span className={`${open ? 'block' : 'hidden'} text-sm`}>{label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Rodapé */}
      <div className="px-3 pb-5 pt-2 border-t border-zinc-800">
        <div className={`rounded-2xl bg-zinc-800 p-3 ${!open && 'hidden'}`}>
          <p className="text-xs text-zinc-400 leading-5">
            Gerencie seus pagamentos com segurança.
          </p>
        </div>
      </div>

    </aside>
  )
}

export default Sidebar