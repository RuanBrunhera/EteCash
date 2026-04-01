import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Login.css'

function Login() {
    const navigate = useNavigate()
    const [isActive, setIsActive] = useState(false)

    const handleLogin = (e) => {
        e.preventDefault()
        const rm = document.getElementById('inputRM').value
        const senha = document.getElementById('inputSenha').value

        if (rm && senha) {
            navigate('/home')
        } else {
            alert('Preencha todos os campos!')
        }
    }

    return (
        <div className={`container ${isActive ? 'active' : ''}`}>

            {/* Login form */}
            <div className="form-box login">
                <form>
                    <h1>Login aluno</h1>
                    <div className="input-box">
                        <input type="text" placeholder="RM" id="inputRM" required />
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Senha" id="inputSenha" required />
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <div className="forgot-link">
                        <a href="#">Não se lembra da senha?</a>
                    </div>
                    <button className="btn" id="btnLogin" onClick={handleLogin}>Entrar</button>
                    <p>Or login with social platforms</p>
                    <div className="social-icons">
                        <a href="#"><i className="fa-brands fa-google"></i></a>
                        <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#"><i className="fa-brands fa-github"></i></a>
                        <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                    </div>
                </form>
            </div>

            {/* Register form */}
            <div className="form-box register">
                <form>
                    <h1>Login cantina</h1>
                    <div className="input-box">
                        <input type="text" placeholder="CPF" maxLength="14" required />
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder="EmailLojista@gmail.com" required />
                        <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Senha" required />
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <button className="btn">Entrar</button>
                    <p>Or register with social platforms</p>
                    <div className="social-icons">
                        <a href="#"><i className="fa-brands fa-google"></i></a>
                        <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#"><i className="fa-brands fa-github"></i></a>
                        <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                    </div>
                </form>
            </div>

            {/* Toggle Box */}
            <div className="toggle-box"></div>

            {/* Toggle Left */}
            <div className="toggle-panel toggle-left">
                <h1>Bem vindo etequiano!</h1>
                <p>É dono de uma cantina?</p>
                <button className="btn" onClick={() => setIsActive(true)}>Entrar como lojista</button>
            </div>

            {/* Toggle Right */}
            <div className="toggle-panel toggle-right">
                <h1>Bem vindo lojista!</h1>
                <p>É um(a) etequiano?</p>
                <button className="btn" onClick={() => setIsActive(false)}>Entrar como aluno</button>
            </div>

        </div>
    )
}

export default Login