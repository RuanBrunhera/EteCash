TRUNCATE TABLE historico;

-- Débitos referentes às compras registradas na cantina.
INSERT INTO historico (aluno_rm, tipo, forma_pagamento, valor, data_hora, transacao_id)
SELECT aluno_rm, 'debito', 'saldo', valor_total, data_hora, id
FROM transacao;

-- Créditos variados ao longo dos últimos meses para cada aluno.
INSERT INTO historico (aluno_rm, tipo, forma_pagamento, valor, data_hora)
SELECT
    a.rm,
    'credito',
    CASE WHEN d.n % 2 = 0 THEN 'pix'::forma_pagamento ELSE 'boleto'::forma_pagamento END,
    (ARRAY[20.00, 30.00, 50.00, 75.00, 100.00])[((d.n + (a.rm % 5)::INTEGER) % 5) + 1],
    (CURRENT_DATE - ((d.n - 1) * 14 + (a.rm % 9)) * INTERVAL '1 day')::TIMESTAMP +
        (TIME '09:15:00' + (d.n * INTERVAL '35 minutes'))
FROM aluno a
CROSS JOIN generate_series(1, 4) AS d(n)
WHERE a.ativo = TRUE;
