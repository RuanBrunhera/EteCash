# 🏫 EteCash

**EteCash** é um sistema de pagamentos digitais desenvolvido para uso interno em escolas, facilitando a compra de produtos na cantina pelos alunos sem a necessidade de dinheiro em espécie ou cartões.  
O projeto foi desenvolvido como **Trabalho de Conclusão de Curso (TCC)** do curso técnico.

---

## 🎯 Objetivos do Projeto

### Objetivo Geral
Facilitar o pagamento de produtos na cantina escolar, garantindo **praticidade** e **segurança** para alunos e funcionários.

### Objetivos Específicos
- Permitir que alunos adicionem saldo em suas contas digitais.
- Registrar e processar pagamentos realizados na cantina.
- Manter histórico de transações para consulta de alunos e funcionários.
- Fornecer controle de estoque e preços dos produtos.
- Garantir segurança e integridade das transações.

---

## 🛠 Tecnologias Utilizadas

### Frontend
- React Native (Aplicativo Mobile)
- HTML, CSS, JavaScript (Web)

### Backend
- Node.js ou Golang
- API REST para comunicação entre frontend e banco de dados

### Banco de Dados
- PostgreSQL (relacional)
- Estrutura de tabelas normalizada, com histórico de transações e saldo dos alunos

---

## 📂 Estrutura do Projeto

EteCash/
│
├─ frontend/ # Código do aplicativo mobile (React Native)
├─ backend/ # Código do servidor/API (Node.js ou Golang)
├─ web/ # Código do site para gerenciamento (HTML/CSS/JS)
├─ database/ # Banco de dados (PostgreSQL)
│ ├─ schema.sql # Criação das tabelas e relacionamentos
│ ├─ seed.sql # Dados iniciais para testes
│ ├─ migrations/ # Alterações futuras na estrutura
│ └─ README.md # Documentação do database
├─ LICENSE # Licença MIT
└─ README.md # Este arquivo

yaml
Copiar código

---

## 💾 Banco de Dados

O banco de dados foi projetado para:

- Alunos (RM, nome, série, saldo)  
- Funcionários da cantina  
- Produtos e itens de transação  
- Histórico de pagamentos e estoque  

**Execução:**

```bash
# Criar banco
CREATE DATABASE etecash;

# Acessar banco
\c etecash

# Executar arquivos SQL
\i schema.sql
\i seed.sql
📌 Importante:
O schema.sql deve ser executado antes do seed.sql.

🔐 Segurança e Permissões
Tipos de Usuário
Aluno

Adicionar saldo

Realizar pagamentos

Consultar saldo e histórico de compras

Cantina

Processar pagamentos

Gerenciar produtos (preço, estoque)

Consultar histórico de vendas

Administrador

Controle total do sistema, incluindo usuários, saldo e produtos

Observações de Segurança
Login com senha para todos os usuários

Controle de acesso por tipo de usuário

Logs de transações e erros para auditoria

⚙️ Instalação e Configuração
Clone o repositório:

bash
Copiar código
git clone https://github.com/RuanBrunhera/EteCash.git
Configure o banco de dados PostgreSQL (database/schema.sql e database/seed.sql)

Configure o backend (Node.js ou Golang) e a API

Configure o frontend (React Native) e/ou web

Teste o sistema adicionando saldo e realizando pagamentos simulados

📄 Licença
text
Copiar código
MIT License

Copyright (c) 2025
Luis Fernando Antunes de Lima
Ruan Henrique Brunhera Aronchi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
🎓 Contexto Acadêmico
Este projeto integra conceitos de:

Modelagem de dados

Banco de dados relacional

Desenvolvimento fullstack (frontend e backend)

Boas práticas de programação e segurança

📌 Observações Finais
Sistema desenvolvido para uso interno escolar, mas pode ser expandido para outras instituições.

Valores financeiros no ambiente de teste são simulados.

Futuras melhorias podem incluir:

Transferência de saldo entre alunos

Notificações

Controle avançado de estoque
