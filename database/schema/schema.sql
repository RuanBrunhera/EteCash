DROP DATABASE IF EXISTS etecash;
CREATE DATABASE etecash;

\c etecash

CREATE TYPE tipo_pagamento AS ENUM ('credito', 'debito');
CREATE TYPE forma_pagamento AS ENUM ('pix', 'boleto');

CREATE TABLE aluno (
    rm INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    serie CHAR(1) NOT NULL,
    saldo NUMERIC(10,2) NOT NULL DEFAULT 0,
    senha VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE funcionario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
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
    aluno_rm INT NOT NULL,
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
    aluno_rm INT NOT NULL,
    tipo tipo_pagamento NOT NULL,
    forma_pagamento forma_pagamento NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_rm) REFERENCES aluno(rm)
);