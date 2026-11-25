INSERT INTO produto (nome, descricao, preco, estoque, ativo) VALUES
('Coxinha', 'Coxinha de frango', 6.50, 100, TRUE),
('Pão de Queijo', 'Pão de queijo médio', 5.00, 80, TRUE),
('Refrigerante Lata', 'Refrigerante 350ml', 7.00, 120, TRUE),
('Suco Natural', 'Suco natural de laranja', 6.00, 70, TRUE),
('Empada', 'Empada de frango', 7.50, 60, TRUE),
('Salgado Assado', 'Salgado assado variado', 8.00, 55, TRUE),
('Sanduíche Natural', 'Sanduíche natural de frango', 12.00, 45, TRUE),
('Chocolate', 'Chocolate ao leite', 6.50, 90, TRUE),
('Biscoito', 'Biscoito doce recheado', 4.50, 100, TRUE),
('Água', 'Água mineral 500ml', 3.50, 150, TRUE)
ON CONFLICT DO NOTHING;
