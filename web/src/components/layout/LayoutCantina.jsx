import SidebarCantina from '../cantina/SidebarCantina'

function LayoutCantina({ children }) {
  return (
    <div className="flex h-[calc(100vh-24px)] bg-gray-50 m-3">
      <SidebarCantina />
      <main className="flex-1 overflow-auto bg-gray-800 rounded-r-3xl p-8">
        {children}
      </main>
    </div>
  )
}

export default LayoutCantina