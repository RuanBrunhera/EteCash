import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    LogOut,
    ChevronFirst,
    ChevronLast,
    Home,
    HandCoins,
    ShoppingBasket,
    ScrollText,
    Landmark,
    X,
} from 'lucide-react'

const items = [
  {href: '/cantina/home', label: 'Home', icon: Home},
  {href: '/cantina/vendas', label: 'Vendas', icon: HandCoins},
  {href: '/cantina/produtos', label: 'Produtos', icon: ShoppingBasket},
  {href: '/cantina/relatorios', label: 'Relatório', icon: ScrollText},
  {href: '/cantina/profile', label: 'Info func.', icon: Landmark},
]


function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="size-12 rounded-2xl bg-red-600/10 grid place-items-center">
            <LogOut className="size-6 text-red-500" />
          </div>
          <button
            onClick={onCancel}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="size-4"/>
          </button>
        </div>

        <h3 className='text-white font-semibold text-lg mb-1'>Sair da conta?</h3>
        <p className='text-zinc-400 text-sm mb-6'>
          Você precisará fazer login novamente para acessar sua conta.
        </p>

      <div className='flex gap-3'>
        <button
          onClick={onCancel}
          className='flex-1 rounded-xl bg-zinc-800 text-white text-sm font-medium py-2.5 hover:bg-zinc-700 transition-colors'
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className='flex-1 rounded-xl bg-red-600 text-white text-sm font-medium py-2.5 hover:bg-red-700 transition-colors'
        >
          Sair
        </button>
      </div>

      </div>
    </div>
  )
}

function SidebarCantina(){
    const [open, setOpen] = useState(true)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
  
    useEffect(() => {
      const saved = localStorage.getItem('sidebar-cantina-open')
      if (saved) setOpen(saved === '1')
    }, [])
  
    useEffect(() => {
      localStorage.setItem('sidebar-cantina-open', open ? '1' : '0')
    }, [open])

    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('funcionario')
      setShowLogoutModal(false)
      navigate('/')
    }
  
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
        <div className='px-3 pb-5 pt-2 border-t border-zinc-800 space-y-3'>
          <button
            onClick={() => setShowLogoutModal(true)}
            className='w-full flex items-center gap-3 rounded-xl px-3 py-3 text-zinc-400 hover:bg-red-600/10 hover:text-red-400 transition-colors'
          >
            <LogOut className='size-5 '/>
            <span className={`${open ? 'block' : 'hidden'} text-sm`}>Sair</span>
          </button>
        </div>
  
        {showLogoutModal && (
          <LogoutModal 
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutModal(false)}
          />
        )}
      </aside>
    )
}

export default SidebarCantina