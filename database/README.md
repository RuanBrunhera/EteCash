# 📂 Database — EteCash

Este diretório contém os arquivos responsáveis pela **estrutura**, **organização** e **dados iniciais** do banco de dados do sistema **EteCash**, utilizado para gerenciamento de pagamentos na cantina escolar.

O banco de dados foi modelado com base em boas práticas de normalização, visando simplicidade, integridade dos dados e fácil manutenção.

---

## 🛠 Tecnologias Utilizadas

- **SGBD:** PostgreSQL
- **Modelo:** Relacional
- **Linguagem:** SQL

---

## 📄 Estrutura dos Arquivos

### `schema.sql`

Arquivo responsável pela criação da estrutura do banco de dados, incluindo:

- Tabelas
- Chaves primárias
- Chaves estrangeiras
- Restrições de integridade

Nenhum dado é inserido neste arquivo.

---

### `seed.sql`

Contém dados iniciais para testes e validação do sistema, simulando:

- Alunos
- Funcionários da cantina
- Produtos
- Transações e itens de transação

Este arquivo é utilizado apenas em ambiente de desenvolvimento e testes.

---

### `migrations/`

Diretório reservado para futuras alterações estruturais no banco de dados, como:

- Adição de novas tabelas
- Alterações de colunas
- Evolução do esquema ao longo do projeto

Atualmente, este diretório pode estar vazio.

---

## 🚀 Como Executar o Banco de Dados

### 1️⃣ Criar o banco no PostgreSQL
```sql
CREATE DATABASE etecash;
📌 Observação:
O PostgreSQL não possui suporte nativo ao comando CREATE DATABASE IF NOT EXISTS.
Caso o banco já exista, o comando retornará uma mensagem informativa.

2️⃣ Acessar o banco criado
sql
Copiar código
\c etecash
3️⃣ Executar os arquivos SQL
sql
Copiar código
\i schema.sql
\i seed.sql
📌 Importante:
O arquivo schema.sql deve ser executado antes do seed.sql, pois o segundo depende da estrutura criada no primeiro.

📌 Observações
O banco de dados foi projetado para uso interno escolar.

Os valores financeiros utilizados no seed.sql são simulados.

O sistema pode ser expandido futuramente para suportar novas funcionalidades.

🎓 Contexto Acadêmico
Este banco de dados faz parte do Trabalho de Conclusão de Curso (TCC) do curso técnico, tendo como objetivo aplicar conceitos de:

Modelagem de dados

Banco de dados relacional

Integridade referencial

Boas práticas de desenvolvimento