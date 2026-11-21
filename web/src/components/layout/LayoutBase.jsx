import Sidebar from '../navigation/Sidebar'

function LayoutBase({ children, items, storageKey, tipoUsuario }) {
  return (
    <div className="m-3 flex h-[calc(100vh-24px)] overflow-hidden rounded-3xl bg-gray-50">
      <Sidebar items={items} storageKey={storageKey} tipoUsuario={tipoUsuario} />
      <main className="flex-1 overflow-auto rounded-r-3xl bg-gray-800 p-8">
        {children}
      </main>
    </div>
  )
}

export default LayoutBase