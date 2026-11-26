import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from '../navigation/Sidebar'

function LayoutBase({ children, items, storageKey, tipoUsuario }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-dvh overflow-hidden bg-zinc-900 md:m-3 md:h-[calc(100dvh-24px)] md:rounded-3xl">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <Sidebar
        items={items}
        storageKey={storageKey}
        tipoUsuario={tipoUsuario}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-gray-800 md:rounded-r-3xl">
        <header className="flex shrink-0 items-center gap-3 border-b border-zinc-700 bg-zinc-900 px-4 py-3 text-white md:hidden">
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-xl p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <Menu className="size-5" />
          </button>
          <span className="grid size-7 place-items-center rounded-lg bg-red-600 text-xs font-bold">
            EC
          </span>
          <span className="text-sm font-semibold">EteCash</span>
        </header>
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  )
}

export default LayoutBase