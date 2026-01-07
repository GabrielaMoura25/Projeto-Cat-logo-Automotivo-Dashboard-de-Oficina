const request = require('supertest');
const express = require('express');
const productRoutes = require('../../src/routes/product.routes');
const db = require('../../src/database/connection');

const app = express();
app.use(express.json());
app.use('/api', productRoutes);

jest.mock('../../src/services/ai.service', () => ({
  gerarDescricaoComRetry: async () => 'Descrição gerada pela IA (mock)',
}));

describe('API de Produtos', () => {
  afterEach(async () => {
    await db.execute('DELETE FROM products WHERE marca = ?', ['TESTE']);
  });
  it('cria produto com sucesso', async () => {
    const res = await request(app).post('/api/products').send({
      nome: 'Filtro de Ar',
      categoria: 'Filtros',
      marca: 'TESTE',
      aplicacao_veicular: 'Gol G6 1.6 2014+',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.message).toMatch(/sucesso/i);
  });

  it('rejeita produto sem nome', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ categoria: 'Filtros' });
    expect(res.statusCode).toBe(400);
  });

  it('lista produtos', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('busca produtos por texto livre', async () => {
    const res = await request(app).get('/api/products/search?q=Filtro');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('atualiza produto existente', async () => {
    const createRes = await request(app).post('/api/products').send({
      nome: 'Pastilha de Freio',
      categoria: 'Freios',
      marca: 'TESTE',
      aplicacao_veicular: 'Onix 1.0 2018+',
    });
    const id = createRes.body.id;
    const updateRes = await request(app)
      .put(`/api/products/${id}`)
      .send({ marca: 'TESTE' });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.message).toMatch(/sucesso/i);
  });
});

afterAll(async () => {
  await db.end();
});
