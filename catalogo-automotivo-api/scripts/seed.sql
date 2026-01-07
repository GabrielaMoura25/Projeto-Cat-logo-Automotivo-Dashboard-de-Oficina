-- Popula a tabela products com alguns exemplos
-- A coluna descricao será preenchida automaticamente pela IA ao criar produtos via API
INSERT INTO
    products (
        nome,
        categoria,
        marca,
        aplicacao_veicular
    )
VALUES (
        'Filtro de Óleo',
        'Filtros',
        'Fram',
        'Gol G6 1.6 2014+'
    ),
    (
        'Pastilha de Freio Dianteira',
        'Freios',
        'Cobreq',
        'Onix 1.0 2018+'
    ),
    (
        'Amortecedor Traseiro',
        'Suspensão',
        'Monroe',
        'Civic 2.0 2016+'
    ),
    (
        'Vela de Ignição',
        'Ignição',
        'NGK',
        'Fiesta 1.6 2012+'
    );