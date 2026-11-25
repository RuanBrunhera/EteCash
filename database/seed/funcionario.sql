INSERT INTO funcionario (nome, cpf, email, data_nasc, telefone, senha, is_admin, ativo) VALUES
('Carlos Pereira', '11122233344', 'carlos.pereira@etec.sp.gov.br', '1985-06-12', '11987654321', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', FALSE, TRUE),
('Ana Costa', '55566677788', 'ana.costa@etec.sp.gov.br', '1990-09-25', '11991234567', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', TRUE, TRUE),
('Marcos Ribeiro', '22233344455', 'marcos.ribeiro@etec.sp.gov.br', '1988-02-18', '11993451234', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', FALSE, TRUE),
('Fernanda Alves', '33344455566', 'fernanda.alves@etec.sp.gov.br', '1993-07-03', '11994569876', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', FALSE, TRUE),
('Paulo Nascimento', '44455566677', 'paulo.nascimento@etec.sp.gov.br', '1982-11-27', '11995673412', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', FALSE, TRUE)
ON CONFLICT (cpf) DO UPDATE SET
    nome = EXCLUDED.nome,
    email = EXCLUDED.email,
    data_nasc = EXCLUDED.data_nasc,
    telefone = EXCLUDED.telefone,
    is_admin = EXCLUDED.is_admin,
    ativo = EXCLUDED.ativo;