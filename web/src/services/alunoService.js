import { apiClient } from "./apiClient"

async function atualizarSenha(payload) {
    const { data, error } = await apiClient.request('PATCH', '/api/aluno/senha', payload)

    if (error) {
        return { data: null, error }
    }

    return { data: data.message, error: null }
}

async function atualizarPin(payload) {
    const { data, error } = await apiClient.request('PATCH', '/api/aluno/pin', payload)

    if (error) {
        return { data: null, error }
    }

    return { data: data.message, error: null }
}

export const alunoService = {
  atualizarSenha,
  atualizarPin
}