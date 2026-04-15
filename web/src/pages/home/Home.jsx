import Sidebar from "../../components/sideBar.jsx"

export default function Home() {
    return (
        <div className="home-page">
        <div className="flex h-screen bg-gray-50 m-3">
            <Sidebar />

            <main className="flex-1 overflow-auto bg-blue-200 rounded-r-3xl">
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bem-vindo ao EteCash</h1>
                    <p className="mt-2 text-gray-600">Sistema de pagamentos digitais da cantina</p>
                </div>
            </main>
        </div>
        </div>

    )
}