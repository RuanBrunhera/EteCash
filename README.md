# 🏫 EteCash

**EteCash** é um sistema de pagamentos digitais desenvolvido para uso interno em escolas, facilitando a compra de produtos na cantina pelos alunos sem a necessidade de dinheiro em espécie ou cartões.  
O projeto foi desenvolvido como **Trabalho de Conclusão de Curso (TCC)** do curso técnico de Desenvolvimento de Sistemas da ETEC.

---

## 🎯 Objetivos do Projeto

### Objetivo Geral
Facilitar o pagamento de produtos na cantina escolar, garantindo **praticidade** e **segurança** para alunos e funcionários.

### Objetivos Específicos
- Permitir que alunos adicionem saldo em suas contas digitais
- Registrar e processar pagamentos realizados na cantina
- Manter histórico de transações para consulta de alunos e funcionários
- Fornecer controle de estoque e preços dos produtos
- Garantir segurança e integridade das transações via JWT

---

## 🛠 Tecnologias Utilizadas

### Frontend Web
- React + Vite
- Tailwind CSS
- React Router DOM
- Recharts (gráficos)

### Frontend Mobile
- React Native + Expo

### Backend
- Go + Gin (framework HTTP)
- GORM (ORM)
- JWT para autenticação
- SHA-256 para hash de senhas

### Banco de Dados
- PostgreSQL

### Infraestrutura
- Docker + Docker Compose

---

## 📂 Estrutura do Projeto
EteCash/ <br>
├─ frontend/        # Código do aplicativo mobile (React Native)<br>
├─ backend/         # Código do servidor/API (Node.js ou Golang)<br>
├─ web/             # Código do site para gerenciamento (HTML/CSS/JS)<br>
├─ database/        # Banco de dados (PostgreSQL)<br>
│   ├─ schema.sql   # Criação das tabelas e relacionamentos<br>
│   ├─ seed.sql     # Dados iniciais para testes<br>
│   ├─ migrations/  # Alterações futuras na estrutura<br>
│   └─ README.md    # Documentação do database<br>
├─ LICENSE          # Licença MIT<br>
└─ README.md        # Este arquivo<br>

---

## 🚀 Como iniciar o sistema

### Pré-requisitos
- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado

### 1. Clone o repositório
```bash
git clone https://github.com/RuanBrunhera/EteCash.git
cd EteCash
```

### 2. Suba os containers
```bash
docker-compose up -d
```

### 3. Verifique se os containers estão rodando
```bash
docker ps
```

Você deve ver:
| Container | Porta |
|-----------|-------|
| `etecash_api` | 3000 |
| `etecash_db` | 5432 |
| `etecash_web` | 5173 |
| `etecash_mobile` | 8081 |

### 4. Acesse o sistema
- **Frontend Web:** http://localhost:5173
- **API:** http://localhost:3000
- **Health check:** http://localhost:3000/health

### 5. Para parar o sistema
```bash
# Mantém os dados do banco
docker-compose down

# Apaga os dados do banco também
docker-compose down -v
```

---

## 👤 Credenciais de teste

| Tipo | Campo | Valor |
|------|-------|-------|
| Aluno | RM | `123456` |
| Aluno | Senha | `password` |

---

## 💾 Banco de Dados

Estrutura principal:
- **aluno** — RM, nome, série, saldo, senha
- **funcionario** — nome, telefone, senha
- **produto** — nome, descrição, preço, estoque
- **transacao** — registro de vendas
- **historico** — depósitos e débitos do aluno

---

## 🔐 Tipos de Usuário

| Perfil | Permissões |
|--------|-----------|
| **Aluno** | Adicionar saldo, consultar saldo e histórico |
| **Funcionário** | Registrar vendas, gerenciar produtos |

---

## 📈 Futuras melhorias

- Transferência de saldo entre alunos
- Notificações de transações
- Relatórios avançados de estoque
- Autenticação com bcrypt

---

## 🎓 Contexto Acadêmico

Este projeto integra conceitos de modelagem de dados, banco de dados relacional, desenvolvimento fullstack e boas práticas de segurança e programação.