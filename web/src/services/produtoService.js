import { apiClient } from './apiClient'

async function listarProdutos() {
    const { data, error } = await apiClient.request('GET', '/api/func/produtos')

    if (error) {
        return { data: null, error }
    }

    return { data: data.produtos, error: null }
}

async function criarProduto(payload) {
    const { data, error } = await apiClient.request('POST', '/api/func/produto', payload)

    if (error) {
        return { data: null, error }
    }

    return { data: data.produto, error: null }
}

async function atualizarProduto(id, payload) {
    const { data, error } = await apiClient.request('PUT', `/api/func/produto/${id}`, payload)

    if (error) { 
        return { data: null, error }
    }

    return { data: data.produto, error: null }
}

export const produtoService = {
    listarProdutos,
    criarProduto,
    atualizarProduto,
}