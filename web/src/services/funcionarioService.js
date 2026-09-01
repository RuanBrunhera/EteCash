import { apiClient } from "./apiClient"

    async function atualizarPerfil(payload) {
        const { data, error } = await apiClient.request('PATCH', '/api/func/perfil', payload)
        
        if (error) {
            return { data: null, error }
        }

        return { data: data.funcionario, error: null }
    }

async function atualizarSenha(payload) {
    const { data, error } = await apiClient.request('PATCH', '/api/func/senha', payload)

    if (error) {
        return { data: null, error }
    }

    return { data: data.message, error: null }
}

async function cadastrarFuncionario(payload) {
    const { data, error } = await apiClient.request('POST', '/api/admin/funcionario', payload) //SÓ PRA ADM 

    if (error) {
        return { data: null, error }
    }

    return { data: data.funcionario, error: null }
}

export const funcionarioService = {
  atualizarPerfil, 
  atualizarSenha,
  cadastrarFuncionario
}