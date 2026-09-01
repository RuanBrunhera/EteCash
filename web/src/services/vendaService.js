import { apiClient } from "./apiClient"
  
  async function buscarAlunoPorRm(rm) {
    const { data, error } = await apiClient.request('GET', `/api/func/aluno/${rm}`)
    
    if (error) {
      return { data: null, error }
    }

    return { data: data.aluno, error: null }
  }

  async function listarProdutos() {
    const { data, error } = await apiClient.request('GET', '/api/func/produtos')
  
    if (error) {
      return { data: null, error } 
    }

    return { data: data.produtos, error: null }
  }

  async function finalizarVenda(payload) {
    const { data, error } = await apiClient.request('POST', '/api/func/transacao', payload)

    if (error) {
      return { data: null, error }
    }

    return { data: data.transacao , error: null }
  }

export const vendaService = {
  buscarAlunoPorRm,
  listarProdutos,
  finalizarVenda
}