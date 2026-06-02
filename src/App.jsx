import Layout from './components/layout/layout'
import Home from './pages/home/Home'
import Historico from './pages/historico/historico'
import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import FloatingButton from "./components/floatingButton/floatingButton"
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
    <Routes>
      {/* Sem sidebar */}
      <Route path="/" element={<Login />} />

      {/* Com sidebar */}
      <Route path="/home" element={<Layout><Home /></Layout>} />
      <Route path="/historico" element={<Layout><Historico /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
    </Routes>

    {location.pathname !== "/" && <FloatingButton />}
    </>
  )
}

export default App;