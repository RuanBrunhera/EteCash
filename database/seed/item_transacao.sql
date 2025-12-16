-- Transação 1 (João Silva)
INSERT INTO item_transacao (transacao_id, produto_id, quantidade, preco_unitario) VALUES
(1, 1, 1, 6.50), -- 1 Coxinha
(1, 2, 1, 5.00), -- 1 Pão de Queijo
(1, 3, 1, 2.00); -- desconto fictício para exemplo

-- Transação 2 (Maria Oliveira)
INSERT INTO item_transacao (transacao_id, produto_id, quantidade, preco_unitario) VALUES
(2, 3, 1, 7.00); -- 1 Refrigerante
