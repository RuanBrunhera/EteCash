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

async function buscarHistorico() {
    const { data, error } = await apiClient.request('GET', '/api/aluno/historico')

    if (error) {
        return { data: null, error }
    }

    return { data: data.historico, error: null }
}

async function buscarDetalheTransacao(transacaoId) {
        const { data, error } = await apiClient.request('GET', `/api/aluno/transacao/${transacaoId}`)

        if (error) {
                return { data: null, error }
        }

        return { data, error: null }
}

export const alunoService = {
  atualizarSenha,
    atualizarPin,
        buscarHistorico,
    buscarDetalheTransacao
}