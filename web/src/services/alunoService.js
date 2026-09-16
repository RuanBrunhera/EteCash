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

async function buscarResumoMes() {
  const { data, error } = await apiClient.request('GET', '/api/aluno/resumo-mes')

    if (error) {
        return { data: null, error}
    }

    return { data, error: null }
    
}

async function buscarPerfil() {
    const { data, error } = await apiClient.request('GET', '/api/aluno/perfil')

    if (error) {
        return { data: null, error } 
    }

    return { data: data.aluno, error: null }
}

async function adicionarSaldo(payload) {
    const { data, error } = await apiClient.request('POST', '/api/aluno/saldo', payload)

    if (error) {
        return { data: null, error }
    }

    return { data: data.aluno, error: null }
}

export const alunoService = {
    atualizarSenha,
    atualizarPin,
    buscarHistorico,
    buscarDetalheTransacao,
    buscarResumoMes,
    buscarPerfil,
    adicionarSaldo
}