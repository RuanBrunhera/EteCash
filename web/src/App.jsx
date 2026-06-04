import Layout from './components/layout/layout'
import Home from './pages/home/Home'
import Historico from './pages/historico/Historico'
import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import Statistics from './pages/statistics/Statistics'
import FloatingButton from "./components/floatingButton/floatingButton"
import { Routes, Route, useLocation } from 'react-router-dom'

function App() {

  //TEMPORARIO PARA TESTE, DESATIVANDO A VERIFICACAO DE LOGIN
  const location = useLocation()

  return (
    <>
    <Routes>
      {/* Sem sidebar */}
      <Route path="/" element={<Login />} />

      {/* Com sidebar */}
      <Route path="/home" element={<Layout><Home /></Layout>} />
      <Route path="/historico" element={<Layout><Historico /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>}/>
      <Route path="/statistics" element={<Layout><Statistics /></Layout>}/>
    </Routes>

    {location.pathname !== "/" && <FloatingButton />}
    </>
  )
}

export default App;