INSERT INTO curso (nome, periodo) VALUES
    ('DS', 'manha'),
    ('DS', 'tarde'),
    ('DS', 'noite'),
    ('ADM', 'manha'),
    ('ADM', 'tarde'),
    ('ADM', 'noite'),
    ('QUIMICA', 'manha'),
    ('QUIMICA', 'tarde'),
    ('RH', 'manha'),
    ('RH', 'tarde'),
    ('RH', 'noite')
ON CONFLICT (nome, periodo) DO NOTHING;