import Layout from './components/layout/layout'
import Home from './pages/home/Home'
import Historico from './pages/historico/historico'
import Login from './pages/login/Login'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      {/* Sem sidebar */}
      <Route path="/" element={<Login />} />

      {/* Com sidebar */}
      <Route path="/home" element={<Layout><Home /></Layout>} />
      <Route path="/historico" element={<Layout><Historico /></Layout>} />
    </Routes>
  )
}

export default App;