-- Dois itens na maior parte das vendas para criar bons dados no top 10 de produtos.
INSERT INTO item_transacao (transacao_id, produto_id, quantidade, preco_unitario)
SELECT
    t.id,
    ((t.id - 1) % 10) + 1,
    1 + ((t.id - 1) % 3),
    p.preco
FROM transacao t
JOIN produto p ON p.id = ((t.id - 1) % 10) + 1;

INSERT INTO item_transacao (transacao_id, produto_id, quantidade, preco_unitario)
SELECT
    t.id,
    ((t.id + 3) % 10) + 1,
    1 + (t.id % 2),
    p.preco
FROM transacao t
JOIN produto p ON p.id = ((t.id + 3) % 10) + 1
WHERE t.id % 3 <> 0;

-- Mantém o valor da venda consistente com os itens cadastrados.
UPDATE transacao t
SET valor_total = itens.total
FROM (
    SELECT transacao_id, SUM(quantidade * preco_unitario) AS total
    FROM item_transacao
    GROUP BY transacao_id
) itens
WHERE t.id = itens.transacao_id;
