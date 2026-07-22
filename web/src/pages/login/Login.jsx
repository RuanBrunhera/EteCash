import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleLoginAluno = async (e) => {
    e.preventDefault();
    const rm = document.getElementById("inputRM").value;
    const senha = document.getElementById("inputSenha").value;

    if (!rm || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/login/aluno`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rm: parseInt(rm), senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao fazer login");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("aluno", JSON.stringify(data.aluno));

      navigate("/aluno/home");
    } catch (error) {
      alert("Erro ao conectar com o servidor");
    }
  };

  const handleLoginFuncionario = async (e) => {
    e.preventDefault();
    const cpf = document.getElementById("inputCPF").value;
    const senha = document.getElementById("inputSenhaFuncionario").value;

    if (!cpf || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/login/funcionario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao fazer login");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("funcionario", JSON.stringify(data.funcionario));

      navigate("/cantina/home");
    } catch (error) {
      alert("Erro ao conectar com o servidor");
    }
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
                id="inputRM"
                maxLength={11}
                required
              />
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Senha"
                id="inputSenha"
                required
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
                id="inputCPF"
                maxLength={11}
                required
              />
              <i className="fa-solid fa-id-card"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Senha"
                id="inputSenhaFuncionario"
                required
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
          <h1>Bem vindo etequiano!</h1>
          <p>É funcionário(a) de cantina?</p>
          <button className="btn" onClick={() => setIsActive(true)}>
            Entrar como lojista
          </button>
        </div>

        {/* Toggle Right */}
        <div className="toggle-panel toggle-right">
          <h1>Bem vindo lojista!</h1>
          <p>É um(a) etequiano(a)?</p>
          <button className="btn" onClick={() => setIsActive(false)}>
            Entrar como aluno
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
