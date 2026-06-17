// Imports aluno
import Layout from './components/layout/layout'
import Home from './pages/aluno/home/Home'
import Historico from './pages/aluno/historico/Historico'
import Login from './pages/login/Login'
import Profile from './pages/aluno/profile/Profile'
import Statistics from './pages/aluno/statistics/Statistics'
import FloatingButton from "./components/floatingButton/floatingButton"
// Imports cantina
import LayoutCantina from './components/layout/layoutCantina'
import HomeCantina from './pages/cantina/home/homeCantina'
import ProdutosCantina from './pages/cantina/produtos/produtosCantina'
import ProfileCantina from './pages/cantina/profile/profileCantina'
import RelatoriosCantina from './pages/cantina/relatorios/relatoriosCantina'
import VendasCantina from './pages/cantina/vendas/vendasCantina'
import { Routes, Route, useLocation } from 'react-router-dom'

function App() {
  //TEMPORARIO PARA TESTE, DESATIVANDO A VERIFICACAO DE LOGIN
  const location = useLocation()
  return (
    <>
    <Routes>
      {/* Sem sidebar */}
      <Route path="/" element={<Login />} />

      {/* Rotas Aluno */}
      <Route path="/aluno/home" element={<Layout><Home /></Layout>} />
      <Route path="/aluno/historico" element={<Layout><Historico /></Layout>} />
      <Route path="/aluno/profile" element={<Layout><Profile /></Layout>}/>
      <Route path="/aluno/statistics" element={<Layout><Statistics /></Layout>}/>

      {/* Rotas Cantina */}
      <Route path="/cantina/home" element={<LayoutCantina><HomeCantina /></LayoutCantina>}/>
      <Route path="/cantina/produtos" element={<LayoutCantina><ProdutosCantina /></LayoutCantina>}/>
      <Route path="/cantina/profile" element={<LayoutCantina><ProfileCantina /></LayoutCantina>}/>
      <Route path="/cantina/relatorios" element={<LayoutCantina><RelatoriosCantina /></LayoutCantina>}/>
      <Route path="/cantina/vendas" element={<LayoutCantina><VendasCantina /></LayoutCantina>}/>
    </Routes>
    {location.pathname.startsWith("/aluno") && <FloatingButton />}
    </>
  )
}

export default App