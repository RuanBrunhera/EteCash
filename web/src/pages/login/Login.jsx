import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../../services/authService";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  const [rm, setRm] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [senhaFuncionario, setSenhaFuncionario] = useState("");

  const handleLoginAluno = async (e) => {
    e.preventDefault();

    if (!rm || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    const { data, error } = await authService.loginAluno(parseInt(rm, 10), senha);

    if (error) {
      alert(error);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("aluno", JSON.stringify(data.aluno));
    navigate("/aluno/home");
  };

  const handleLoginFuncionario = async (e) => {
    e.preventDefault();

    if (!cpf || !senhaFuncionario) {
      alert("Preencha todos os campos!");
      return;
    }

    const { data, error } = await authService.loginFuncionario(cpf, senhaFuncionario);

    if (error) {
      alert(error);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("funcionario", JSON.stringify(data.funcionario));
    navigate("/cantina/home");
  };

  return (
    <div className="login-page">
      <div className={`container ${isActive ? "active" : ""}`}>
        {/* Login form - Aluno */}
        <div className="form-box login">
          <form onSubmit={handleLoginAluno}>
            <h1>Login aluno</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="RM"
                maxLength={11}
                required
                value={rm}
                onChange={(e) => setRm(e.target.value)}
              />
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Senha"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <i className="fa-solid fa-lock"></i>
            </div>
            <div className="forgot-link">
              <a href="#">Não se lembra da senha?</a>
            </div>
            <button type="submit" className="btn">
              Entrar
            </button>
          </form>
        </div>

        {/* Login form - Funcionário/Cantina */}
        <div className="form-box register">
          <form onSubmit={handleLoginFuncionario}>
            <h1>Login cantina</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="CPF"
                maxLength={11}
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <i className="fa-solid fa-id-card"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Senha"
                required
                value={senhaFuncionario}
                onChange={(e) => setSenhaFuncionario(e.target.value)}
              />
              <i className="fa-solid fa-lock"></i>
            </div>
            <button type="submit" className="btn">
              Entrar
            </button>
          </form>
        </div>

        {/* Toggle Box */}
        <div className="toggle-box"></div>

        {/* Toggle Left */}
        <div className="toggle-panel toggle-left">
          <h1>Bem vindo, etequiano!</h1>
          <p>É dono de uma cantina?</p>
          <button className="btn" onClick={() => setIsActive(true)}>
            Entrar como funcionário
          </button>
        </div>

        {/* Toggle Right */}
        <div className="toggle-panel toggle-right">
          <h1>Bem vindo, funcionário!</h1>
          <p>É um(a) etequiano?</p>
          <button className="btn" onClick={() => setIsActive(false)}>
            Entrar como aluno
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;