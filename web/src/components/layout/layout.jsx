import Sidebar from '../sideBar/sideBar'

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 m-3">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-white rounded-r-3xl p-8">
        {children}
      </main>
    </div>
  )
}

export default Layout