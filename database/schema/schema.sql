DROP DATABASE IF EXISTS etecash;
CREATE DATABASE etecash;

\c etecash

CREATE TYPE tipo_pagamento AS ENUM ('credito', 'debito');
CREATE TYPE forma_pagamento AS ENUM ('pix', 'boleto');

CREATE TABLE curso (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(20) NOT NULL,
    periodo VARCHAR(10) NOT NULL CHECK (periodo IN ('manha', 'tarde', 'noite')),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (nome, periodo)
);

CREATE TABLE aluno (
    rm BIGINT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    serie CHAR(1) NOT NULL,
    curso_id INT NOT NULL REFERENCES curso(id),
    saldo NUMERIC(10,2) NOT NULL DEFAULT 0,
    senha VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE funcionario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    data_nasc DATE,
    telefone VARCHAR(20),
    senha VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    preco NUMERIC(10,2) NOT NULL,
    estoque INT NOT NULL CHECK (estoque >= 0),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transacao (
    id SERIAL PRIMARY KEY,
    aluno_rm BIGINT NOT NULL,
    funcionario_id INT NOT NULL,
    valor_total NUMERIC(10,2) NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_rm) REFERENCES aluno(rm),
    FOREIGN KEY (funcionario_id) REFERENCES funcionario(id)
);

CREATE TABLE item_transacao (
    id SERIAL PRIMARY KEY,
    transacao_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(10,2) NOT NULL,
    FOREIGN KEY (transacao_id) REFERENCES transacao(id),
    FOREIGN KEY (produto_id) REFERENCES produto(id)
);

CREATE TABLE historico (
    id SERIAL PRIMARY KEY,
    aluno_rm BIGINT NOT NULL,
    tipo tipo_pagamento NOT NULL,
    forma_pagamento forma_pagamento NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_rm) REFERENCES aluno(rm)
);