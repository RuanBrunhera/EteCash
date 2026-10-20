// Imports admin
import LayoutAdmin from "./components/layout/LayoutAdmin";
import AlunosAdmin from "./pages/admin/alunos/AlunosAdmin";
import FuncionariosAdmin from "./pages/admin/funcionarios/FuncionariosAdmin";
import RotaProtegida from "./components/common/RotaProtegida";
// Imports aluno
import LayoutAluno from "./components/layout/LayoutAluno";
import Home from "./pages/aluno/home/Home";
import Historico from "./pages/aluno/historico/Historico";
import Login from "./pages/login/Login";
import Profile from "./pages/aluno/profile/Profile";
import Statistics from "./pages/aluno/statistics/Statistics";
import FloatingButton from "./components/fab/FloatingButton";
// Imports cantina
import LayoutCantina from "./components/layout/LayoutCantina";
import HomeCantina from "./pages/cantina/home/HomeCantina";
import ProdutosCantina from "./pages/cantina/produtos/ProdutosCantina";
import ProfileCantina from "./pages/cantina/profile/ProfileCantina";
import HistoricoCantina from "./pages/cantina/historico/HistoricoCantina";
import RelatorioCantina from "./pages/cantina/relatorios/RelatoriosCantina";
import VendasCantina from "./pages/cantina/vendas/VendasCantina";
import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  return (
    <>
      <Routes>
        {/* Sem sidebar */}
        <Route path="/" element={<Login />} />

        {/* Rotas Admin: só admin */}
        <Route element={<RotaProtegida roles={["admin"]} />}>
          <Route
            path="/admin/alunos"
            element={
              <LayoutAdmin>
                <AlunosAdmin />
              </LayoutAdmin>
            }
          />
          <Route
            path="/admin/funcionarios"
            element={
              <LayoutAdmin>
                <FuncionariosAdmin />
              </LayoutAdmin>
            }
          />
        </Route>

        {/* Rotas Cantina: funcionário e admin */}
        <Route element={<RotaProtegida roles={["funcionario", "admin"]} />}>
          <Route
            path="/cantina/home"
            element={
              <LayoutCantina>
                <HomeCantina />
              </LayoutCantina>
            }
          />
          <Route
            path="/cantina/produtos"
            element={
              <LayoutCantina>
                <ProdutosCantina />
              </LayoutCantina>
            }
          />
          <Route
            path="/cantina/profile"
            element={
              <LayoutCantina>
                <ProfileCantina />
              </LayoutCantina>
            }
          />
          <Route
            path="/cantina/historico"
            element={
              <LayoutCantina>
                <HistoricoCantina />
              </LayoutCantina>
            }
          />
          <Route
            path="/cantina/relatorios"
            element={
              <LayoutCantina>
                <RelatorioCantina />
              </LayoutCantina>
            }
          />
          <Route
            path="/cantina/vendas"
            element={
              <LayoutCantina>
                <VendasCantina />
              </LayoutCantina>
            }
          />
        </Route>

        {/* Rotas Aluno: só aluno */}
        <Route element={<RotaProtegida roles={["aluno"]} />}>
          <Route
            path="/aluno/home"
            element={
              <LayoutAluno>
                <Home />
              </LayoutAluno>
            }
          />
          <Route
            path="/aluno/historico"
            element={
              <LayoutAluno>
                <Historico />
              </LayoutAluno>
            }
          />
          <Route
            path="/aluno/profile"
            element={
              <LayoutAluno>
                <Profile />
              </LayoutAluno>
            }
          />
          <Route
            path="/aluno/statistics"
            element={
              <LayoutAluno>
                <Statistics />
              </LayoutAluno>
            }
          />
        </Route>
      </Routes>
      {(location.pathname.startsWith("/aluno") ||
        location.pathname.startsWith("/cantina")) && <FloatingButton />}
    </>
  );
}

export default App;