-- Senha de todos os alunos: password
-- PIN de todos os alunos: 1234
INSERT INTO aluno (rm, nome, serie, curso_id, saldo, senha, pin, chave_pix, ativo)
VALUES
    (123456, 'João Silva', '1', (SELECT id FROM curso WHERE nome = 'DS' AND periodo = 'manha'), 150.00, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'joao.silva@pix', TRUE),
    (20242460054, 'Ruan Aronchi', '3', (SELECT id FROM curso WHERE nome = 'DS' AND periodo = 'manha'), 220.00, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', NULL, TRUE),
    (20250001, 'Maria Oliveira', '1', (SELECT id FROM curso WHERE nome = 'DS' AND periodo = 'tarde'), 95.50, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', '11991110001', TRUE),
    (20250002, 'Lucas Santos', '2', (SELECT id FROM curso WHERE nome = 'DS' AND periodo = 'tarde'), 180.00, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'lucas.santos@pix', TRUE),
    (20250003, 'Ana Beatriz Lima', '3', (SELECT id FROM curso WHERE nome = 'DS' AND periodo = 'noite'), 75.25, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'ana.lima@pix', TRUE),
    (20250004, 'Pedro Henrique Souza', '1', (SELECT id FROM curso WHERE nome = 'ADM' AND periodo = 'manha'), 210.75, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', NULL, TRUE),
    (20250005, 'Camila Rocha', '2', (SELECT id FROM curso WHERE nome = 'ADM' AND periodo = 'tarde'), 125.40, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'camila.rocha@pix', TRUE),
    (20250006, 'Gabriel Mendes', '3', (SELECT id FROM curso WHERE nome = 'ADM' AND periodo = 'noite'), 88.90, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'gabriel.mendes@pix', TRUE),
    (20250007, 'Larissa Fernandes', '1', (SELECT id FROM curso WHERE nome = 'QUIMICA' AND periodo = 'manha'), 145.00, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'larissa.fernandes@pix', TRUE),
    (20250008, 'Bruno Almeida', '2', (SELECT id FROM curso WHERE nome = 'QUIMICA' AND periodo = 'tarde'), 63.50, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', NULL, TRUE),
    (20250009, 'Juliana Castro', '1', (SELECT id FROM curso WHERE nome = 'RH' AND periodo = 'manha'), 175.20, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'juliana.castro@pix', TRUE),
    (20250010, 'Rafael Torres', '2', (SELECT id FROM curso WHERE nome = 'RH' AND periodo = 'tarde'), 112.80, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', '11991110010', TRUE),
    (20250011, 'Beatriz Nunes', '3', (SELECT id FROM curso WHERE nome = 'RH' AND periodo = 'noite'), 54.60, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', NULL, TRUE),
    (20250012, 'Thiago Moreira', '3', (SELECT id FROM curso WHERE nome = 'DS' AND periodo = 'noite'), 0.00, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'thiago.moreira@pix', FALSE)
ON CONFLICT (rm) DO UPDATE SET
    nome = EXCLUDED.nome,
    serie = EXCLUDED.serie,
    curso_id = EXCLUDED.curso_id,
    saldo = EXCLUDED.saldo,
    chave_pix = EXCLUDED.chave_pix,
    ativo = EXCLUDED.ativo;