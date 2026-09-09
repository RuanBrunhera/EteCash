import Sidebar from '../navigation/Sidebar'

function LayoutBase({ children, items, storageKey, tipoUsuario }) {
  return (
    <div className="flex h-[calc(100vh-24px)] bg-gray-50 m-3">
      <Sidebar items={items} storageKey={storageKey} tipoUsuario={tipoUsuario} />
      <main className="flex-1 overflow-auto bg-gray-800 rounded-r-3xl p-8">
        {children}
      </main>
    </div>
  )
}

export default LayoutBase