import { API_URL } from "../config/api"

/**
 * Faz uma requisição HTTP genérica e NUNCA lança exceção pro chamador.
 * Sempre resolve com { data, error }.
 *
 * @param {string} method - 'GET', 'POST', 'PATCH', etc.
 * @param {string} path - caminho relativo, ex: '/api/func/produtos'
 * @param {object} [body] - corpo da requisição, se houver
 * @param {boolean} [semAuth=false] - permite chamadas públicas sem token
 * @returns {Promise<{ data: any, error: string|null }>}
 */

async function request(method, path, body, semAuth = false) {
    const token = localStorage.getItem('token')

  if (!token && !semAuth) {
    return { data: null, error: 'Token de autenticação não encontrado. Faça login novamente' }
  }

    const headers = {}

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  const options = {
    method, 
    headers,
  }
  if (body) {
    options.body = JSON.stringify(body)
  }

  try {
    const res = await fetch(`${API_URL}${path}`, options)
  const json = await res.json()
  
    if (!res.ok) {
      const errorMessage = json.error || 'Erro na requisição'
      return { data: null, error: errorMessage}
    }

    return { data: json, error: null }
  } catch (err) {
    console.error('Erro de rede ou parsing:', err)
    return { data: null, error: 'Falha de rede ou erro ao processar resposta' }
  }
  }

export const apiClient = { request }