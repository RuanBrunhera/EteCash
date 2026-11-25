TRUNCATE TABLE transacao CASCADE;

-- Vendas distribuídas entre os funcionários e os alunos.
-- Inclui vendas na semana atual, no mês atual e nos cinco meses anteriores.
WITH vendas AS (
    INSERT INTO transacao (aluno_rm, funcionario_id, valor_total, data_hora)
    SELECT
        ((ARRAY[
            123456::BIGINT, 20242460054::BIGINT, 20250001::BIGINT, 20250002::BIGINT,
            20250003::BIGINT, 20250004::BIGINT, 20250005::BIGINT, 20250006::BIGINT,
            20250007::BIGINT, 20250008::BIGINT, 20250009::BIGINT, 20250010::BIGINT,
            20250011::BIGINT
        ])[(s.n - 1) % 13 + 1]),
        ((ARRAY[
            (SELECT id FROM funcionario WHERE cpf = '11122233344'),
            (SELECT id FROM funcionario WHERE cpf = '55566677788'),
            (SELECT id FROM funcionario WHERE cpf = '22233344455'),
            (SELECT id FROM funcionario WHERE cpf = '33344455566'),
            (SELECT id FROM funcionario WHERE cpf = '44455566677')
        ])[(s.n - 1) % 5 + 1]),
        0,
        CASE
            WHEN s.n <= 20 THEN
                (date_trunc('week', CURRENT_DATE)::date +
                 ((s.n - 1) % 5))::TIMESTAMP +
                (TIME '12:00:00' + ((s.n % 8) * INTERVAL '25 minutes'))
            ELSE
                (CURRENT_DATE - ((s.n - 21) * 4 + (s.n % 7)) * INTERVAL '1 day')::TIMESTAMP +
                (TIME '11:30:00' + ((s.n % 9) * INTERVAL '20 minutes'))
        END
    FROM generate_series(1, 60) AS s(n)
    RETURNING id
)
SELECT COUNT(*) FROM vendas;
