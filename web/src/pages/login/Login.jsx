import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Login.css'

function Login() {
    const navigate = useNavigate()
    const [isActive, setIsActive] = useState(false)

    const handleLogin = async (e) => {
    e.preventDefault()
    const rm = document.getElementById('inputRM').value
    const senha = document.getElementById('inputSenha').value

    if (!rm || !senha) {
        alert('Preencha todos os campos!')
        return
    }

    try {
        const response = await fetch('http://localhost:2000/api/login/aluno', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rm: parseInt(rm), senha })
        })

        const data = await response.json()

        if (!response.ok) {
            alert(data.error || 'Erro ao fazer login')
            return
        }

        // Salva o token e dados do aluno
        localStorage.setItem('token', data.token)
        localStorage.setItem('aluno', JSON.stringify(data.aluno))

        navigate('/home')

    } catch (error) {
        alert('Erro ao conectar com o servidor')
    }
}

    return (
        <div className="login-page">
            <div className={`container ${isActive ? 'active' : ''}`}>

            {/* Login form */}
            <div className="form-box login">
                <form onSubmit={handleLogin} >
                    <h1>Login aluno</h1>
                    <div className="input-box">
                        <input type="text" placeholder="RM" id="inputRM" maxLength={11} required />
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Senha" id="inputSenha" required />
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <div className="forgot-link">
                        <a href="#">Não se lembra da senha?</a>
                    </div>
                    <button type="submit" className="btn">Entrar</button>
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
                <form onSubmit={handleLogin}>
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
                    <button type="submit"className="btn">Entrar</button>
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
        </div>
    )
}

export default Login