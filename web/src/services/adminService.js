import { apiClient } from "./apiClient";

async function listarAlunos() {
    const { data, error } = await apiClient.request("GET", "/api/admin/alunos")
    
    if (error) {
        return { data: null, error }
    }

    return { data: data.alunos, error: null }
}

async function alterarStatusAluno(rm, ativo) {
    const { data, error } = await apiClient.request("PATCH", `/api/admin/aluno/${rm}/ativo`, { ativo })

    if (error) {
        return { data: null, error }
    }

    return { data: data.message, error: null }
}

async function listarFuncionarios() {
    const { data, error } = await apiClient.request("GET", "/api/admin/funcionarios")

    if (error) {
        return { data: null, error }
    }

    return { data: data.funcionarios, error: null }
}

async function alterarStatusFuncionario(id, ativo) {
    const { data, error } = await apiClient.request("PATCH", `/api/admin/funcionario/${id}/ativo`, { ativo })

    if (error) {
        return { data: null, error }
    }

    return { data: data.message, error: null }
}


const adminService = {
    listarAlunos,
    alterarStatusAluno,
    listarFuncionarios,
    alterarStatusFuncionario,
};

export default adminService;