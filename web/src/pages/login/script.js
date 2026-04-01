const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const btnLogar = document.getElementById('btnLogin');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
})

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
})      

btnLogar.addEventListener('click', (event) => {
    event.preventDefault();

    const rm = document.querySelector('.inputRM').value;
    const senha = document.querySelector('.inputSenha').value;
        
    if (rm && senha) {
        window.location.href = "../home/index.html"
    }else {
        alert("Preencha todos os campos!")
    }
})