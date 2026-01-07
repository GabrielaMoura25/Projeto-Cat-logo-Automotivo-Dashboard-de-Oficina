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

describe('API de Produtos - Fluxos de Erro', () => {
  afterEach(async () => {
    await db.execute('DELETE FROM products WHERE marca = ?', ['TESTE']);
  });
  it('retorna 404 ao atualizar produto inexistente', async () => {
    const updateRes = await request(app)
      .put('/api/products/99999999')
      .send({ marca: 'TRW' });
    expect(updateRes.statusCode).toBe(404);
    expect(updateRes.body.message).toMatch(/não encontrado/i);
  });

  it('retorna 400 ao tentar atualizar sem nenhum campo', async () => {
    const createRes = await request(app).post('/api/products').send({
      nome: 'Pastilha de Freio',
      categoria: 'Freios',
      marca: 'TESTE',
      aplicacao_veicular: 'Onix 1.0 2018+',
    });
    const id = createRes.body.id;
    const updateRes = await request(app).put(`/api/products/${id}`).send({});
    expect(updateRes.statusCode).toBe(400);
  });
});
