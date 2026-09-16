import { apiClient } from "./apiClient"

async function loginAluno(rm, senha) {
  const { data, error } = await apiClient.request(
    'POST',
    '/api/login/aluno',
    { rm, senha },
    true
  )

  if (error) {
    return {data: null, error}
  }

  return { data, error: null}

}

async function loginFuncionario(cpf, senha) {
  const { data, error } = await apiClient.request(
    'POST',
    '/api/login/funcionario',
    { cpf, senha },
    true
  )

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

export const authService = { loginAluno, loginFuncionario }